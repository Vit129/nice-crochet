# 1. Next.js Static Export Instead of Flutter Web or Dynamic Server

Date: 2026-08-23
Status: Accepted

## Context
Nice Crochet is a portfolio showcase website displaying ~190 handmade crochet photos across ~40-60 pieces. The owner required:
- Zero server costs / no database maintenance.
- Static hosting deployable to GitHub Pages.
- Fast mobile loading and clean SEO.

We evaluated Flutter Web, Vite+React, Astro, and Next.js.

## Decision
We chose **Next.js with `output: 'export'`** (generating purely static HTML/CSS/JS):
- Compiles to flat static assets, perfectly matching GitHub Pages without compute costs.
- Avoids Flutter Web's canvas rendering limitations (worse SEO, poor native image lazy loading, heavy bundle size).
- Bypasses `next/image` runtime optimizer in favor of build-time pre-generated WebP images and plain `<img loading="lazy">`.

## Consequences
- No server-side runtime APIs or SSR features can be used.
- All filtering and search must execute client-side.
- Image optimization must occur at build time via `scripts/build-images.sh`.
