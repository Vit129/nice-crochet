import { Product } from '@/types/product';

/**
 * Domain-specific bilingual synonym and semantic knowledge graph.
 * Maps canonical English concepts to Thai and English variants/synonyms.
 */
export const SYNONYM_MAP: Record<string, string[]> = {
  // --- Items / Fruits / Themes ---
  strawberry: [
    'strawberry',
    'strawberries',
    'สตรอเบอร์รี่',
    'สตรอเบอรี่',
    'สตรอว์เบอร์รี',
    'สตรอเบอรรี่',
    'สตอเบอรี่',
    'สตอเบอร์รี่',
    'สตอ',
    'สตรอ',
  ],
  carrot: ['carrot', 'carrots', 'แครอท', 'แคร์รอต', 'แคร์ร็อต'],
  pineapple: ['pineapple', 'สับปะรด', 'สัปปะรด', 'พายแอปเปิ้ล', 'พายแอปเปิล'],
  flower: [
    'flower',
    'flowers',
    'floral',
    'daisy',
    'ดอกไม้',
    'ดอก',
    'เดซี่',
    'ฟลาวเวอร์',
    'ลายดอก',
    'กลีบดอก',
  ],
  charm: [
    'charm',
    'charms',
    'keychain',
    'keychains',
    'pendant',
    'พวงกุญแจ',
    'ชาร์ม',
    'ที่ห้อย',
    'ห้อยกระเป๋า',
    'พวงห้อย',
  ],
  bucket: [
    'bucket',
    'ทรงถัง',
    'บักเก็ต',
    'บักเกต',
    'ถัง',
    'กระเป๋าถัง',
  ],
  lattice: [
    'lattice',
    'mesh',
    'ตาข่าย',
    'แลตทิซ',
    'โปร่ง',
    'ถักโปร่ง',
    'ลายตาข่าย',
    'รู',
  ],
  shoulder: [
    'shoulder',
    'สะพายไหล่',
    'สะพาย',
    'ไหล่',
    'สายสะพาย',
    'คล้องไหล่',
  ],
  handmade: [
    'handmade',
    'crochet',
    'knit',
    'knitting',
    'ถัก',
    'แฮนด์เมด',
    'ทำมือ',
    'โครเชต์',
    'ไหมพรม',
  ],

  // --- Categories ---
  tote: [
    'tote',
    'totes',
    'bag',
    'bags',
    'market',
    'กระเป๋า',
    'กระเป๋าถัก',
    'กระเป๋าหิ้ว',
    'กระเป๋าสะพาย',
    'ถุงผ้า',
    'โท้ท',
    'โทท',
    'ย่าม',
  ],
  pouch: [
    'pouch',
    'pouches',
    'purse',
    'purses',
    'เพาช์',
    'เพ้าช์',
    'กระเป๋าเล็ก',
    'กระเป๋าเหรียญ',
    'กระเป๋าใส่เหรียญ',
    'ซอง',
    'กระเป๋าจิ๋ว',
  ],
  card: [
    'card',
    'cards',
    'holder',
    'holders',
    'wallet',
    'wallets',
    'การ์ด',
    'ใส่บัตร',
    'ที่ใส่บัตร',
    'กระเป๋าบัตร',
    'กระเป๋าใส่บัตร',
    'เก็บบัตร',
    'นามบัตร',
  ],

  // --- Colours ---
  red: [
    'red',
    'cherry',
    'crimson',
    'ruby',
    'แดง',
    'สีแดง',
    'เชอร์รี่',
    'เชอรี่',
    'แดงเชอร์รี่',
  ],
  cream: [
    'cream',
    'ivory',
    'off-white',
    'ครีม',
    'สีครีม',
    'ขาวครีม',
    'ขาวนวล',
  ],
  white: [
    'white',
    'ขาว',
    'สีขาว',
  ],
  brown: [
    'brown',
    'chocolate',
    'น้ำตาล',
    'สีน้ำตาล',
    'น้ำตาลเข้ม',
  ],
  tan: [
    'tan',
    'beige',
    'sand',
    'แทน',
    'สีแทน',
    'เบจ',
    'สีเบจ',
    'น้ำตาลอ่อน',
  ],
  camel: [
    'camel',
    'khaki',
    'คาเมล',
    'สีคาเมล',
    'กากี',
    'สีกากี',
    'อูฐ',
  ],
  yellow: [
    'yellow',
    'gold',
    'golden',
    'เหลือง',
    'สีเหลือง',
    'ทอง',
  ],
  mustard: [
    'mustard',
    'มัสตาร์ด',
    'สีมัสตาร์ด',
    'เหลืองมัสตาร์ด',
    'มัสตาด',
  ],
  orange: [
    'orange',
    'carrot',
    'ส้ม',
    'สีส้ม',
  ],
  green: [
    'green',
    'sage',
    'olive',
    'เขียว',
    'สีเขียว',
    'เขียวตุ่น',
    'เขียวเสจ',
    'เสจ',
    'เซจ',
  ],
  plum: [
    'plum',
    'purple',
    'wine',
    'maroon',
    'berry',
    'พลัม',
    'สีพลัม',
    'ม่วง',
    'สีม่วง',
    'ไวน์',
    'เปลือกมังคุด',
  ],
  charcoal: [
    'charcoal',
    'grey',
    'gray',
    'black',
    'ชาโคล',
    'สีชาโคล',
    'เทา',
    'สีเทา',
    'ดำ',
  ],
  denim: [
    'denim',
    'blue',
    'navy',
    'เดนิม',
    'สียีนส์',
    'ยีนส์',
    'น้ำเงิน',
    'สีน้ำเงิน',
    'ฟ้า',
  ],
};

