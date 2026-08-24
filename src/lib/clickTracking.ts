// Optional click-count tracking, backed by a Google Apps Script Web App
// writing to a Google Sheet (see scripts/apps-script/click-tracking.gs).
// Both functions no-op safely if the endpoint isn't configured — the site
// works fully without this, tracking/sorting-by-popularity is an enhancement.

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
