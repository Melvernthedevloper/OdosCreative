# ODOS Creative — 3D Landing Page Design

**Date:** 2026-07-06
**Client:** ODOS Creative (Marketing & Branding Agency, Indonesia)
**Goal:** Award-level (Awwwards/FWA-caliber) single landing page that converts visitors to WhatsApp leads, Meta Pixel-ready.

## Concept — "Molten Growth"

The circles of the ODOS logotype come alive as a molten orange orb in a near-black void. The orb is the site's light source: it glows `#FC6220`, deforms like liquid under the cursor, and morphs/travels as the user scrolls — calm sphere (hero) → stretched and energetic (work) → erupting into the full orange gradient (CTA finale). Tagline made literal: *digital growth fueled with passion*.

## Stack (Approach A — approved)

- **Next.js 15** (App Router, TypeScript) — deployable to Vercel
- **React Three Fiber + drei** — Three.js integration
- **Custom GLSL shader** on an icosphere: simplex-noise vertex displacement, fresnel-glow fragment; uniforms driven by mouse + scroll
- **GSAP + ScrollTrigger** (`@gsap/react` `useGSAP`) — section choreography
- **Lenis** — smooth scroll, synced to ScrollTrigger
- No CSS framework — hand-rolled CSS modules / globals (small surface, full control)

## Brand system (from `Website Odos/Brand_Assets/ODOS Brand Guideline.pdf`)

- **Colors:** `#FC6220` primary orange · `#0A0908` near-black canvas · `#FFFFFF` text · hairline borders `rgba(255,255,255,0.12)` · CTA gradient `#E8351A → #FC6220 → #FFAA30`
- **Logo:** use REAL assets, never recreated text:
  - `Brand_Assets/Logo.PNG` — orange "od" mark
  - `Brand_Assets/logo_alternative.png` — white variant (verify od/odos + legibility on dark during build; fall back to white-filtered Logo.PNG if unsuitable)
  - Assets copied into `public/brand/`
- **Type:** Plus Jakarta Sans (Google Fonts via `next/font`) — 800 tight-tracked headings, 400/500 body. Rounded logotype style stays exclusive to logo images.
- **Motif:** orange pill-shaped section labels (echoes guideline's "LOGO AND CONCEPT" pills).

## Page structure (single route `/`)

1. **Hero** — full-viewport canvas with molten orb; H1 headline + tagline; WhatsApp CTA; scroll hint. Header: white logo top-left, ID/EN toggle top-right.
2. **Services / Layanan** — 4 offerings from the guideline: Video Production, Logo & Branding, Social Media Management, Marketing Strategy. Full-width hover-lit rows; orb drifts behind content.
3. **Selected Work / Portofolio** — pinned horizontal-scroll gallery of real pieces from `Website Odos/Portofolio/` (Rubbix, Shiawase, Spill Photography, Rizz Burger video poster). Below: "brands we've shaped" logo strip from `Website Odos/Logo Web/` (client logos ODOS designed).
4. **About / Tentang** — bilingual rewrite of guideline "About ODOS" copy + animated counters. Launch defaults (client-editable in the copy dictionary): 50+ projects, 30+ brands, 5 services.
5. **CTA finale** — orb erupts; background floods to orange gradient; "Contact us now" → WhatsApp. Footer: phone +62 823 1439 3503, Odoscdc@gmail.com, IG @Odos_Creative (from guideline p.11).

## Bilingual (ID default, EN toggle)

- Single dictionary module `lib/i18n.ts` with `id` and `en` objects; React context holds current lang; toggle in header. No i18n library — one page. Persist choice in `localStorage`.

## Conversion + Meta Pixel

- All CTAs → `https://wa.me/6282314393503?text=<pre-filled intro>` (pre-filled text localized).
- `lib/pixel.ts` + `<MetaPixel />` component: reads `NEXT_PUBLIC_META_PIXEL_ID`; if unset, renders nothing. Fires `PageView` on load; `trackContact()` helper fires `Contact` on every WhatsApp CTA click. Client pastes Pixel ID later — no rewiring.

## Performance & accessibility (award-level table stakes)

- DPR capped at 2; shader geometry LOD lower on mobile; single WebGL canvas reused across sections (fixed, behind content).
- `prefers-reduced-motion`: static gradient hero, no Lenis, no scroll pinning.
- All copy is real HTML text (SEO); portfolio images via `next/image`, lazy.
- Metadata: title, description, OG image (use `Brand_Assets/Banner.png`).
- Interactive elements: hover, focus-visible, active states; canvas is `aria-hidden`.

## Error handling

- WebGL unavailable → CSS-gradient fallback hero (feature-detect before mounting canvas).
- Missing Pixel ID → analytics silently disabled (never throws).

## Testing / verification

- `npm run build` passes clean (TS strict).
- Playwright screenshot pass on desktop + mobile viewport; visually verify each section vs this spec, ≥2 comparison rounds.
- One smoke check: WhatsApp links contain the right number; lang toggle swaps copy; `fbq` stub called with `Contact` on CTA click when Pixel ID set.

## Out of scope

- Contact form, CMS, blog, multi-page routes, case-study detail pages, cookie-consent banner (add before running EU traffic; ID-targeted ads fine for launch).