// Build inverted fast-lookup index: synonym -> canonical key
const INVERTED_SYNONYM_INDEX = new Map<string, string[]>();

Object.entries(SYNONYM_MAP).forEach(([canonicalKey, synonyms]) => {
  synonyms.forEach((syn) => {
    const norm = syn.trim().toLowerCase();
    const existing = INVERTED_SYNONYM_INDEX.get(norm) ?? [];
    if (!existing.includes(canonicalKey)) {
      existing.push(canonicalKey);
    }
    INVERTED_SYNONYM_INDEX.set(norm, existing);
  });
});

/**
 * Remove leading "สี" or handle common Thai compound prefixes
 */
function normalizeThaiPrefixes(token: string): string[] {
  const results = new Set<string>([token]);
  if (token.startsWith('สี') && token.length > 2) {
    results.add(token.slice(2)); // e.g. "สีแดง" -> "แดง"
  }
  if (token.startsWith('กระเป๋า') && token.length > 7) {
    results.add('กระเป๋า');
    results.add(token.slice(7)); // e.g. "กระเป๋าใส่บัตร" -> "ใส่บัตร"
  }
  if (token.startsWith('ที่') && token.length > 3) {
    results.add(token.slice(3)); // e.g. "ที่ใส่บัตร" -> "ใส่บัตร"
  }
  return Array.from(results);
}

/**
 * Tokenize a search query into sub-terms, supporting space separation
 * and compound Thai words found in our synonym dictionary.
 */
export function tokenizeQuery(query: string): string[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  // Split by whitespace
  const rawTokens = clean.split(/\s+/).filter(Boolean);
  const finalTokens = new Set<string>();

  rawTokens.forEach((raw) => {
    finalTokens.add(raw);
    const subTerms = normalizeThaiPrefixes(raw);
    subTerms.forEach((st) => finalTokens.add(st));

    // Check for compound Thai substrings in dictionary (e.g. "กระเป๋าแดง" -> "กระเป๋า" + "แดง")
    for (const syn of INVERTED_SYNONYM_INDEX.keys()) {
      if (syn.length >= 2 && raw.includes(syn) && raw !== syn) {
        finalTokens.add(syn);
      }
    }
  });

  return Array.from(finalTokens);
}

/**
 * Get all expanded keywords/synonyms for a given search token.
 */
