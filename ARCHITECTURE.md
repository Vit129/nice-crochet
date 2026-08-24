# Nice Crochet — System Architecture

> Status: **decided**, pre-build. Reviewed by `advisor` and `/agy` — both converge on the same stack, no disagreement. Companion to `PRODUCT.md` (what/why) and `DESIGN.md` (how it looks) — this doc is how it's built.

## Constraints (from the owner)

- No server. No database. Not even "later" — design for a pure static deploy.
- Client-side search + filter only (already prototyped in the mockup's vanilla JS).
- ~190 real source photos in `PRODUCTS/*.HEIC`, ~538MB total.
- 3 pages: Home, Shop, About.

## Stack decision: Next.js (`output: 'export'`), not Flutter

The deciding question isn't "which framework is better" — it's whether this site needs app-like local state or native builds. It doesn't: it's photos, links, and client-side filtering, i.e. a content site, not an app.

- **Flutter Web** renders to canvas/DOM in a way that's worse for SEO, worse for `<img>`-level lazy loading/responsive images, and pays a real runtime-weight cost for capabilities (native builds, complex app state) this project never uses. Wrong tool for a public content site.
- **Next.js with `output: 'export'`** compiles to plain static HTML/CSS/JS — deployable to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages), genuinely zero server at runtime, satisfies the "no server" constraint for real, not just "for now." File-based routing gives clean `/`, `/shop`, `/about` URLs for free.
- A lighter alternative (Vite+React, or Astro) was considered — Next.js still wins here mainly for ecosystem familiarity and because static export removes its usual server-dependency downsides. Not a close call either way; not worth spending more review time on.

**Known gotcha, must verify before scaffolding:** `next/image`'s built-in optimizer expects a Node server or Vercel's image infrastructure — it does **not** work under `output: 'export'` without either `images.unoptimized: true` or a custom loader. Since this project pre-generates fixed sizes at build time anyway (next section), the plan is to **skip `next/image` entirely** and use plain `<img loading="lazy" width height>` pointing at pre-sized static files. Fewer moving parts, no framework-specific trap to explain later.

## Image pipeline (the actual hard part)

HEIC is not web-deliverable — Chrome/Firefox won't render it in `<img>`. Conversion is mandatory, not optional.

1. **Committed conversion script** (`scripts/build-images.sh`), not ad hoc terminal commands — same "write via canonical script, never manual-edit generated files" convention already used elsewhere. Wraps `sips` (already proven working on this machine during mockup asset prep) or `magick`/`cwebp`.
2. **Pre-generate fixed derived sizes** at build time, WebP:
   - thumbnail (~72px) — search-suggestion dropdown
   - card (~600px) — shop grid
   - hero (~1600px) — carousel
3. **Deterministic naming** (agy) — the script must sanitize source filenames (lowercase, kebab-case, strip spaces/special chars) so product IDs and `products.json` photo references stay clean and predictable, not derived from whatever the camera/HEIC export named the file.
4. **EXIF orientation must be baked in before resizing** (found 2026-08-23, see DESIGN.md) — neither `sips -s format jpeg` nor `cwebp` applies a photo's EXIF orientation flag on its own, so portrait phone photos (stored as landscape pixels + an orientation tag) ship sideways/tilted unless corrected first. The script runs every image through `PIL.ImageOps.exif_transpose()` before it ever reaches `cwebp`.
5. **Do not commit the HEIC originals.** ~538MB of never-diffing binaries. Derived WebP output is ~20–40MB total. Originals stay local-only (gitignored), derived assets are what ships in `public/images/`.
6. Re-run `build-images.sh` whenever new source photos are added — it's the only path from `PRODUCTS/*.HEIC` to shippable assets, never hand-export individual files.

## Data model: catalog, not file list

190 photos ≠ 190 products. Sampling shows repeats (same tote, multiple angles), lineup shots, and WIP-on-the-hook shots. Real shape is closer to **~40–60 distinct pieces × 2–5 photos each**, plus a few non-product images (yarn stash, process shots) reserved for Home/About.

