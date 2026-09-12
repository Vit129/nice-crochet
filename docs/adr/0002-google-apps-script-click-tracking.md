# 2. Google Apps Script for Global Click Tracking

Date: 2026-08-24
Status: Accepted

## Context
The site required tracking how many times each product card is opened to enable "Sort by popularity" across all visitors. This requires persistent cross-visitor storage, but the site must remain hosted on zero-compute static infrastructure (GitHub Pages). SQLite is unviable without a persistent server process.

## Decision
Use a lightweight **Google Apps Script web app** connected to a Google Sheet as the serverless write/read endpoint:
- Receives anonymous click increments via CORS fetch.
- Returns aggregated click counts cached or fetched at page load.
- Preserves zero hosting costs and keeps deployment completely serverless.

## Consequences
- Requires network reachability to Google Apps Script domain.
- If Apps Script fails or is blocked, the frontend gracefully falls back to default catalog ordering without breaking the site.
