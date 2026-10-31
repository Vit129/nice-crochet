# Graph Report - delivery-workflow-completion  (2026-10-31)

## Corpus Check
- 46 files · ~1,422,595 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 493 nodes · 567 edges · 35 communities (27 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e9807b8c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## God Nodes (most connected - your core abstractions)
1. `Nice Crochet — Design Language` - 20 edges
2. `Product` - 17 edges
3. `compilerOptions` - 16 edges
4. `Nice Crochet — System Architecture` - 16 edges
5. `@media (max-width: 860px)` - 13 edges
6. `getColourHex()` - 9 edges
7. `assetPath()` - 8 edges
8. `Nice Crochet — Product Context` - 8 edges
9. `ProductCategory` - 7 edges
10. `Nice Crochet` - 6 edges

## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `Product` - bridges 1 areas (17 edges)
2. `@media (max-width: 860px)` - bridges 1 areas (13 edges)
3. `SLIDES` - bridges 1 areas (6 edges)
4. `searchProducts()` - bridges 1 areas (5 edges)
5. `fetchClickCounts()` - bridges 1 areas (4 edges)
6. `fetchProductFlags()` - bridges 1 areas (4 edges)
7. `scoreProduct()` - bridges 1 areas (4 edges)
8. `@media (max-width: 520px)` - bridges 1 areas (3 edges)
9. `@media (prefers-color-scheme: dark)` - bridges 1 areas (2 edges)
10. `@media (prefers-reduced-motion: reduce)` - bridges 1 areas (2 edges)

## Surprising Connections (you probably didn't know these)
- `fetch(action=counts)` --http_calls--> `jsonOut()`  [INFERRED]
  src/lib/clickTracking.ts → scripts/apps-script/click-tracking.gs
- `fetch(action=flags)` --http_calls--> `jsonOut()`  [INFERRED]
  src/lib/clickTracking.ts → scripts/apps-script/click-tracking.gs
- `SearchMatchResult` --references--> `Product`  [EXTRACTED]
  src/lib/search.ts → src/types/product.ts
- `Slide` --references--> `ProductCategory`  [EXTRACTED]
  src/components/HeroCarousel.tsx → src/types/product.ts
- `ProductCardProps` --references--> `Product`  [EXTRACTED]
  src/components/ProductCard.tsx → src/types/product.ts

## Import Cycles
- None detected.

## Communities (35 total, 8 thin omitted)

### Community 0 - "globals.css"
Cohesion: 0.01
Nodes (153): :root, .mono, .product-card, .product-card.is-revealed, .product-card:hover, .product-card:focus-visible, .product-photo, .product-photo img (+145 more)

### Community 1 - "page.tsx"
Cohesion: 0.09
Nodes (35): metadata, allProducts, Home(), AboutSection(), Footer(), HeroCarousel(), HeroCarouselProps, Slide (+27 more)

### Community 2 - "scripts"
Cohesion: 0.06
Nodes (30): dependencies, next, react, react-dom, zod, devDependencies, tsx, @types/node (+22 more)

### Community 3 - "search.test.ts"
Cohesion: 0.09
Nodes (24): getExpandedKeywords(), INVERTED_SYNONYM_INDEX, normalizeThaiPrefixes(), scoreProduct(), SearchMatchResult, SearchOptions, SYNONYM_MAP, tokenizeQuery() (+16 more)

### Community 4 - "Nice Crochet — System Architecture"
Cohesion: 0.12
Nodes (16): Before the first commit, Click tracking + sort-by-popularity — Google Apps Script, not SQLite (2026-08-24), Constraints (from the owner), Data model: catalog, not file list, Dev & QA Quality Gates, Hosting, Image pipeline (the actual hard part), Nice Crochet — System Architecture (+8 more)

### Community 5 - "Nice Crochet — Design Language"
Cohesion: 0.10
Nodes (20): About page: "Good to know" removed, Contact split out (2026-08-23), Avoid, Carousel control visibility over light photos (2026-08-23), Colors, Components, Design direction, Footer and search suggestions (2026-08-23), Instagram added alongside TikTok (2026-08-25) (+12 more)

### Community 6 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "click-tracking.gs"
Cohesion: 0.21
Nodes (16): API_TOKEN, doGet(), getCounts(), getFlags(), getOrCreateFlagsSheet(), getOrCreateSheet(), isValidToken(), jsonOut() (+8 more)

### Community 8 - "[0.3.0] - 2026-08-26"
Cohesion: 0.12
Nodes (15): [0.2.0] - 2026-08-24, [0.3.0] - 2026-08-26, [0.4.0] - 2026-08-31, [0.5.0] - 2026-09-06, Added, Added, Added, Added (+7 more)

### Community 9 - "pages.yml"
Cohesion: 0.14
Nodes (13): concurrency, cancel-in-progress, group, jobs, deploy, name, on, push (+5 more)

### Community 10 - "@media (max-width: 860px)"
Cohesion: 0.15
Nodes (13): @media (max-width: 860px), .carousel, .carousel-slide-fg, .carousel-copy, .carousel-copy p, .shop-layout, .filters, .product-grid (+5 more)

### Community 11 - "validate-catalog.ts"
Cohesion: 0.20
Nodes (10): CatalogSchema, __dirname, __filename, Product, ProductSchema, ROOT_DIR, VALID_CATEGORIES, VALID_COLOURS (+2 more)

### Community 12 - "Nice Crochet — Product Context"
Cohesion: 0.22
Nodes (8): Content still owned by the real brand (not invented, must be supplied before launch), Core features (this pass), Core problems this site solves, Nice Crochet — Product Context, Not in scope (by design, not just "not yet built"), Real product catalog (confirmed from `PRODUCTS/` photos, 26 of ~190 sampled), Target users, Vision

### Community 13 - "AGENTS.md"
Cohesion: 0.25
Nodes (7): Agent Memory, Agent skills, Domain docs, graphify, Issue tracker, Skills & Rules, Triage labels

### Community 14 - "appsscript.json"
Cohesion: 0.25
Nodes (7): dependencies, exceptionLogging, runtimeVersion, timeZone, webapp, access, executeAs

### Community 15 - "SLIDES"
Cohesion: 0.33
Nodes (6): SLIDES, ทุกชิ้นถักด้วยมือ ไม่ใช่งานโรงงาน, เล็กพอดีสำหรับทุกวัน, ที่ใส่บัตรหนึ่งแบบ สองสีให้เลือก, ซองใส่บัตรทรงจดหมาย, ปิดท้ายด้วยดอกไม้

### Community 16 - "1. Next.js Static Export Instead of Flutter Web or Dynamic Server"
Cohesion: 0.40
Nodes (4): 1. Next.js Static Export Instead of Flutter Web or Dynamic Server, Consequences, Context, Decision

### Community 17 - "2. Google Apps Script for Global Click Tracking"
Cohesion: 0.40
Nodes (4): 2. Google Apps Script for Global Click Tracking, Consequences, Context, Decision

### Community 18 - "Domain Docs"
Cohesion: 0.40
Nodes (4): Before exploring, read these, Domain Docs, Flag ADR conflicts, Use the glossary's vocabulary

### Community 19 - "Issue tracker: GitHub"
Cohesion: 0.40
Nodes (4): Conventions, Issue tracker: GitHub, When a skill says "fetch the relevant ticket", When a skill says "publish to the issue tracker"

### Community 20 - "SortDropdown.tsx"
Cohesion: 0.40
Nodes (3): OPTIONS, SortDropdownProps, SortOption

### Community 21 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): __dirname, __filename, nextConfig

### Community 24 - "@media (max-width: 520px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 520px), .product-grid, .stat-row

### Community 33 - "check.yml"
Cohesion: 0.22
Nodes (8): jobs, check, name, on, pull_request, push, permissions, contents

### Community 34 - "Nice Crochet"
Cohesion: 0.25
Nodes (7): Adding new photos, License, Local development and release, Nice Crochet, Pages, Run locally, Stack

## Knowledge Gaps
- **358 isolated node(s):** `name`, `pull_request`, `push`, `contents`, `check` (+353 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.
- **4 possibly unreachable function(s):** `__dirname`, `__dirname`, `__filename`, `__filename`
  Not reached from any recognized entry point - could be dead code, or dynamically dispatched/decorator-registered.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `page.tsx` to `search.test.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `pull_request`, `push` to the rest of the system?**
  _358 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `globals.css` be split into smaller, more focused modules?**
  _Cohesion score 0.012987012987012988 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09411764705882353 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `search.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08831908831908832 - nodes in this community are weakly interconnected._
- **Should `Nice Crochet — System Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._