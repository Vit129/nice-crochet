// Run: npm test   (node:test + tsx, no extra dependency)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getExpandedKeywords, searchProducts, tokenizeQuery } from '../src/lib/search';
import type { Product } from '../src/types/product';

const base = { photos: [] as string[], alt: '', showOnShelf: true, showOnHome: false };
const products: Product[] = [
  { ...base, id: 'carrot', name: 'Orange carrot pouch', category: 'Pouches & purses', colours: ['Orange'], alt: 'carrot pouch' },
  { ...base, id: 'tote', name: 'Camel bucket tote', category: 'Market totes & bags', colours: ['Camel'], alt: 'bucket tote' },
  { ...base, id: 'charm', name: 'Pink flower charm', category: 'Flower charms', colours: ['Pink'], alt: 'flower charm' },
];
const ids = (ps: Product[]) => ps.map((p) => p.id);

test('tokenizeQuery: empty and whitespace give no tokens', () => {
  assert.deepEqual(tokenizeQuery(''), []);
  assert.deepEqual(tokenizeQuery('   '), []);
});

test('tokenizeQuery: lowercases and splits on whitespace', () => {
  const t = tokenizeQuery('Red  TOTE');
  assert.ok(t.includes('red') && t.includes('tote'));
});

test('getExpandedKeywords: English expands to Thai synonyms', () => {
  assert.ok(getExpandedKeywords('strawberry').includes('สตรอเบอร์รี่'));
});

test('getExpandedKeywords: Thai expands to the English concept', () => {
  assert.ok(getExpandedKeywords('แครอท').includes('carrot'));
});

test('searchProducts: empty query returns everything in order', () => {
  assert.deepEqual(ids(searchProducts(products, '')), ['carrot', 'tote', 'charm']);
});

test('searchProducts: finds by name, ranks the direct hit first', () => {
  assert.equal(ids(searchProducts(products, 'carrot'))[0], 'carrot');
});

test('searchProducts: Thai query finds the English-named product', () => {
  assert.ok(ids(searchProducts(products, 'แครอท')).includes('carrot'));
});

test('searchProducts: category filter', () => {
  const r = searchProducts(products, '', { activeCategories: new Set(['Flower charms']) });
  assert.deepEqual(ids(r), ['charm']);
});

test('searchProducts: colour filter', () => {
  const r = searchProducts(products, '', { activeColours: new Set(['Camel']) });
  assert.deepEqual(ids(r), ['tote']);
});

test('searchProducts: no match returns empty', () => {
  assert.deepEqual(searchProducts(products, 'zzzqqq'), []);
});

test('searchProducts: popular sort orders by click count when query is empty', () => {
  const r = searchProducts(products, '', { sortBy: 'popular', clickCounts: { charm: 9, tote: 3 } });
  assert.deepEqual(ids(r), ['charm', 'tote', 'carrot']);
});
