# Nice Crochet — Design Language

> Canonical per `rules/product-design.md` — grounded in the **real** brand logo (`DESIGN/Blue Yellow Cute Crochet Knitting Handmade Business Logo.PNG`) and real product photography (`PRODUCTS/`, ~190 photos). Superseded the first draft, which was invented before these assets were shared. Update this file if the mockup direction changes after further owner feedback.

## Design direction

Build the site's UI chrome around the real logo — a teal cat-shaped ball of yarn, mustard-yellow knitting needles, on an icy pale-blue ground, tagline "Handmade with love." That's a clean two-accent brand system (teal + mustard), not the invented multi-hue "yarn shelf" palette from draft 1.

The actual *product* range (from real photos) is a warm, earthy palette — cherry red, mustard, camel, tan, charcoal, sage, plum — but that lives in the photography itself, not the site chrome. Category ≠ colour here (a "tote" comes in 7+ colours), so colour became its own filter dimension instead of a category identity.

## Colors

Extracted from the logo PNG (`python3 -c "PIL...".getcolors()`), not guessed:

| Token | Hex (light) | Hex ("dark") | Source / use |
|---|---|---|---|
| `--bg` | `#F2FDFF` | `#F7FBFB` | exact logo background — page canvas |
| `--surface` | `#FFFFFF` | `#FFFFFF` | cards, inputs |
| `--surface-2` | `#E4F4F7` | `#EAF3F4` | nav pill, tonal fills |
| `--ink` | `#16282D` | `#16282D` | primary text — deep teal-charcoal (not pure black) |
| `--ink-soft` | `#4C6469` | `#4C6469` | secondary text |
| `--line` | `#D6ECEF` | `#DCEAEC` | borders/dividers |
| `--teal` | `#3B8FA1` | `#2E7A8C` | brand teal — exact logo sample (`#4093A4`), 3:1 UI-component contrast only, **not** for fills under white text (fails 4.5:1, see Avoid) |
| `--teal-deep` | `#256575` | `#1D5666` | filled buttons/pressed chips (white text) — 6.5:1+, and hover/emphasis text |
| `--mustard` | `#FFCF6C` | `#E8A93A` | exact logo mustard (sampled `#FFCF6C`) — secondary accent |
| `--mustard-deep` | `#A66E15` | `#8C5A10` | readable accent text on mustard fills |
| `--cream` | `#F7EAC2` | `#F7EAC2` | logo's soft cream, used sparingly as warm neutral |

**"Dark" is intentionally soft, not deep.** The user explicitly asked (2026-08-23) for the system-dark/explicit-dark palette to read as white/near-white rather than the deep-navy-teal it shipped with initially — "ขอสีขาว หรือไม่ไม่งั้นทั้งสีพื้นหลังทำเป็น teal อ่อนลงอีก มองให้สบายตา." So both the `@media (prefers-color-scheme: dark)` block and `[data-theme="dark"]` now resolve to this same soft palette, not a true dark theme. Keep this table and the shipped CSS in sync — the previous draft of this file listed old deep-navy dark values that no longer matched the template (caught by a `ui-designer` `/audit` pass, 2026-08-23).

Product colourway swatches (computed per-photo average, used as filter chips + product tags, not UI chrome): Cherry `#B9312F`, Mustard `#DFA23A`, Camel `#8C6A3A`, Tan `#C7AD82`, Charcoal `#5B5B54`.

## Typography

