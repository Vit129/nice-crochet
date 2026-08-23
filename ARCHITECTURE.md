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
