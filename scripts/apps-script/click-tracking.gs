// ════════════════════════════════════════════════
//  NICE CROCHET — Click Tracking + Product Flags Backend
//  ชื่อไฟล์: Code.gs
//
//  ทำไมต้องใช้ Apps Script: เว็บนี้ deploy เป็น static site (GitHub Pages,
//  ไม่มี server) — Apps Script Web App ทำหน้าที่เป็น endpoint ที่ไม่ต้อง
//  ดูแล server เอง เหมือน pattern เดียวกับ My-Investment-Port/
//  syncLocalStorageToGoogleSheets.gs
//
//  Backend นี้ทำ 2 อย่าง:
//    1. Click tracking (นับยอดกดดูสินค้า) — sheet "ProductClicks"
//    2. Product visibility flags (showOnShelf / showOnHome ที่แก้ได้จาก
//       Sheet โดยตรง ไม่ต้องแก้โค้ด) — sheet "ProductFlags"
//       products.json ในโค้ดยังเป็นค่าหลัก/fallback เสมอ — Sheet นี้แค่
//       override 2 ค่านี้ตอน runtime เท่านั้น (ดู ARCHITECTURE.md)
//
//  วิธี Deploy:
//    1. สร้าง Google Sheet ใหม่ (ว่างเปล่าก็ได้ — สคริปต์จะสร้าง sheet ย่อยเอง)
//    2. เปิด Extensions → Apps Script, วางโค้ดนี้ทับ (ตั้งชื่อไฟล์ Code.gs)
//    3. แก้ SHEET_ID ด้านล่างเป็น ID ของ Sheet ที่สร้าง (ดูจาก URL ของ Sheet)
//    4. เลือกฟังก์ชัน setApiToken ที่ dropdown ด้านบน แล้วกด Run ครั้งเดียว
//       (จะขอ authorize ครั้งแรก) — ไปดู token ที่ View → Logs
//    5. เลือกฟังก์ชัน seedProductFlags แล้วกด Run ครั้งเดียว — จะสร้าง
//       sheet "ProductFlags" พร้อมค่าเริ่มต้นจาก products.json ปัจจุบัน
//       (13 สินค้า) ให้อัตโนมัติ ไปแก้ค่า TRUE/FALSE ในนั้นได้เลยหลังจากนี้
//    6. Deploy → New deployment → Type: Web app
//       Execute as: Me, Who has access: Anyone
//       → Copy Web App URL
//    7. ใส่ Web App URL ใน NEXT_PUBLIC_CLICK_TRACKING_URL
//       และ token จากขั้นตอน 4 ใน NEXT_PUBLIC_CLICK_TRACKING_TOKEN
//       (ตั้งใน .env.local สำหรับ local dev, และใน GitHub Actions repo
//       secrets + pages.yml env: สำหรับ production build) — URL เดียวกัน
//       ใช้ทั้ง click tracking และ product flags
//
//  วิธีแก้โค้ดแล้ว deploy ใหม่:
//    Deploy → Manage deployments → Edit → Version: New version → Deploy
//    (URL เดิมใช้ได้ต่อ ไม่ต้องแก้ env var ใหม่)
// ════════════════════════════════════════════════

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
const SHEET_CLICKS = 'ProductClicks';
const SHEET_FLAGS = 'ProductFlags';
const API_TOKEN = PropertiesService.getScriptProperties().getProperty('API_TOKEN');

// รันครั้งเดียวจาก Apps Script editor เพื่อ set/หมุน token ใหม่
function setApiToken() {
  const newToken = Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperty('API_TOKEN', newToken);
  Logger.log('New API_TOKEN: ' + newToken);
}

// เทียบแบบ constant-time กัน timing attack
function isValidToken(token) {
  if (!API_TOKEN || typeof token !== 'string') return false;
  const a = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token);
  const b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, API_TOKEN);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// ทุก action ผ่าน GET (ทั้งอ่านและเขียน) — เลี่ยง CORS preflight จาก static site
function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'counts') {
      return jsonOut({ ok: true, counts: getCounts() });
    }

    if (action === 'click') {
      const token = e.parameter.token;
      if (!isValidToken(token)) return jsonOut({ ok: false, error: 'Unauthorized' });
      const productId = e.parameter.productId;
      if (!productId) return jsonOut({ ok: false, error: 'Missing productId' });
      recordClick(productId);
      return jsonOut({ ok: true });
    }

    if (action === 'flags') {
      return jsonOut({ ok: true, flags: getFlags() });
    }

    return jsonOut({ ok: false, error: 'Unknown action. Use ?action=counts, ?action=click, or ?action=flags' });
  } catch (err) {
    return jsonOut({ ok: false, error: err.message });
  }
}