- **Display** — [Baloo 2](https://fonts.google.com/specimen/Baloo+2) (500–800). Chosen *because* it's the closest Google Fonts match to the real logo's rounded, bubbly hand-lettered wordmark ("NICE" / "CROCHET") — not picked independently.
- **Body** — [Karla](https://fonts.google.com/specimen/Karla) (400–700). Warm humanist sans for readable copy.
- **Utility/mono** — [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (400–500). Kicker/eyebrow labels. (No longer carries prices — see "Portfolio, not a shop" below.)

Import: `https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Karla:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap`

## Real brand assets in use

- `DESIGN/Blue Yellow Cute Crochet Knitting Handmade Business Logo.PNG` (2026-08-23, superseded the earlier avatar-crop approach) — the source PNG has **no real alpha**, its icy background is baked in as flat pixels (`getcolors()` confirmed, alpha extrema were `(255,255)`), so it was re-processed with a PIL colour-key (distance from the sampled `#F2FDFF` background → alpha) to produce a genuinely transparent version, then cropped to `logo-topbar.png` (cat + "NICE"/"CROCHET" wordmark only, tagline+needles excluded — those rows sit at y:1185+ in the source, cut off) for direct use in the topbar at `height:38px`, `width:auto`. This one image now carries both the icon *and* the wordmark — replaced the old "circular avatar + typed brand-name text" combo entirely (see Layout).
- `PRODUCTS/*.HEIC` — ~190 real product photos. 26+ sampled to identify the real catalog; 17 selected, converted to JPEG (`sips`, max 900px, q68) and embedded as base64 in the mockup artifact (12 shop products + 4 carousel/hero + 3 texture-detail spotlight + 1 About-page yarn shot, some reused across sections).

## Portfolio, not a shop (2026-08-23)

The user clarified this is a **showcase/portfolio site, not a transactional store** — "อันนี้เป็นแค่ระบบแสดงผลงานเท่านั้น เหมือน web โชว์ผลงานอ่ะ." Removed accordingly:
- Cart icon + "add to cart" button (was on every product card)
- Topbar search-icon shortcut (the dedicated Shop-page search bar stays — that's the explicitly-requested "search + filter" feature, a browsing tool, not a transactional one)
- All ฿ prices and the price-range filter/sort-by-price options (was placeholder-invented data anyway, flagged in PRODUCT.md; removing it removes that flag too)

Product cards now show only: real photo, colourway tag, name, category + colour-dot meta. No price, no buy affordance anywhere on the site.

## Layout

- Mobile-first, single-scroll pages behind a sticky pill-nav (Home / Shop / About) — client-side page switching. No cart/search icons in the topbar (see Portfolio, not a shop above).
- **Home is now just the carousel + the stats row, full stop** (2026-08-23). Sequence: category grid (draft) → user flagged it as redundant with the carousel → replaced with a "Fresh off the hook" texture/detail spotlight (agy's suggestion, added something the carousel didn't) → user reviewed screenshots of that spotlight *and* the "How a piece gets made" process section below it and said cut both, no replacement. Don't re-add a middle section on Home on the assumption it "fills space" — the owner explicitly wants Home short. `.cat-grid`/`.cat-card`/`.spotlight-card` CSS and the `.categories`/`.process` wrapper classes were removed as dead code along with the markup (the `.process-list`/`.process-item`/`.process-num` classes stayed — About's "A few honest notes" section still uses them).
- **Shop**: left filter rail — Category (4), **Colour** (5 swatch-dot chips, computed from real photos — this is the "search + filter" the owner asked for, grounded in how the real inventory actually varies) — + right product grid using real photos. No price filter/sort (see Portfolio, not a shop).
- **About**: asymmetric two-column; the "hoop" portrait frame holds a real yarn-stash photo (materials, not an invented illustration) since no real portrait was supplied.
- **Hero: full-bleed carousel** (2026-08-23, user request — looked at watch/e-commerce hero-slider patterns and asked for that treatment on Home). 4 slides, each a real product photo with its own eyebrow/heading/CTA that deep-links straight into that category on Shop (Totes → Pouches → Card holders → Flower charms). Autoplay (5s), pauses on hover/focus, swipeable, `tabindex` toggled per-slide so inactive CTAs aren't keyboard-reachable, autoplay itself skipped under `prefers-reduced-motion`. Replaced the earlier tilted 3-photo-stack hero from the previous iteration — that idea is superseded, not additive.
  - **CTA copy is "Browse totes" / "Browse pouches" / etc., not "Shop totes."** Fixed 2026-08-23 alongside the portfolio-not-a-shop change — "Shop X" implies a transaction this site doesn't do.
  - **Prev/next arrows + dots are one grouped bottom-center glass pill (`.carousel-controls`), not edge-floating arrows.** Fixed 2026-08-23 — edge-positioned arrows vertically centered on the whole slide (`top:50%`) sat directly on top of the copy column and covered slide text whenever a slide's paragraph ran long enough to reach that height. Grouping prev+dots+next together at the bottom removes the overlap by construction — there's no longer any control positioned inside the vertical text zone. Don't reintroduce edge-centered arrows without solving that overlap differently.

## Components

- **Category card** (`.cat-card`) — real photo background + gradient overlay + name/description, not a flat colour tile (colour no longer maps 1:1 to category — see Design direction above). Reused (as `.spotlight-card`, `cursor:default`, non-link) for the Home "Fresh off the hook" texture-detail section — see Layout.
- **Filter chip** — pill toggle; colour chips carry a swatch dot in the real computed hex; pressed state fills solid teal.
- **Product card** — real photo, colourway tag pill, name, category + colour-dot meta. No price, no add-to-cart (see Portfolio, not a shop).
- **Nav pill** — segmented control. Brand mark is the real logo (transparency-processed `logo-topbar.png`, icon+wordmark in one image) at `height:38px`, not a hand-drawn SVG, not a separate icon+typed-text combo, and not an uncropped rectangle with a visible background seam.
- **Topbar** — Apple-style frosted glass (explicit user request, 2026-08-23): no border while at the top of the page, a hairline border + soft shadow fade in via a `.is-scrolled` class once `scrollY > 8` (JS `scroll` listener). See Avoid below for why this doesn't contradict the general no-glassmorphism rule.
  - **Glass tint is deliberate, not raw blur-passthrough** (fixed 2026-08-23, recommendation from `/agy`). The original `color-mix(in oklab, var(--surface) 46%, transparent)` + `blur(22px) saturate(180%)` let whatever photo sat behind the topbar bleed through almost unfiltered — over some carousel slides this read as an ugly, uncontrolled gray-to-pink smear instead of an intentional brand colour. Now: `background: color-mix(in oklab, color-mix(in oklab, var(--teal) 7%, var(--bg)) 72%, transparent)` (88% when `.is-scrolled`) with `backdrop-filter: blur(26px) saturate(120%)` — a soft teal-tinted milky glass that reads as *the brand's* glass regardless of what photo is behind it. Lowering `saturate` from 180%→120% was the specific fix for the dirty-color-smear symptom; don't push saturate back up without re-checking against a busy photo slide.

## Avoid

- Don't reintroduce the draft-1 multi-hue "category = colour" system — it doesn't match how the real catalog varies (one tote category spans 7+ colours).
- No emoji-as-icon (SVG only), no generic centered SaaS hero.
- **Glassmorphism is scoped, not banned outright.** Per user request (2026-08-23, "ทำคล้ายๆ ios 26,27 glass design"), it now covers the topbar, the carousel's prev/next arrows + dot-pager, Shop's unselected filter chips, and the About page's TikTok/Instagram link chips (`.social-chip`) — all floating/secondary controls, styled after Apple's Liquid Glass (translucent fill, `backdrop-filter: blur()+saturate()`, thin bright edge highlight via `inset box-shadow`, soft drop shadow, `scale()` press feedback). **Deliberately kept solid/opaque, not glass:** `.btn-primary` (the CTA buttons) and pressed/active filter chips — both carry white text that needs the 4.5:1 contrast fix from the `/audit` pass; a translucent fill over a photo of unpredictable luminance/hue would silently reopen that same WCAG failure. Any new glass surface must go through the same check before shipping.
- Don't put white/`--teal-ink` text on a `var(--teal)` fill — it measures 3.73:1, under WCAG AA's 4.5:1 for normal text (caught by `/audit`, 2026-08-23). Filled buttons and pressed chips use `var(--teal-deep)` (6.5:1+) instead; `--teal` itself is for borders, icons, large text, and other ≥3:1 non-text uses.
- Don't reintroduce prices, a cart, or a buy affordance — this is a portfolio/showcase site, not a store (see Portfolio, not a shop above).
- The About-page bio is still **not real data** — see PRODUCT.md's flagged list. Don't treat "Hi, I'm Yuki" as confirmed copy.

## Nav naming and Shop-page heading (2026-08-23)

- Nav pill label is **"Shelf," not "Shop"** — consistent with the "portfolio, not a shop" decision above and with the existing "The shelf"/"Browse the shelf" copy voice already used elsewhere. `data-nav="shop"` stayed as the internal JS routing id (not user-visible) — only the visible label changed, don't go rename the id and break the nav-click wiring.
- The Shop page's big visible heading ("Search & filter every piece.") was **removed outright**, not shortened — the owner flagged it directly. A `<h1 class="visually-hidden">` ("The shelf — search and filter every piece") replaced it for a11y/SEO structure only; nothing renders. Same pattern as Home's hidden h1. The old `.shop-head` wrapper div is now just a spacing container around the toolbar (search field) — reused for its padding, not dead-code-removed, since something still needed that top spacing.

## Carousel control visibility over light photos (2026-08-23)

Real bug, caught from screenshots: the bottom-center glass control pill (prev/dots/next) is white-tinted, and several carousel photos (e.g. the lattice-yellow-tote slide) have a light/cream background at the bottom — white-on-near-white made the pill nearly invisible. The original `.carousel-slide::after` only darkened a diagonal wedge on the left (for the text column); the bottom-center control zone had no guaranteed contrast base.

Fix: `.carousel-slide::after`'s `background` is now two stacked gradients — the existing left-to-right one for the text column, plus a second `linear-gradient(0deg, ...black 60%... 0%, transparent 26%)` that guarantees a dark wash across the bottom ~26% of every slide, regardless of what's in the photo there. The white glass pill sits well inside that zone (it's at `bottom:20px`, pill height ~50px, always < 26% of the carousel's height at any breakpoint). Don't remove this bottom gradient layer without re-verifying every slide's photo — the whole point is it doesn't depend on what's in the image.

## Product detail lightbox (added in the real Next.js build, 2026-08-23)

The static mockup era of this doc (see the search-suggestions note below) said "no per-product detail page exists on this portfolio site" — that's now superseded. Once the real site moved to `products.json`'s `product → photos[]` model, a `ProductLightbox` component was added: clicking a shop card opens a modal showing all of that product's photos, reusing the same prev/dots/next control pill pattern (`.carousel-arrow`/`.carousel-controls`) as the Home carousel, on purpose — one interaction pattern for "browse multiple photos," not two.

Two real bugs found from a screenshot after this shipped, both now fixed:

- **Same white-glass-pill-on-light-photo bug as the Home carousel (see above), but in a second place.** `.lightbox-media` (the image pane inside the lightbox) had no dark bottom-vignette gradient behind the controls — unlike `.carousel-slide::after`, which is what makes the *identical* control-pill markup look crisp on Home. Same code, worse contrast, because the surrounding treatment wasn't ported over. Fixed with a matching `.lightbox-media::after` (`z-index:1`, bottom-vignette gradient only — no diagonal text-legibility layer needed here since the lightbox has no text over the photo). Lesson: this control-pill pattern is **not self-contained** — every place it's reused needs its own guaranteed-dark backdrop, don't assume the pill alone is enough.
- **Close button overlapped the "N / M" photo counter.** `.lightbox-close` is `position:absolute; top:16px; right:16px` relative to the whole `.lightbox-dialog`, but `.lightbox-info`'s own padding (`clamp(24px,4vw,36px)`) wasn't wide enough to keep the right-aligned counter text clear of the button's footprint (38px wide + 16px offset). Fixed with `padding-right: 48px` on `.lightbox-category-row` specifically, not the whole info panel — only the row that shares vertical space with the close button needs the clearance.

## Shop page padding collapsed to zero on tablet/phone (2026-08-23)

Real bug, caught from screenshots at iPad Mini (768px), iPad Pro (1024px), and iPhone 15 Pro Max (430px): shop page content (search bar, filters, product grid) sat flush against the browser edge with no side padding, on every viewport tested — "ไม่ค่อยมีพื้นที่ขอบหายใจเลย".

Root cause: `.shop-head` and `.shop-layout` are both rendered as `className="wrap shop-head"` / `className="wrap shop-layout"` — same element, two classes. `.wrap` sets `padding: 0 clamp(20px, 4vw, 48px)`. But `.shop-head`/`.shop-layout` each also had a shorthand `padding: <val> 0 <val>` for their own vertical spacing — the 3-value shorthand sets ALL FOUR sides, so `0` for left/right silently clobbered `.wrap`'s horizontal padding (same class specificity, later source order wins). Confirmed via `getComputedStyle` before the fix: `paddingLeft`/`paddingRight` were literally `0px` at all three breakpoints.

Fix: switched both rules to explicit `padding-top`/`padding-bottom` only, leaving `.wrap`'s horizontal padding untouched. General lesson (already called out in the `ui-designer` skill's own Gotchas list, now with a real instance): never reach for shorthand `padding`/`margin` on an element that shares another class also setting spacing on the same box — it silently zeros whatever axis you don't mention.

## Product photos shipping sideways (EXIF orientation, 2026-08-23)

Real bug, screenshot-caught: the Cherry Bucket Tote card (and others) rendered visibly tilted/rotated, as if shot at a diagonal angle. It wasn't actually crooked photography — confirmed via `PIL.ImageOps.exif_transpose()` that the fix is a clean, complete correction, not a partial one. iPhone photos store portrait shots as landscape pixel data plus an EXIF orientation flag saying "rotate N° to display upright"; neither `sips -s format jpeg` (the HEIC→JPG step) nor `cwebp` (the resize step) applies that flag on its own, so the pipeline shipped the raw sideways pixels. Fixed in `scripts/build-images.sh`: every image now passes through a `PIL.ImageOps.exif_transpose()` step (baking the correct rotation into the pixels) before `cwebp` ever sees it. See `ARCHITECTURE.md`'s image pipeline section for the code path.

## Footer and search suggestions (2026-08-23)

- Footer no longer carries the "Design preview for @yukiandnice · pages: Home · Shop · About me · not yet built" caption — owner flagged it directly, removed outright. Footer is now just the "Nice Crochet" text mark, nothing else.
- **Shop search now shows live suggestions with thumbnails** as you type (owner request: "search อยากมี suggession + thumbnail เล็กๆ"). A `.search-suggestions` dropdown (`role="listbox"`, positioned under `.search-wrap`) lists up to 5 matches (same name/category/colour matching logic as the main grid), each row a 36px photo thumbnail + name + category/colour-dot meta. Clicking a suggestion fills the search box with that piece's name and re-runs the filter — no per-product detail page exists on this portfolio site, so "select a suggestion" resolves to "filter down to just that piece," not a navigation. Opens on focus (if the field already has text) and on input; closes on Escape, on an outside click, or when the field is cleared.

## About page: "Good to know" removed, Contact split out (2026-08-23)

Owner flagged the "Good to know before you order" 3-note block for removal and asked whether the nav label should become "Contact us" instead of "About me." **Kept "About me"** — the page is genuinely a bio/story, relabeling the whole page "Contact us" would misdescribe most of its content. Instead: pulled the TikTok link out of the bio copy flow into its own small `.about-contact` block at the bottom (kicker "Get in touch," a one-line heading, a short line covering what the removed notes used to say about custom orders, then the TikTok chip) — same effect the owner was after (a clearer, findable contact moment) without mislabeling the page. Don't re-add the 3-note "Colours vary / Made to order / DMs welcome" grid — the useful bit of it (custom orders are usually possible) is folded into the new contact paragraph instead.

## Instagram added alongside TikTok (2026-08-25)

Owner sent a screenshot of the shop's new Instagram profile (`@nic.ecrochet`) and asked for it added right after TikTok. The `.tiktok-chip` class (About page's `.about-contact` block) was renamed to `.social-chip`, wrapped in a new `.social-links` flex row so both platform chips sit side by side with the same glass styling — see Avoid above, updated to say "TikTok/Instagram link chips" rather than singular TikTok. The product lightbox's "Made to order, just for you" panel (`.lightbox-contact-hint`) got the same treatment: a second `.btn-primary` "Message @nic.ecrochet on Instagram" stacked under the existing TikTok CTA. Both spots now need updating together whenever a social handle changes or a new platform is added.

## Lightbox now shows the whole product; Home hero keeps its crop (2026-08-24)

Real bug, screenshot-caught: `.lightbox-image` used `object-fit: cover` inside a container with no fixed aspect ratio — its shape was whatever height `.lightbox-info`'s text happened to produce, so photos got cropped differently and unpredictably per product (the Lattice Two-Tone Tote's handle was cut clean off). Fixed: `.lightbox-media` now has a fixed `aspect-ratio: 4/5` default, and `.lightbox-image` switched to `object-fit: contain` — every product's full photo is always visible now, letterboxed against `var(--surface-2)` when its native ratio doesn't match. There's no real tradeoff here: this view exists specifically to look closely at one piece, so nothing should ever crop out of frame.