export function getExpandedKeywords(token: string): string[] {
  const norm = token.trim().toLowerCase();
  const matchedCanonicalKeys = new Set<string>();

  // 1. Direct match
  const direct = INVERTED_SYNONYM_INDEX.get(norm);
  if (direct) {
    direct.forEach((k) => matchedCanonicalKeys.add(k));
  }

  // 2. Substring / partial match in dictionary
  if (matchedCanonicalKeys.size === 0) {
    for (const [syn, keys] of INVERTED_SYNONYM_INDEX.entries()) {
      if (norm.includes(syn) || syn.includes(norm)) {
        keys.forEach((k) => matchedCanonicalKeys.add(k));
      }
    }
  }

  // Expand all canonical keys back to their synonym list
  const expanded = new Set<string>([norm]);
  matchedCanonicalKeys.forEach((key) => {
    expanded.add(key);
    const list = SYNONYM_MAP[key];
    if (list) {
      list.forEach((w) => expanded.add(w.toLowerCase()));
    }
  });

  return Array.from(expanded);
}

export interface SearchMatchResult {
  product: Product;
  score: number;
  matchedTokensCount: number;
}

/**
 * Calculate relevance score for a product against a search query.
 */
export function scoreProduct(product: Product, query: string): number {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return 1; // Match everything if query is empty

  const pName = product.name.toLowerCase();
  const pCat = product.category.toLowerCase();
  const pColours = product.colours.map((c) => c.toLowerCase());
  const pDesc = (product.description ?? '').toLowerCase();
  const pAlt = product.alt.toLowerCase();

  let totalScore = 0;
  let matchedTokens = 0;

  tokens.forEach((token) => {
    const expansions = getExpandedKeywords(token);
    let tokenScore = 0;

    // Check direct token / expansion matches
    for (const word of expansions) {
      // 1. Product Name (Highest Weight)
      if (pName === word) {
        tokenScore = Math.max(tokenScore, 60);
      } else if (pName.includes(word)) {
        tokenScore = Math.max(tokenScore, 45);
      }

      // 2. Category
      if (pCat === word) {
        tokenScore = Math.max(tokenScore, 35);
      } else if (pCat.includes(word)) {
        tokenScore = Math.max(tokenScore, 25);
      }

      // 3. Colours
      if (pColours.some((c) => c === word || c.includes(word))) {
        tokenScore = Math.max(tokenScore, 30);
      }

      // 4. Description & Alt
      if (pDesc.includes(word) || pAlt.includes(word)) {
        tokenScore = Math.max(tokenScore, 15);
      }
    }

    if (tokenScore > 0) {
      totalScore += tokenScore;
      matchedTokens++;
    }
  });

  if (matchedTokens === 0) return 0;

  // Bonus for matching multiple distinct search tokens (Google-like AND boost)
  if (tokens.length > 1 && matchedTokens >= 2) {
    totalScore += matchedTokens * 30;
  }

  return totalScore;
}

export interface SearchOptions {
  activeCategories?: Set<string>;
  activeColours?: Set<string>;
  sortBy?: 'default' | 'popular';
  clickCounts?: Record<string, number>;
}

/**
 * Filter and rank products using the bilingual search engine.
 */
export function searchProducts(
  products: Product[],
  query: string,
  options: SearchOptions = {}
): Product[] {
  const {
    activeCategories = new Set(),
    activeColours = new Set(),
    sortBy = 'default',
    clickCounts = {},
  } = options;

  const trimmedQuery = query.trim();

  // 1. Filter by category, colour, and search score
  const scored: SearchMatchResult[] = [];

  for (const p of products) {
    // Check Category filter
    if (activeCategories.size > 0 && !activeCategories.has(p.category)) {
      continue;
    }

    // Check Colour filter
    if (
      activeColours.size > 0 &&
      !p.colours.some((c) => activeColours.has(c))
    ) {
      continue;
    }

    // Check Search query
    if (trimmedQuery) {
      const score = scoreProduct(p, trimmedQuery);
      if (score > 0) {
        scored.push({
          product: p,
          score,
          matchedTokensCount: 1,
        });
      }
    } else {
      scored.push({
        product: p,
        score: 1,
        matchedTokensCount: 0,
      });
    }
  }

  // 2. Sort by relevance score (descending), then popularity / default order
  scored.sort((a, b) => {
    // Higher search relevance score comes first
    if (trimmedQuery && b.score !== a.score) {
      return b.score - a.score;
    }

    // Secondary: Popularity sort if requested
    if (sortBy === 'popular') {
      const popA = clickCounts[a.product.id] ?? 0;
      const popB = clickCounts[b.product.id] ?? 0;
      if (popB !== popA) return popB - popA;
    }

    return 0;
  });

  return scored.map((s) => s.product);
}