function getCounts() {
  const sheet = getOrCreateSheet();
  const rows = sheet.getDataRange().getValues();
  const counts = {};
  rows.slice(1).forEach(function (row) {
    if (row[0]) counts[String(row[0])] = Number(row[1]) || 0;
  });
  return counts;
}

function recordClick(productId) {
  const sheet = getOrCreateSheet();
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === productId) {
      sheet.getRange(i + 1, 2).setValue((Number(rows[i][1]) || 0) + 1);
      sheet.getRange(i + 1, 3).setValue(toBangkokISO());
      return;
    }
  }
  sheet.appendRow([productId, 1, toBangkokISO()]);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_CLICKS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_CLICKS);
    sheet.appendRow(['productId', 'clickCount', 'lastClickedAt']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }
  return sheet;
}

// ── Product visibility flags (showOnShelf / showOnHome) ──

function getFlags() {
  const sheet = getOrCreateFlagsSheet();
  const rows = sheet.getDataRange().getValues();
  const flags = {};
  rows.slice(1).forEach(function (row) {
    const productId = row[0];
    if (!productId) return;
    // Real-world cell values: a checkbox cell is a real boolean, but a
    // manually-typed cell can be "TRUE"/"FALSE"/"yes"/"" — skip a row that
    // doesn't parse as a clear boolean rather than guessing wrong.
    const shelf = parseFlagCell(row[1]);
    const home = parseFlagCell(row[2]);
    if (shelf === null || home === null) return;
    flags[String(productId)] = { showOnShelf: shelf, showOnHome: home };
  });
  return flags;
}

function parseFlagCell(value) {
  if (typeof value === 'boolean') return value;
  const s = String(value).trim().toLowerCase();
  if (s === 'true' || s === 'yes' || s === '1') return true;
  if (s === 'false' || s === 'no' || s === '0') return false;
  return null; // blank or unrecognized — caller skips this row
}

function getOrCreateFlagsSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_FLAGS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_FLAGS);
    sheet.appendRow(['productId', 'showOnShelf', 'showOnHome']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }
  return sheet;
}

// รันครั้งเดียวจาก Apps Script editor — สร้าง/เติม sheet ProductFlags ด้วย
// ค่าเริ่มต้นจาก products.json ปัจจุบัน (13 สินค้า, ณ วันที่เขียนสคริปต์นี้)
// เป็นแค่ค่าตั้งต้นให้แก้ต่อ ไม่ใช่ live sync กับ products.json
function seedProductFlags() {
  const seed = [
    ['cherry-bucket-tote', true, true],
    ['mustard-market-tote', true, false],
    ['camel-bucket-tote', true, false],
    ['cherry-rectangle-tote', true, false],
    ['lattice-two-tone-tote', true, true],
    ['tan-mini-market-bag', true, false],
    ['tan-tote-with-flower', true, true],
    ['charcoal-mesh-tote', true, false],
    ['sage-plum-tote-pair', true, false],
    ['cherry-flap-pouch', true, true],
    ['mustard-leaf-flap-pouch', true, true],
    ['two-tone-card-holder', true, true],
    ['cherry-sky-flower-charm', true, true],
  ];
  const sheet = getOrCreateFlagsSheet();
  const existing = sheet.getDataRange().getValues();
  const existingIds = new Set(existing.slice(1).map(function (row) { return row[0]; }));
  seed.forEach(function (row) {
    if (!existingIds.has(row[0])) sheet.appendRow(row);
  });
  Logger.log('ProductFlags seeded: ' + seed.length + ' rows checked, sheet now has ' + (sheet.getLastRow() - 1) + ' data rows.');
}

function toBangkokISO() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const bangkok = new Date(utc + 7 * 3600000);
  return Utilities.formatDate(bangkok, 'GMT', "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ─── TEST — กด Run ใน Editor แล้วดู Execution Log ───
function testClickTracking() {
  recordClick('cherry-bucket-tote');
  recordClick('cherry-bucket-tote');
  recordClick('mustard-market-tote');
  Logger.log('Counts: ' + JSON.stringify(getCounts()));
}

function testProductFlags() {
  seedProductFlags();
  Logger.log('Flags: ' + JSON.stringify(getFlags()));
}
