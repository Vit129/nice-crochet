# Graph Summary — delivery-workflow-completion
_Auto-generated from GRAPH_REPORT.md · do not edit manually_
_Regen: `graphify update .`_

## Summary
- 493 nodes · 569 edges · 34 communities (26 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output


## Graph Freshness
- Built from commit: `08736342`
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
10. `doGet()` - 6 edges


## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `Product` - bridges 1 areas (17 edges)
2. `Nice Crochet — System Architecture` - bridges 1 areas (16 edges)
3. `@media (max-width: 860px)` - bridges 1 areas (13 edges)
4. `SLIDES` - bridges 1 areas (6 edges)
5. `searchProducts()` - bridges 1 areas (5 edges)
6. `fetchClickCounts()` - bridges 1 areas (4 edges)
7. `fetchProductFlags()` - bridges 1 areas (4 edges)
8. `scoreProduct()` - bridges 1 areas (4 edges)
9. `@media (max-width: 520px)` - bridges 1 areas (3 edges)

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


_Full map → GRAPH_REPORT.md · query: `graphify query "..."`_
