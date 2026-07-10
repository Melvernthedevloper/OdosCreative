// ODOS Creative pixel ("Logo Landing Page", 1262641055984963); env var overrides.
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1262641055984963";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackContact(): void {
  if (!PIXEL_ID) return;
  window.fbq?.("track", "Contact");
}

export function trackViewContent(name: string): void {
  if (!PIXEL_ID) return;
  window.fbq?.("track", "ViewContent", { content_name: name });
}
