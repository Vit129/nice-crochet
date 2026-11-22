# Architecture

Nice Crochet is a client-rendered Next.js site exported as static files. The App Router entry points are `src/app/layout.tsx` and `src/app/page.tsx`. Product catalog data is read from the root `products.json`; image and catalog scripts live under `scripts/`.

## Layers and dependencies

| Layer | Folder / files | May import | Responsibility and boundary |
|---|---|---|---|
| App | `src/app/` | components, `src/lib/`, `src/types/`, `src/strings/`, `src/config/`, root `products.json` | Page composition, site metadata, global stylesheet import, and app state. UI does no I/O directly; external requests go through `src/lib/clickTracking.ts`. |
| UI | `src/components/` | `src/lib/`, `src/types/`, `src/strings/`, `src/config/`, other components | Render UI, handle events, and call pure helpers or the click-tracking integration. Components do no I/O themselves. |
| Pure logic | `src/lib/search.ts` | `src/types/`, `src/strings/searchKeywords.ts` | Search tokenization, synonym expansion, filtering, scoring, and sorting. It is pure and performs no I/O. |
| Integration / utility | `src/lib/` | `src/config/` as needed | `clickTracking.ts` is the only I/O module in `src/lib/`; it owns requests for counts and product-flag overrides. `basePath.ts` only joins the configured path prefix to asset paths. |
| Domain types | `src/types/` | `src/config/colors.ts` | Product and category types, labels, and colour-swatch lookup. |
| Copy and search vocabulary | `src/strings/` | none | Thai UI copy and Thai/English search terms. Keep Thai text only here. |
| Design tokens | `src/config/colors.ts`, `src/config/colors.css` | none | Product colour swatches and CSS colour tokens. Keep colour values only in these token files. `src/app/globals.css` imports `colors.css`. |
| Tests | `tests/` | app logic and fixtures | Node test files use the built-in test runner through `npm test`. |

### Single homes for literals

- **Thai text:** `src/strings/` only. `th.ts` holds UI copy; `searchKeywords.ts` holds search terms and prefixes. Components and logic import these values.
- **Colour values:** `src/config/colors.ts` and `src/config/colors.css` only. CSS should use the CSS variables from `colors.css`; TypeScript should use the exported tokens.
- **Font sizes:** `src/app/globals.css` only. Components should use CSS classes rather than inline font-size values.

Review changes against the layer table. To locate Thai text, colour literals, font-size declarations, and I/O, run:

```sh
rg -n '[ก-๙]' src --glob '*.{ts,tsx,css}'
rg -n '#[0-9a-fA-F]{3,8}|\b(?:rgb|hsl|oklab)\(' src --glob '*.{ts,tsx,css}'
rg -n 'fontSize:|font-size:' src --glob '*.{ts,tsx,css}'
rg -n '\bfetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|document\.cookie|readFile|writeFile' src
```

These are review commands, not automated gates. In the current source, `src/types/product.ts` computes an HSL fallback for unmapped product colours, `src/components/ProductLightbox.tsx` has one inline font size, and `src/app/globals.css` uses named `white`/`black` in `color-mix()`. Those are exceptions to the single-home conventions above and should be resolved when touching those areas. The only `fetch()` calls in `src/` are in `src/lib/clickTracking.ts`.

## Runtime data and I/O

- `src/app/page.tsx` imports `products.json`, applies optional live product-flag overrides from `fetchProductFlags()`, and passes the resulting products to the page components.
- `src/lib/search.ts` receives products and filter/sort options and returns matching products without network, filesystem, browser storage, or UI dependencies.
- `src/lib/clickTracking.ts` is optional integration I/O. It requests click counts and product flags and records product clicks through the configured Apps Script endpoint. Failed reads return empty objects; tracking is disabled when the endpoint is unset.
- `src/lib/basePath.ts` provides the configured static-site prefix for asset URLs; it does not perform I/O.

## Useful commands

| Task | Command |
|---|---|
| Run locally | `npm run dev` |
| Run tests | `npm test` |
| Validate catalog | `npm run validate` |
| Build static export | `npm run build` |
| Build image variants | `npm run build:images` |

`npm run build` validates `products.json` and its image references before running `next build`.
