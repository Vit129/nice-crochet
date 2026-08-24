export type ProductCategory =
  | 'Market totes & bags'
  | 'Pouches & purses'
  | 'Card holders'
  | 'Flower charms';

export type ProductColour =
  | 'Cherry'
  | 'Mustard'
  | 'Camel'
  | 'Tan'
  | 'Charcoal';

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

export const COLOUR_SWATCHES: Record<string, string> = {
  Cherry: '#B9312F',
  Mustard: '#DFA23A',
  Camel: '#8C6A3A',
  Tan: '#C7AD82',
  Charcoal: '#5B5B54',
};

export const COLOURS: ProductColour[] = [
  'Cherry',
  'Mustard',
  'Camel',
  'Tan',
  'Charcoal',
];
