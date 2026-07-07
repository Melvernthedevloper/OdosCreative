# ODOS Creative — Landing Page

Award-style 3D landing page. Next.js + React Three Fiber + GSAP + Lenis.

## Run

    npm install
    npm run dev        # http://localhost:3000

## Deploy (Vercel)

Push to GitHub → import in Vercel. Set env vars:

- `NEXT_PUBLIC_META_PIXEL_ID` — your Meta Pixel ID (empty = analytics off).
  Events wired: `PageView` on load, `Contact` on every WhatsApp click.
- `NEXT_PUBLIC_SITE_URL` — production URL for Open Graph tags.

## Edit content

All copy (ID + EN) lives in `lib/i18n.ts`. Projects live in `lib/projects.ts`:
drop images in `public/work/<slug>/`, add one entry (with each image's pixel
size), redeploy. Ads/consulting case-study slides are 1920×1080 — export them
as JPG/PNG **under ~500 KB each**. The two shipped case studies are
placeholders; replace their slide files with real ones. Client logos live in
`public/clients/` and are listed in `components/ClientMarquee.tsx`.
