type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }
}

export function trackEnrollClick(params: {
  itemId: string;
  itemName: string;
  price?: string;
  location: string;
}) {
  track("enroll_click", {
    item_id: params.itemId,
    item_name: params.itemName,
    price: params.price,
    location: params.location,
  });
}

export function trackSearch(searchTerm: string) {
  track("search", { search_term: searchTerm });
}

export function trackViewItem(params: {
  itemId: string;
  itemName: string;
  price?: string;
  category?: string;
}) {
  track("view_item", {
    item_id: params.itemId,
    item_name: params.itemName,
    price: params.price,
    item_category: params.category,
  });
}