- Model: `product → photos[]`, not one row per file.
- Format: **a single `products.json`** — agy: a folder-per-piece (50 folders × 50 JSON files) is more tedious to navigate in Finder/VS Code for a non-technical owner than one file. Single file wins.
- Fields per product: id, name, category (from `PRODUCT.md`'s 4 confirmed families), colour(s), photo filenames, alt text.
- **Build-time validation is required, not optional** (agy) — a non-technical owner will eventually break JSON syntax (trailing comma, unescaped quote) or reference a photo that doesn't exist. `scripts/validate-catalog.ts` runs a Zod schema against `products.json` at build time and confirms every referenced photo file actually exists in `public/images/`, failing with a specific, friendly error (`❌ Error in product "ocean-tote": photo "ocean-03.webp" not found`) rather than a silent bad build.
- **This is the actual project bottleneck**, not the framework: grouping 190 raw photos into real distinct pieces needs the owner's judgment (same tote in a different colour vs. same piece from a different angle isn't reliably automatable) — flagged as content work in `PRODUCT.md` already.

## Real bug found: products.json was actually duplicated (2026-08-24)

The scaffold created `src/data/products.json` as a copy, and the app imported *that* copy — while `scripts/validate-catalog.ts` validated the root `products.json`. Two files that could silently drift apart, directly contradicting the single-hand-editable-file decision above. Fixed: `src/app/page.tsx` now imports `../../products.json` (the root file) directly; the stale `src/data/` copy is deleted. There is exactly one `products.json` now, and the validator's checks are the same file the app actually ships.

## Per-product visibility flags — showOnShelf / showOnHome (2026-08-24)

Two booleans on each product, enforced by `validate-catalog.ts`: `showOnHome` can only be `true` if `showOnShelf` is also `true` — a piece can't be featured on Home without being browsable on the Shelf. `showOnShelf: false` removes a product from the Shop grid/search entirely (e.g. for a discontinued or not-yet-ready piece); `page.tsx` filters the full catalog down to `shelfProducts` once, at the top, before handing it to `ShopGrid`.

**Home carousel is now product-driven for its background image**, while keeping its 4 hand-written category slides (copy stays curated, not auto-generated — decided explicitly over regenerating marketing copy per product). Each slide's background is drawn from whichever products in that category have `showOnHome: true`; if a category has more than one flagged product, `HeroCarousel` quietly cycles the background through that pool every ~3.5s while the slide is active (resets to the pool's first photo whenever you navigate to a different slide) — a second, competing carousel UI was deliberately avoided in favor of this one subtle rotation. A category with zero flagged products falls back to the original hardcoded image, so the site never shows a blank slide while the owner is still deciding what to feature.

## Click tracking + sort-by-popularity — Google Apps Script, not SQLite (2026-08-24)

Requested: track how many times each product card is opened, and let visitors sort the Shop grid by popularity. This needs a place to persist counts *across all visitors*, which conflicts with the "no server" constraint above unless the persistence layer is itself serverless.

