# Nice Crochet

A static Next.js showcase for browsing crochet products. It has Home, Shelf, and About views; there is no cart or checkout.

## Run

```sh
npm install
npm run dev
```

Open <http://localhost:3000>.

## Test and build

```sh
npm test
npm run build
```

The build validates `products.json` and referenced images before creating the static export in `out/`.

## Folder map

- `src/app/` — Next.js entry points and global CSS
- `src/components/` — page and UI components
- `src/config/` — colour token files
- `src/lib/` — search, asset paths, and click-tracking integration
- `src/strings/` — Thai UI copy and search terms
- `src/types/` — product and category types
- `tests/` — Node tests
- `scripts/` — catalog validation, image build, and local server scripts
- `products.json` — product catalog
- `public/` — static images and other assets

See [ARCHITECTURE.md](./ARCHITECTURE.md) for layer boundaries and the literal placement rules.
