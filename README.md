# Nice Crochet

Portfolio/showcase site for the handmade crochet brand [@yukiandnice](https://www.tiktok.com/@yukiandnice) on TikTok — browse the catalog by category and colour, no cart or checkout. Anyone who wants a piece still reaches out over TikTok DM.

**Live: https://vit129.github.io/nice-crochet/** — every push to `main` redeploys automatically via GitHub Actions.

## Pages

- **Home** — hero carousel featuring hand-picked pieces per category
- **Shelf** — full catalog: search, filter by category/colour, sort by newest or most-viewed
- **About me** — the maker's story and a TikTok contact link

Clicking any piece opens a lightbox with all of its photos.

## Stack

Static export (Next.js, `output: 'export'`) — no server, no database. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full reasoning (why static over a framework-hosted app, the image pipeline, the click-tracking backend) and [`DESIGN.md`](./DESIGN.md) for the visual design system and its decision history.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build` runs catalog validation (`products.json` against `public/images/`) before the static export — a broken catalog reference fails the build instead of shipping silently.

## Adding new photos

Raw source photos live in `PRODUCTS/` (gitignored, never committed — real source material, not derived output). To add new pieces to the site:

```bash
bash scripts/build-images.sh   # HEIC → 3 WebP sizes into public/images/
```

Then add the corresponding entry to `products.json` (the single source of truth for the catalog — see `ARCHITECTURE.md`'s data model section for the schema and the `showOnShelf`/`showOnHome` flags).
