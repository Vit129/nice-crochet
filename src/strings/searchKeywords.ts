/** Search synonyms in Thai and English, kept outside the search algorithm. */
export const SYNONYM_MAP: Record<string, string[]> = {
  strawberry: ['strawberry', 'strawberries', 'สตรอเบอร์รี่', 'สตรอเบอรี่', 'สตรอว์เบอร์รี', 'สตรอเบอรรี่', 'สตอเบอรี่', 'สตอเบอร์รี่', 'สตอ', 'สตรอ'],
  carrot: ['carrot', 'carrots', 'แครอท', 'แคร์รอต', 'แคร์ร็อต'],
  pineapple: ['pineapple', 'สับปะรด', 'สัปปะรด', 'พายแอปเปิ้ล', 'พายแอปเปิล'],
  flower: ['flower', 'flowers', 'floral', 'daisy', 'ดอกไม้', 'ดอก', 'เดซี่', 'ฟลาวเวอร์', 'ลายดอก', 'กลีบดอก'],
  charm: ['charm', 'charms', 'keychain', 'keychains', 'pendant', 'พวงกุญแจ', 'ชาร์ม', 'ที่ห้อย', 'ห้อยกระเป๋า', 'พวงห้อย'],
  bucket: ['bucket', 'ทรงถัง', 'บักเก็ต', 'บักเกต', 'ถัง', 'กระเป๋าถัง'],
  lattice: ['lattice', 'mesh', 'ตาข่าย', 'แลตทิซ', 'โปร่ง', 'ถักโปร่ง', 'ลายตาข่าย', 'รู'],
  shoulder: ['shoulder', 'สะพายไหล่', 'สะพาย', 'ไหล่', 'สายสะพาย', 'คล้องไหล่'],
  handmade: ['handmade', 'crochet', 'knit', 'knitting', 'ถัก', 'แฮนด์เมด', 'ทำมือ', 'โครเชต์', 'ไหมพรม'],
  tote: ['tote', 'totes', 'bag', 'bags', 'market', 'กระเป๋า', 'กระเป๋าถัก', 'กระเป๋าหิ้ว', 'กระเป๋าสะพาย', 'ถุงผ้า', 'โท้ท', 'โทท', 'ย่าม'],
  pouch: ['pouch', 'pouches', 'purse', 'purses', 'เพาช์', 'เพ้าช์', 'กระเป๋าเล็ก', 'กระเป๋าเหรียญ', 'กระเป๋าใส่เหรียญ', 'ซอง', 'กระเป๋าจิ๋ว'],
  card: ['card', 'cards', 'holder', 'holders', 'wallet', 'wallets', 'การ์ด', 'ใส่บัตร', 'ที่ใส่บัตร', 'กระเป๋าบัตร', 'กระเป๋าใส่บัตร', 'เก็บบัตร', 'นามบัตร'],
  red: ['red', 'cherry', 'crimson', 'ruby', 'แดง', 'สีแดง', 'เชอร์รี่', 'เชอรี่', 'แดงเชอร์รี่'],
  cream: ['cream', 'ivory', 'off-white', 'ครีม', 'สีครีม', 'ขาวครีม', 'ขาวนวล'],
  white: ['white', 'ขาว', 'สีขาว'],
  brown: ['brown', 'chocolate', 'น้ำตาล', 'สีน้ำตาล', 'น้ำตาลเข้ม'],
  tan: ['tan', 'beige', 'sand', 'แทน', 'สีแทน', 'เบจ', 'สีเบจ', 'น้ำตาลอ่อน'],
  camel: ['camel', 'khaki', 'คาเมล', 'สีคาเมล', 'กากี', 'สีกากี', 'อูฐ'],
  yellow: ['yellow', 'gold', 'golden', 'เหลือง', 'สีเหลือง', 'ทอง'],
  mustard: ['mustard', 'มัสตาร์ด', 'สีมัสตาร์ด', 'เหลืองมัสตาร์ด', 'มัสตาด'],
  orange: ['orange', 'carrot', 'ส้ม', 'สีส้ม'],
  green: ['green', 'sage', 'olive', 'เขียว', 'สีเขียว', 'เขียวตุ่น', 'เขียวเสจ', 'เสจ', 'เซจ'],
  plum: ['plum', 'purple', 'wine', 'maroon', 'berry', 'พลัม', 'สีพลัม', 'ม่วง', 'สีม่วง', 'ไวน์', 'เปลือกมังคุด'],
  charcoal: ['charcoal', 'grey', 'gray', 'black', 'ชาโคล', 'สีชาโคล', 'เทา', 'สีเทา', 'ดำ'],
  denim: ['denim', 'blue', 'navy', 'เดนิม', 'สียีนส์', 'ยีนส์', 'น้ำเงิน', 'สีน้ำเงิน', 'ฟ้า'],
};

export const thaiSearchPrefixes = {
  colour: 'สี',
  bag: 'กระเป๋า',
  holder: 'ที่',
} as const;
