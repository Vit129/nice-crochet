export type ProductCategory =
  | 'Market totes & bags'
  | 'Pouches & purses'
  | 'Card holders'
  | 'Flower charms';

// Not a closed union — a product's colours are free-text (see Product.colours
// below), because the real catalog already outgrows any fixed list faster
// than code gets updated. Known names get an exact hex via COLOUR_SWATCHES;
// getColourHex() below covers anything that isn't in that map yet.
export type ProductColour = string;

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  colours: string[];
  photos: string[];
  alt: string;
  description?: string;
  /** Whether this piece appears in the Shop/Shelf catalog at all. */
  showOnShelf: boolean;
  /** Whether this piece is eligible to appear in the Home carousel — requires showOnShelf: true. */
  showOnHome: boolean;
}

export const CATEGORY_NAMES: { id: ProductCategory; label: string }[] = [
  { id: 'Market totes & bags', label: 'Totes & bags' },
  { id: 'Pouches & purses', label: 'Pouches & purses' },
  { id: 'Card holders', label: 'Card holders' },
  { id: 'Flower charms', label: 'Flower charms' },
];

// Curated hex per known colour name — add an entry here for the accurate
// swatch whenever a new colourway is introduced. Anything not listed still
// works everywhere (filters, dots, badges) via getColourHex()'s fallback,
// just without a hand-picked hex until someone adds one.
export const COLOUR_SWATCHES: Record<string, string> = {
  Cherry: '#B9312F',
  Mustard: '#DFA23A',
  Camel: '#8C6A3A',
  Tan: '#C7AD82',
  Charcoal: '#5B5B54',
};

/**
 * Hex for a colour dot/swatch. Known names get their curated hex; an
 * unmapped name gets a deterministic HSL hue derived from the name itself,
 * so two different new colours still read as visually distinct instead of
 * both collapsing into one generic default color.
 */
export function getColourHex(name: string): string {
  if (COLOUR_SWATCHES[name]) return COLOUR_SWATCHES[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 42%)`;
}
