# Nice Crochet — Domain Language

Handmade crochet showcase and portfolio catalog for @yukiandnice.

## Language

**Piece**:
A distinct handmade crochet creation displayed in the showcase catalog, with multiple photos and specific colourway details.
_Avoid_: SKU, Item-for-sale, Merchandise, Inventory

**Family**:
One of the four confirmed product categories: Market Tote, Pouch, Card Holder, or Flower Charm.
_Avoid_: Department, Collection, Product Line

**Colourway**:
The yarn color combination of a finished piece (e.g., cherry red, mustard, camel, charcoal, sage green).
_Avoid_: Variant, Color code, Hex spec

**Shelf**:
The filterable, browsable catalog grid where visitors explore all pieces by category and colour.
_Avoid_: Storefront, Product listing page, Warehouse

**Showcase**:
The portfolio website focused purely on browsing and discovery, deliberately excluding cart, checkout, and pricing.
_Avoid_: E-commerce site, Web shop, Marketplace

**Derived Asset**:
A pre-sized, orientation-corrected WebP image generated at build time from original HEIC camera files.
_Avoid_: Upload, User asset, Raw photo

**Catalog Validator**:
Build-time script enforcing schema integrity and asset existence for `products.json`.
_Avoid_: Backend validator, Database check
