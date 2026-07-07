# Selected Works Redesign — Design

Date: 2026-07-07
Status: approved by user (brainstorming session)

## Goal

Rework the Work section so ads + digital consulting lead the story (branding stays included), make projects data-driven and easy to edit, add a tap-to-open project detail overlay with multi-image galleries and fullscreen zoom, and replace the white-tile client logo grid with a marquee. No new npm dependencies; first-visit page weight stays essentially unchanged.

## What exists today

- `components/Work.tsx`: pinned horizontal GSAP gallery of 7 flat cards (6 images + 1 video), title + tag only, not clickable; below it a static grid of 9 white logo tiles.
- Assets: `public/work/*.png|mp4` (flat), `public/clients/1..10.png` (transparent PNGs, several with dark elements).
- Copy in `lib/i18n.ts` (`work.label/title/logos`), bilingual ID/EN.

## 1. Data model — `lib/projects.ts`

One editable TypeScript file; adding a project = drop images in `public/work/<slug>/` + add one entry.

```ts
export type Project = {
  slug: string;
  title: string;
  category: "ads" | "consulting" | "branding" | "video";
  featured?: boolean;          // true → big 16:9 case-study card
  cover: string;               // card image (only thing shown on the card besides title/category)
  images: string[];            // overlay gallery, in order
  video?: string;              // optional mp4 (Rizz Burger)
  description?: { id: string; en: string }; // shown only inside the overlay
};
```

Initial content:

- **2 placeholder ads/consulting case studies** (`featured: true`), each with generated 1920×1080 placeholder slides (small file size, branded look, clearly marked as placeholders). User swaps real slides later by replacing files.
- Existing assets regrouped into projects with galleries: **Rubbix** (3 images), **Shiawase** (2 images), **Spill Photography** (1 image), **Rizz Burger** (video).

Category labels are bilingual via `lib/i18n.ts`, keyed by category id.

## 2. Section layout — featured + strip

Order inside the Work section:

1. Section head (pill + title, copy updated to lead with ads/consulting).
2. **Featured case studies**: large stacked 16:9 cards (fits 1920×1080 slides), full container width, tap to open overlay. Standard reveal animation, no pinning.
3. **Branding reel**: the existing pinned horizontal-scroll strip, kept but visually smaller, cards now tappable. It shows every non-`featured` project (branding, packaging, video). Reduced-motion behavior unchanged (no pin, natural flow).
4. **Client logo marquee** (below, replaces tile grid).

## 3. Project overlay

- Native `<dialog>` + `showModal()` — free Esc handling, focus trap, backdrop. No routing, no library.
- Content: title, category label, optional description, then gallery images stacked vertically (16:9 for ads slides, natural aspect otherwise); video renders as a muted looping `<video>` gallery item.
- Scroll: the dialog itself scrolls; Lenis is stopped while open (`lenis.stop()`/`start()`) so the page behind doesn't move. Landing-page scroll position is preserved trivially (no navigation).
- Close: X button, Esc, backdrop click, **and mobile back button** — opening pushes a history entry (`history.pushState`), `popstate` closes the overlay; closing via X/Esc calls `history.back()` so state stays consistent.
- Gallery images use `next/image` with `loading="lazy"` — they download only when the overlay opens, so visitors who never tap a card pay nothing.
- Meta Pixel: fire `ViewContent` (with project slug) on overlay open.

## 4. Fullscreen zoom view

- Tapping a gallery image expands it to a fullscreen layer (inside the same dialog).
- Starts fit-to-screen; tap/double-tap toggles ~2.5× zoom; panning is native two-axis scrolling of an `overflow: auto` container (momentum for free, works with touch).
- X or Esc returns to the overlay (not the page).
- ponytail: no pinch-to-zoom gesture handling; tap-toggle + native scroll covers reading dense slides. Add a pinch library only if users ask.

## 5. Client logo marquee — light chips

- Replaces the static white tile grid under the same "Brands we've shaped" heading.
- One continuous row of logos sliding via **pure CSS** keyframe (`transform: translateX`), content duplicated once for a seamless loop. Pauses on hover; renders as a static wrapped row under `prefers-reduced-motion`.
- Each logo sits on a **soft rounded off-white chip** (smaller and warmer than the current tiles, generous padding). Rationale: several client logos have dark/colored elements (CASH black lettering, Universitas Ciputra navy seal) that die on the dark background, and these are ODOS-designed logos — their true colors are the portfolio. Chips keep legibility and color fidelity.

## 6. i18n + copy

- New strings in both languages: featured/case-study section labels, category labels, overlay close/zoom a11y labels.
- Work section title/copy rebalanced toward ads & digital consulting.

## Performance constraints (hard requirements)

- No new npm dependencies.
- Marquee is CSS-only; no per-frame JS.
- Overlay gallery images lazy — nothing extra on first paint.
- Placeholder slides generated small (tens of KB each).
- README gains a note: export real case-study slides under ~500 KB each.

## Error handling / edge cases

- Reduced motion: marquee static, branding strip unpinned (existing pattern), overlay open/close without animation.
- `<dialog>` is baseline-available in all supported browsers; no fallback needed.
- Missing/failed image in a gallery: `next/image` default behavior (alt text), no custom handling.

## Testing

- Playwright MCP verification: open each project overlay (desktop + 390×844 mobile), scroll gallery, zoom in/out, close via X/Esc/backdrop/back button, confirm landing scroll position preserved; marquee slides and pauses on hover; reduced-motion pass; Pixel `ViewContent` smoke check; `npm run build` green.
