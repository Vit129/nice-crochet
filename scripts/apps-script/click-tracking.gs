// ════════════════════════════════════════════════
//  NICE CROCHET — Click Tracking Backend
//  ชื่อไฟล์: Code.gs
//
//  ทำไมต้องใช้ Apps Script: เว็บนี้ deploy เป็น static site (GitHub Pages,
//  ไม่มี server) — Apps Script Web App ทำหน้าที่เป็น write endpoint ที่ไม่ต้อง
//  ดูแล server เอง เหมือน pattern เดียวกับ My-Investment-Port/
//  syncLocalStorageToGoogleSheets.gs
//
//  วิธี Deploy:
//    1. สร้าง Google Sheet ใหม่ (ว่างเปล่าก็ได้ — สคริปต์จะสร้าง sheet ย่อยเอง)
//    2. เปิด Extensions → Apps Script, วางโค้ดนี้ทับ (ตั้งชื่อไฟล์ Code.gs)
//    3. แก้ SHEET_ID ด้านล่างเป็น ID ของ Sheet ที่สร้าง (ดูจาก URL ของ Sheet)
//    4. เลือกฟังก์ชัน setApiToken ที่ dropdown ด้านบน แล้วกด Run ครั้งเดียว
//       (จะขอ authorize ครั้งแรก) — ไปดู token ที่ View → Logs
//    5. Deploy → New deployment → Type: Web app
//       Execute as: Me, Who has access: Anyone
//       → Copy Web App URL
//    6. ใส่ Web App URL ใน NEXT_PUBLIC_CLICK_TRACKING_URL
//       และ token จากขั้นตอน 4 ใน NEXT_PUBLIC_CLICK_TRACKING_TOKEN
//       (ตั้งใน .env.local สำหรับ local dev, และใน GitHub Actions repo
//       secrets + pages.yml env: สำหรับ production build)
//
//  วิธีแก้โค้ดแล้ว deploy ใหม่:
//    Deploy → Manage deployments → Edit → Version: New version → Deploy
//    (URL เดิมใช้ได้ต่อ ไม่ต้องแก้ env var ใหม่)
// ════════════════════════════════════════════════

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
const SHEET_CLICKS = 'ProductClicks';
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

    return jsonOut({ ok: false, error: 'Unknown action. Use ?action=counts or ?action=click' });
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
