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

All copy (ID + EN) lives in `lib/i18n.ts`. Portfolio pieces and client
logos are listed at the top of `components/Work.tsx`; images live in
`public/work/` and `public/clients/`.