**Home hero was tried the same way and reverted.** `.carousel-slide` uses `background-size: cover` in a deliberately wide/short `aspect-ratio: 16/8` frame — atmosphere, not full-product display, same distinction `PRODUCT.md`'s Core Features section already draws between Home and Shelf. Tried `background-position: center top` (bias toward where handles usually sit) — made a *different* photo worse, because real candid outdoor shots don't share one consistent composition; the subject isn't always near the top. Reverted to `center`. **Decided (confirmed with the owner) to keep `cover` + crop here rather than switch to letterboxed `contain`** — a hero banner is expected to be a stylized crop, not a full-product view; full-product is what clicking through to Shelf/lightbox is for. Don't re-attempt a universal position-bias fix — it doesn't generalize across differently-composed photos. If a specific photo crops badly on Home, the fix is picking a better-composed photo for that category's `showOnHome` flag, not more CSS.

## Sort control added to Shop toolbar (2026-08-24)

New sort control sits next to `.search-field` in `.toolbar` — "Newest first" / "Most viewed".

**First pass was a native `<select>` — replaced with a custom listbox after the owner pointed at a native select's open-state screenshot (thick border, OS blue/gray highlight) versus a reference from `My-Investment-Port` showing a fully custom-styled dropdown panel.** A native select's closed box is stylable, but its *open option list* is rendered by the OS and cannot be restyled in any browser — no amount of CSS on the closed control fixes that, which is why the first attempt (rounded-rect shape, custom chevron, lighter `var(--teal)` focus ring — still worth keeping for other native form controls if any get added later) still didn't match. Replaced entirely with `SortDropdown.tsx`, a hand-built listbox (`role="listbox"`/`role="option"`, click-outside-to-close) — same interaction pattern already established by `SearchSuggestions.tsx` for the search field, not a new pattern. Selected option gets a small `var(--teal)` square dot instead of a checkmark; chevron rotates 180° when open; panel shares the trigger's `10px` radius and shadow style with `.search-suggestions`.

**`.search-field`'s shape also changed** from its original pill (`border-radius: 999px`) to the same `10px` rounded rect as the new dropdown trigger, per explicit request to keep the toolbar's two controls visually matched — don't reintroduce the pill shape there without re-checking this decision.

## Status

v2 mockup (built from real logo + real photos) published as a Claude Artifact for owner review, same URL as v1. Revisit this file after owner feedback rather than drifting from it silently.
