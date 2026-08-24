// Optional click tracking + live product-visibility overrides, both backed by
// the same Google Apps Script Web App writing to/reading from a Google Sheet
// (see scripts/apps-script/click-tracking.gs). Every function here no-ops
// safely if the endpoint isn't configured — the site works fully without
// this; tracking, sort-by-popularity, and Sheet-driven show/hide are all
// enhancements layered on top of products.json's baked-in defaults.

const TRACKING_URL = process.env.NEXT_PUBLIC_CLICK_TRACKING_URL ?? '';
const TRACKING_TOKEN = process.env.NEXT_PUBLIC_CLICK_TRACKING_TOKEN ?? '';

/** Fire-and-forget: records one click for a product. Never throws, never blocks the UI. */
export function recordClick(productId: string): void {
  if (!TRACKING_URL) return;
  const url = `${TRACKING_URL}?action=click&productId=${encodeURIComponent(productId)}&token=${encodeURIComponent(TRACKING_TOKEN)}`;
  try {
    fetch(url, { method: 'GET', mode: 'no-cors', keepalive: true }).catch(() => {});
  } catch {
    // Ignore — tracking is best-effort only.
  }
}

/** Fetches current click counts as { [productId]: count }. Returns {} on any failure. */
export async function fetchClickCounts(): Promise<Record<string, number>> {
  if (!TRACKING_URL) return {};
  try {
    const res = await fetch(`${TRACKING_URL}?action=counts`, { method: 'GET' });
    if (!res.ok) return {};
    const data = await res.json();
    return data?.ok ? (data.counts ?? {}) : {};
  } catch {
    return {};
  }
}

export interface ProductFlags {
  showOnShelf: boolean;
  showOnHome: boolean;
}

/**
 * Fetches live showOnShelf/showOnHome overrides from the Sheet, keyed by
 * product id. Returns {} on any failure — callers must treat this as an
 * overlay on top of products.json's own flags, never the sole source.
 */
export async function fetchProductFlags(): Promise<Record<string, ProductFlags>> {
  if (!TRACKING_URL) return {};
  try {
    const res = await fetch(`${TRACKING_URL}?action=flags`, { method: 'GET' });
    if (!res.ok) return {};
    const data = await res.json();
    return data?.ok ? (data.flags ?? {}) : {};
  } catch {
    return {};
  }
}