- **SQLite was ruled out**: it's a file-based DB that needs a server process to accept writes — this site has zero compute (GitHub Pages). Not viable without contradicting the whole static-hosting decision.
- **Google Apps Script Web App + Sheets was chosen** — matches the exact pattern already proven in `My-Investment-Port/syncLocalStorageToGoogleSheets.gs` and `Fitness-Tracker/fitness-backend.gs` (see `~/.claude/rules/routing.md`'s own note on this recurring cross-project pattern, watch-listed at 2/3 before this — now a 3rd real instance). `scripts/apps-script/click-tracking.gs` is a `doGet`-only backend (both read `?action=counts` and write `?action=click&productId=…&token=…` go through GET, avoiding CORS preflight from a static origin — same workaround the investment-port script documents). Deploy steps are in the script's own header comment.
- `src/lib/clickTracking.ts` is the client side: `recordClick()` fires a no-cors, fire-and-forget GET (never blocks the UI, never throws); `fetchClickCounts()` returns `{}` on any failure. Both read `NEXT_PUBLIC_CLICK_TRACKING_URL`/`_TOKEN` — **unset by default**, so the site works fully with tracking silently disabled until the owner deploys the script and sets the two GitHub Actions repo secrets (`CLICK_TRACKING_URL`, `CLICK_TRACKING_TOKEN`) referenced in `pages.yml`.
- The Shop page's new "Sort" control (next to search) offers "Newest first" (catalog order, the default) and "Most viewed" (sorts by fetched counts, missing entries treated as 0).

## Product visibility flags go live via the same Sheet — but not the whole catalog (2026-08-24)

Requested: let the owner delete/hide a product or change what's featured on Home without touching code. Considered moving the *entire* catalog (name, category, photos, description — not just visibility) into the Sheet, decided against it:

- **Photos always need the code pipeline regardless of where metadata lives** — every new product's images still have to go through `scripts/build-images.sh` (HEIC → 3 WebP sizes) and ship via a code push. So "manage the whole catalog from a spreadsheet, no code needed" was never fully achievable — only the metadata could move, not the actual asset pipeline that gates it.
- **`validate-catalog.ts`'s build-time checks (Zod schema + "does this photo file actually exist") only work on `products.json`.** A Sheet has no equivalent gate — a typo'd photo filename in a spreadsheet cell would ship a broken image with zero warning, instead of failing the build with a specific error like it does today.
- **A live catalog fetch would make the whole Shop page depend on the Sheet responding** to render at all — a much bigger blast radius than click tracking (which degrades gracefully to "can't sort by popularity" if the Sheet is unreachable) or this narrower flags feature (which degrades to "shows the `products.json` defaults" — never a blank page).

**What actually shipped**: only `showOnShelf` and `showOnHome` — the two booleans already on `Product` — are Sheet-overridable, via a new `ProductFlags` tab in the same spreadsheet used for click tracking (one Apps Script deployment, `?action=flags` alongside the existing `?action=counts`/`?action=click`). `products.json` keeps every other field, and keeps these two flags too — as the fallback used when the Sheet fetch fails or hasn't been configured yet. `src/app/page.tsx` fetches flags once on mount (`fetchProductFlags()` in `src/lib/clickTracking.ts`, same no-throw/empty-object-on-failure pattern as click counts) and merges them over `products.json`'s baked-in values — Sheet wins per-product when present, otherwise the JSON default holds. This merged list is what both `ShopGrid` (filtered to `showOnShelf`) and `HeroCarousel` (filtered to `showOnHome` per category) actually render, so a flag flip in the Sheet reaches the live site on next page load — no rebuild, no PR — while adding a genuinely new product still goes through the validated `products.json` + photo-pipeline path as before.

Run `seedProductFlags()` once from the Apps Script editor (see the script's header comment) to populate `ProductFlags` with the current 13 products' flag values as a starting point — it's a one-time seed, not a live sync back to `products.json`.

## Photo intake workflow (catalog grows over time)

The data model already handles "1 product, many angles" via `photos[]` — the open problem is process, not schema: today's ~190 photos are already multi-angle-per-piece, and the owner will keep adding shoots indefinitely. Grouping "same piece, different angle" vs. "different piece, same colour" needs a human eye and can't be fully automated — but the busywork around that decision can be minimized into a repeatable loop instead of one-off manual edits:

1. Owner drops new HEIC files into a staging folder, `PRODUCTS/inbox/` (kept separate from already-processed originals).
2. `scripts/intake-photos.sh` converts everything in `inbox/` to derived WebP sizes (reuses `build-images.sh`'s logic), then clusters files by EXIF capture-timestamp proximity (e.g. shots within ~3 minutes of each other) as a **suggested** same-product group — printed as a numbered list, never auto-committed to `products.json`.
3. A human confirms/edits each suggested cluster: assign id/name/category/colour for a new product, or merge into an **existing** product's `photos[]` if it's more angles of something already catalogued.
4. `validate-catalog.ts` (already planned above) runs before anything ships, catching bad refs or malformed entries.
5. Processed HEIC moves out of `inbox/` into a local-only archive (or gets deleted — the WebP derivatives are the source of truth once generated) so re-running the script never reprocesses the same files twice.

This keeps catalog growth bounded-effort regardless of volume: drop photos → run script → confirm a handful of groupings → done, rather than re-deriving the whole intake process by hand each time the catalog grows.

## Hosting

**Deployed: GitHub Pages**, `https://vit129.github.io/nice-crochet/`, via `.github/workflows/pages.yml` (build on push to `main` + manual dispatch).

Real constraint hit during setup: GitHub Pages on a **private** repo requires a paid plan (GitHub Pro+) — Free-tier personal accounts can only serve Pages from a **public** repo. The user chose to make the repo public over paying for Pro (2026-08-23), matching the same pattern already used by `QA-Automation-Coding-Course` (also public, despite its casual "private repo" framing in conversation — worth double-checking, not assuming, next time this comes up on a different project).

**GitHub Pages project-site subpath requires `basePath`.** A project site is served at `/nice-crochet/`, not `/` — Next.js's own `_next/*` asset loading respects `basePath`/`assetPrefix` automatically, but hand-written `<img src="/images/...">` and CSS `background-image: url(...)` do not. Fixed via `src/lib/basePath.ts` (`assetPath()` helper, reads `NEXT_PUBLIC_BASE_PATH` at build time) applied everywhere an image path is constructed (`ResponsiveImage`, `HeroCarousel`, `Topbar`, `layout.tsx` favicon). The env var is only set in the Pages workflow — local dev and any other static host (Vercel/Netlify/Cloudflare Pages, still viable per the original hosting-agnostic decision above) build with no base path, unaffected.

## Porting the mockup (not rebuilding)

`DESIGN.md` already encodes hard-won, specific decisions — these move over verbatim, not re-derived:
- `--teal-deep` for filled buttons/pressed chips (the WCAG AA contrast fix)
- Two-layer carousel-slide gradient (text legibility + bottom vignette for the controls pill)
- Glass topbar tint (`color-mix(in oklab, var(--teal) 7%, var(--bg))` at 72%/88%, `blur(26px) saturate(120%)`)
- Grouped bottom-center `.carousel-controls` pill (fixes the arrow-over-text overlap)
- Focus-visible outline on `.search-field:focus-within`

Per `rules/coding.md` §6, the mockup HTML (`nice-crochet-mockup-v2.html`) is throwaway scratch — the agreed UI gets ported into real Next.js components, the demo file itself is not shipped.

## Before the first commit

- `git init` + `.gitignore` (`PRODUCTS/*.HEIC` or the whole raw-originals dir, `node_modules/`, `.next/`, `.claude/worktrees/`, `agent-memory/`) — **must** exist before `git add`, or the first commit bakes in ~538MB permanently.
- No scaffolding this session — this doc is for review first, not a build-now signal.

## Review outcome (advisor + `/agy`, converged)

1. **Framework — Next.js static export confirmed**, no disagreement between reviewers. Vite+React SPA loses pre-rendered HTML per page (hurts LCP + crawlers) — actively worse than Next.js export, not just unnecessary. Astro would ship less JS but the gap is negligible against image payload size for a 3-page, ~40–60 item catalog; not worth the framework-switch overhead.
2. **`next/image` — skip it entirely, confirmed.** `unoptimized: true` still drags in Next's wrapper/loader machinery for zero benefit once images are pre-sized at build time. Use a small `<ResponsiveImage>` component wrapping a plain `<img>` with `srcSet`/`loading="lazy"`/`decoding="async"`.
3. **Data model — single `products.json`, not folder-per-piece** (agy's correction to the original draft) — one file is easier for a non-technical owner to navigate than 50 folders. Requires build-time Zod validation (`scripts/validate-catalog.ts`) to catch broken JSON / missing photo references before they silently break the build.
