export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackContact(): void {
  if (!PIXEL_ID) return;
  window.fbq?.("track", "Contact");
}
