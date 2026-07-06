# ODOS Creative 3D Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Award-level single-page 3D landing site for ODOS Creative — dark canvas, molten orange shader orb, GSAP scroll choreography, bilingual ID/EN, WhatsApp conversion, Meta Pixel-ready.

**Architecture:** Next.js App Router site with one route. A fixed, full-viewport React Three Fiber canvas sits behind the content and renders a custom-shader icosphere ("molten orb") whose uniforms are driven by a shared `scrollState` module (updated by ScrollTrigger) and the pointer. Content sections are client components choreographed by GSAP ScrollTrigger over Lenis smooth scroll. Copy lives in one bilingual dictionary behind a React context. Meta Pixel is an env-gated module.

**Tech Stack:** Next.js 15+ (TypeScript, App Router), React 19, three + @react-three/fiber (no drei — not needed), gsap + @gsap/react, lenis. No CSS framework, no test framework (verification via `next build`, browser smoke checks, and Playwright MCP screenshots).

## Global Constraints

- Colors exactly: `#FC6220` (primary), `#0A0908` (canvas), `#FFFFFF` (text), hairlines `rgba(255,255,255,0.12)`, CTA gradient `#E8351A → #FC6220 → #FFAA30`.
- Logo: ONLY real files copied from `../Website Odos/Brand_Assets/` (`Logo.PNG` orange mark, `logo_alternative.png` white variant). Never render the wordmark as text.
- Typography: Plus Jakarta Sans via `next/font/google`, weights 400/500/800. Headings weight 800, letter-spacing −0.04em.
- Default language `id`, toggle to `en`, persisted in `localStorage` key `odos-lang`.
- All CTAs → `https://wa.me/6282314393503?text=<encoded localized text>` and fire Meta Pixel `Contact`.
- Pixel ID from `NEXT_PUBLIC_META_PIXEL_ID`; unset ⇒ analytics fully disabled, never throws.
- Motion (GSAP/keyframe animation) uses only `transform`/`opacity`; never animate layout properties (width/height/top/left/margin) and never `transition: all`. Short hover transitions on `color`/`border-color`/`box-shadow` for interactive states are permitted. Every interactive element has hover, focus-visible, and active states.
- `prefers-reduced-motion: reduce` ⇒ no canvas, no Lenis, no scroll pinning, no reveals (content plainly visible). WebGL unavailable ⇒ no canvas, CSS glow fallback remains.
- Canvas `aria-hidden`, DPR capped at 2, icosphere detail 64 desktop / 32 for viewports < 768px.
- Working directory for all commands: `/Users/raff.melvern/Documents/melvern-ngoding/odos-creative`. The asset source `../Website Odos/` is read-only — never modify it.
- Commit after every task with the trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## File Structure

```
odos-creative/
├── app/
│   ├── layout.tsx          # fonts, metadata, providers
│   ├── page.tsx            # section composition
│   ├── globals.css         # tokens + all styling
│   └── icon.png            # favicon (copy of Logo.PNG)
├── components/
│   ├── LanguageProvider.tsx
│   ├── MetaPixel.tsx
│   ├── SmoothScroll.tsx    # Lenis + ScrollTrigger sync + scrollState updates
│   ├── Scene.tsx           # fixed R3F canvas, feature detection
│   ├── MoltenOrb.tsx       # shader mesh
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Work.tsx
│   ├── About.tsx
│   └── CtaFinale.tsx       # CTA + footer
├── lib/
│   ├── i18n.ts             # dictionary, Lang type, waHref
│   ├── pixel.ts            # trackContact
│   ├── gsap.ts             # single registration point
│   ├── scrollState.ts      # shared mutable scroll/mouse state
│   └── useReveal.ts        # fade-up reveal hook
└── public/
    ├── brand/  logo-orange.png, logo-white.png, banner.png
    ├── work/   rubbix.png, rubbix-beans.png, rubbix-coffee.png,
    │           shiawase-website.png, shiawase-2.png, spill-photography.png,
    │           rizz-burger.mp4
    └── clients/ 1.png 2.png 3.png 4.png 5.png 6.png 8.png 9.png 10.png
```

---

### Task 1: Scaffold, assets, fonts, global styles

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `.env.example`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Copy assets into `public/` and `app/icon.png`

**Interfaces:**
- Produces: CSS custom properties (`--orange`, `--bg`, `--hairline`, `--font-jakarta`), classes `.container`, `.pill`, `.btn-wa`, section classes used by all later tasks. `app/layout.tsx` placeholder to be extended in Task 2.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "odos-creative",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
npm install next@latest react@latest react-dom@latest three@latest @react-three/fiber@latest gsap@latest @gsap/react@latest lenis@latest
npm install -D typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest @types/three@latest
```

Expected: installs cleanly (React 19 / Next 15+; if `@react-three/fiber` peer-warns about React, use `@react-three/fiber@rc` — v9+ is the React-19-compatible line).

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Write `next.config.ts` and `.gitignore` and `.env.example`**

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

`.gitignore`:
```
node_modules/
.next/
out/
.env*.local
.DS_Store
*.tsbuildinfo
next-env.d.ts
```

`.env.example`:
```
# Paste your Meta Pixel ID here (leave empty to disable analytics)
NEXT_PUBLIC_META_PIXEL_ID=
# Canonical site URL for Open Graph metadata
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 5: Copy brand + portfolio assets** (source folder has spaces — keep quotes)

```bash
cd "/Users/raff.melvern/Documents/melvern-ngoding/odos-creative"
mkdir -p public/brand public/work public/clients
SRC="../Website Odos"
cp "$SRC/Brand_Assets/Logo.PNG"              public/brand/logo-orange.png
cp "$SRC/Brand_Assets/logo_alternative.png"  public/brand/logo-white.png
cp "$SRC/Brand_Assets/Banner.png"            public/brand/banner.png
cp "$SRC/Portofolio/Rubbix.png"              public/work/rubbix.png
cp "$SRC/Portofolio/Rubbix Beans.png"        public/work/rubbix-beans.png
cp "$SRC/Portofolio/Rubbix Coffee.png"       public/work/rubbix-coffee.png
cp "$SRC/Portofolio/Shiawase Website.png"    public/work/shiawase-website.png
cp "$SRC/Portofolio/Shiawase 2.png"          public/work/shiawase-2.png
cp "$SRC/Portofolio/Spill Photography.png"   public/work/spill-photography.png
cp "$SRC/Portofolio/Rizz Burger.mp4"         public/work/rizz-burger.mp4
for n in 1 2 3 4 5 6 8 9 10; do cp "$SRC/Logo Web/$n.png" "public/clients/$n.png"; done
cp "$SRC/Brand_Assets/Logo.PNG" app/icon.png
```

Expected: `ls public/brand public/work public/clients` shows 3 + 7 + 9 files.

- [ ] **Step 6: Write `app/globals.css`** (complete design system)

```css
:root {
  --bg: #0a0908;
  --orange: #fc6220;
  --orange-hot: #ffaa30;
  --orange-deep: #e8351a;
  --white: #ffffff;
  --dim: rgba(255, 255, 255, 0.6);
  --hairline: rgba(255, 255, 255, 0.12);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }

body {
  background: var(--bg);
  color: var(--white);
  font-family: var(--font-jakarta), system-ui, sans-serif;
  font-weight: 400;
  line-height: 1.7;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

img, video { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
button { font: inherit; background: none; border: none; cursor: pointer; color: inherit; }

a:focus-visible, button:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 3px;
  border-radius: 4px;
}

/* ---- layers ---- */
.bg-glow {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background: radial-gradient(ellipse 60% 50% at 50% 45%, rgba(252, 98, 32, 0.13), transparent 70%);
}
.webgl-scene { position: fixed; inset: 0; z-index: 1; pointer-events: none; }
.cta-flood {
  position: fixed; inset: 0; z-index: 2; pointer-events: none; opacity: 0;
  background: linear-gradient(160deg, #e8351a 0%, #fc6220 50%, #ffaa30 100%);
}
main { position: relative; z-index: 3; }

/* ---- primitives ---- */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.pill {
  display: inline-block;
  background: var(--orange);
  color: var(--white);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 8px 20px;
  border-radius: 999px;
}

h1, h2, h3 { font-weight: 800; letter-spacing: -0.04em; line-height: 1.05; }
h2 { font-size: clamp(34px, 4.5vw, 56px); margin: 18px 0 20px; }

.btn-wa {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--orange); color: var(--white);
  font-weight: 800; font-size: 17px;
  padding: 16px 34px; border-radius: 999px;
  box-shadow: 0 8px 32px rgba(252, 98, 32, 0.35), 0 2px 8px rgba(232, 53, 26, 0.3);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
}
.btn-wa:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 14px 44px rgba(252, 98, 32, 0.5), 0 4px 12px rgba(232, 53, 26, 0.4); }
.btn-wa:active { transform: translateY(0) scale(0.98); }

/* ---- header ---- */
.site-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 32px;
}
.site-header .logo img { height: 30px; width: auto; }
.site-nav { display: flex; gap: 28px; font-size: 15px; font-weight: 500; color: var(--dim); }
.site-nav a { transition: color 0.2s ease, transform 0.2s ease; }
.site-nav a:hover { color: var(--orange); }
.site-nav a:active { transform: translateY(1px); }
.lang-toggle {
  border: 1px solid var(--hairline); border-radius: 999px;
  padding: 7px 16px; font-size: 13px; font-weight: 800; letter-spacing: 0.08em;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.lang-toggle:hover { border-color: var(--orange); color: var(--orange); }
.lang-toggle:active { transform: scale(0.96); }
@media (max-width: 767px) { .site-nav { display: none; } }

/* ---- hero ---- */
.hero {
  min-height: 100svh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 120px 24px 80px; position: relative;
}
.hero h1 { font-size: clamp(44px, 7.5vw, 100px); max-width: 12ch; margin: 22px 0 26px; }
.hero h1 em { font-style: normal; color: var(--orange); }
.hero .sub { max-width: 560px; color: var(--dim); font-size: 17px; margin-bottom: 38px; }
.hero .eyebrow { color: var(--orange); font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; font-size: 13px; }
.scroll-hint {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  color: var(--dim); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;
}

/* ---- sections ---- */
.section { padding: 130px 0; }
.section-head { margin-bottom: 56px; }

/* services */
.service-row {
  display: grid; grid-template-columns: 64px 1fr 1.1fr; gap: 24px; align-items: baseline;
  padding: 36px 8px; border-top: 1px solid var(--hairline);
  transition: transform 0.3s ease;
}
.service-row:last-child { border-bottom: 1px solid var(--hairline); }
.service-row:hover { transform: translateX(12px); }
.service-row .idx { color: var(--orange); font-weight: 800; font-size: 15px; }
.service-row h3 { font-size: clamp(24px, 3vw, 36px); transition: color 0.3s ease; }
.service-row:hover h3 { color: var(--orange); }
.service-row p { color: var(--dim); font-size: 16px; }
@media (max-width: 767px) { .service-row { grid-template-columns: 40px 1fr; } .service-row p { grid-column: 2; } }

/* work */
.work-section { overflow: hidden; }
.work-track { display: flex; gap: 28px; padding: 0 24px; width: max-content; }
.work-card {
  position: relative; width: min(60vw, 460px); height: min(62vh, 540px);
  border-radius: 18px; overflow: hidden; flex-shrink: 0;
  border: 1px solid var(--hairline); background: #141210;
}
.work-card img, .work-card video { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.work-card:hover img, .work-card:hover video { transform: scale(1.05); }
.work-card .meta {
  position: absolute; left: 0; right: 0; bottom: 0; padding: 44px 22px 18px;
  background: linear-gradient(to top, rgba(10, 9, 8, 0.85), transparent);
  display: flex; justify-content: space-between; align-items: baseline;
}
.work-card .meta strong { font-size: 19px; font-weight: 800; letter-spacing: -0.02em; }
.work-card .meta span { color: var(--orange); font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
@media (max-width: 767px) { .work-card { width: 78vw; height: 54vh; } }

.client-strip { margin-top: 90px; }
.client-strip .label { color: var(--dim); font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 28px; }
.client-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; }
.client-grid .tile {
  background: var(--white); border-radius: 14px; aspect-ratio: 4/3;
  display: flex; align-items: center; justify-content: center; padding: 18px;
  transition: transform 0.25s ease;
}
.client-grid .tile:hover { transform: translateY(-4px); }
.client-grid img { max-height: 100%; object-fit: contain; }

/* about */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.about-grid .body { color: var(--dim); font-size: 18px; }
.counters { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 12px; }
.counter .num { font-size: clamp(40px, 5vw, 64px); font-weight: 800; letter-spacing: -0.04em; color: var(--orange); line-height: 1; }
.counter .lbl { color: var(--dim); font-size: 14px; margin-top: 8px; }
@media (max-width: 767px) { .about-grid { grid-template-columns: 1fr; gap: 36px; } }

/* cta finale */
.cta {
  min-height: 100svh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center; padding: 140px 24px 0;
}
.cta h2 { font-size: clamp(40px, 6.5vw, 84px); max-width: 14ch; }
.cta .sub { color: var(--dim); max-width: 480px; margin: 8px 0 36px; }
.cta.flooded .sub { color: rgba(255, 255, 255, 0.85); }
.cta .btn-wa.inverted { background: var(--white); color: var(--orange-deep); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25); }

.site-footer {
  width: 100%; margin-top: 120px; border-top: 1px solid rgba(255, 255, 255, 0.25);
  padding: 32px 24px 40px;
  display: flex; flex-wrap: wrap; gap: 18px; align-items: center; justify-content: space-between;
  font-size: 14px;
}
.site-footer .contacts { display: flex; flex-wrap: wrap; gap: 22px; }
.site-footer a { font-weight: 500; transition: opacity 0.2s ease; }
.site-footer a:hover { opacity: 0.7; }
.site-footer .logo img { height: 24px; width: auto; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```

- [ ] **Step 7: Write placeholder `app/layout.tsx` and `app/page.tsx`**

`app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "ODOS Creative — Digital Growth Fueled With Passion",
  description:
    "Agensi marketing & branding: video, logo, sosial media, dan strategi pemasaran untuk membawa bisnis Anda ke dunia digital.",
  openGraph: {
    title: "ODOS Creative — Digital Growth Fueled With Passion",
    description:
      "Marketing & branding agency: video, logo, social media, and marketing strategy.",
    images: ["/brand/banner.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={jakarta.variable}>{children}</body>
    </html>
  );
}
```

`app/page.tsx`:
```tsx
export default function Page() {
  return (
    <main>
      <div className="hero">
        <h1>ODOS</h1>
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Verify build**

```bash
npm run build
```
Expected: compiles with no type errors, route `/` prerendered.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js app with brand assets and design tokens

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: i18n, Meta Pixel, GSAP/Lenis plumbing

**Files:**
- Create: `lib/i18n.ts`, `lib/pixel.ts`, `lib/gsap.ts`, `lib/scrollState.ts`, `components/LanguageProvider.tsx`, `components/MetaPixel.tsx`, `components/SmoothScroll.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces:
  - `useLang(): { lang: Lang; t: Dict; toggle: () => void }` from `components/LanguageProvider`
  - `waHref(t: Dict): string`, `dict`, `type Lang = "id" | "en"`, `type Dict = typeof dict.id` from `lib/i18n`
  - `trackContact(): void` from `lib/pixel`
  - `gsap`, `ScrollTrigger`, `useGSAP` from `lib/gsap` (single registration point — all later tasks import GSAP from here, never from `gsap` directly)
  - `scrollState: { progress: number; mouse: { x: number; y: number } }` from `lib/scrollState`

- [ ] **Step 1: Write `lib/i18n.ts`** (full bilingual dictionary — final copy)

```ts
export type Lang = "id" | "en";

export const WA_NUMBER = "6282314393503";

export const dict = {
  id: {
    nav: { services: "Layanan", work: "Karya", about: "Tentang", contact: "Kontak" },
    hero: {
      eyebrow: "Marketing & Branding Agency",
      title: "Brand Anda, <em>menyala</em> di dunia digital.",
      sub: "ODOS Creative membantu bisnis masuk ke dunia digital dengan mudah dan cepat — lewat video, logo, sosial media, dan strategi pemasaran yang dikerjakan dengan passion.",
      cta: "Ngobrol via WhatsApp",
      scroll: "Scroll untuk menjelajah",
    },
    services: {
      label: "Layanan",
      title: "Yang kami kerjakan",
      items: [
        { t: "Video Production", d: "Konten video yang bikin orang berhenti scroll — dari konsep, produksi, sampai final cut." },
        { t: "Logo & Branding", d: "Identitas visual yang melekat: logo, brand guideline, dan sistem visual yang konsisten." },
        { t: "Social Media Management", d: "Sosial media terurus tanpa pusing — konten terjadwal, audiens tetap engaged." },
        { t: "Marketing Strategy", d: "Strategi pemasaran berbasis data supaya setiap budget bekerja lebih keras." },
      ],
    },
    work: { label: "Karya", title: "Karya pilihan", logos: "Brand yang kami bentuk" },
    about: {
      label: "Tentang",
      title: "Tentang ODOS",
      body: "ODOS Creative adalah agensi marketing & branding dengan spesialisasi pembuatan video, logo, manajemen sosial media, branding, dan strategi pemasaran. Tujuan kami satu: membantu setiap bisnis masuk ke dunia digital dengan mudah dan cepat.",
      counters: [
        { n: 50, suffix: "+", l: "Proyek selesai" },
        { n: 30, suffix: "+", l: "Brand ditangani" },
        { n: 5, suffix: "", l: "Layanan inti" },
      ],
    },
    cta: {
      title: "Siap bertumbuh?",
      sub: "Ceritakan bisnis Anda. Kami balas cepat di WhatsApp.",
      button: "Hubungi kami sekarang",
    },
    footer: { tagline: "Digital growth fueled with passion" },
    waText: "Halo ODOS! Saya tertarik mengembangkan bisnis saya bersama kalian.",
  },
  en: {
    nav: { services: "Services", work: "Work", about: "About", contact: "Contact" },
    hero: {
      eyebrow: "Marketing & Branding Agency",
      title: "Your brand, <em>glowing</em> in the digital world.",
      sub: "ODOS Creative takes businesses into the digital world fast and friction-free — through video, logos, social media, and marketing strategy fueled with passion.",
      cta: "Chat on WhatsApp",
      scroll: "Scroll to explore",
    },
    services: {
      label: "Services",
      title: "What we do",
      items: [
        { t: "Video Production", d: "Video content that stops the scroll — concept, production, and final cut." },
        { t: "Logo & Branding", d: "Visual identity that sticks: logos, brand guidelines, and consistent visual systems." },
        { t: "Social Media Management", d: "Hands-off social media — scheduled content, audiences kept engaged." },
        { t: "Marketing Strategy", d: "Data-driven marketing strategy that makes every budget work harder." },
      ],
    },
    work: { label: "Work", title: "Selected work", logos: "Brands we've shaped" },
    about: {
      label: "About",
      title: "About ODOS",
      body: "ODOS Creative is a marketing & branding agency specialising in video production, logo design, social media management, branding, and marketing strategy. One goal: getting every business into the digital world quickly and easily.",
      counters: [
        { n: 50, suffix: "+", l: "Projects delivered" },
        { n: 30, suffix: "+", l: "Brands served" },
        { n: 5, suffix: "", l: "Core services" },
      ],
    },
    cta: {
      title: "Ready to grow?",
      sub: "Tell us about your business. We reply fast on WhatsApp.",
      button: "Contact us now",
    },
    footer: { tagline: "Digital growth fueled with passion" },
    waText: "Hi ODOS! I'd like to grow my business with you.",
  },
} as const;

export type Dict = (typeof dict)[Lang];

export function waHref(t: Dict): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.waText)}`;
}
```

Note: `hero.title` contains `<em>` and is rendered with `dangerouslySetInnerHTML` — the string is our own constant, not user input.

- [ ] **Step 2: Write `lib/pixel.ts`**

```ts
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
```

- [ ] **Step 3: Write `lib/gsap.ts` and `lib/scrollState.ts`**

`lib/gsap.ts`:
```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

`lib/scrollState.ts`:
```ts
// Shared mutable state read by the WebGL orb every frame — deliberately not
// React state to avoid re-renders at 60fps.
export const scrollState = {
  progress: 0, // 0 at top of page, 1 at bottom
  mouse: { x: 0, y: 0 }, // normalized -1..1
};
```

- [ ] **Step 4: Write `components/LanguageProvider.tsx`**

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, type Dict, type Lang } from "@/lib/i18n";

const LangContext = createContext<{ lang: Lang; t: Dict; toggle: () => void }>({
  lang: "id",
  t: dict.id,
  toggle: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");

  useEffect(() => {
    const stored = localStorage.getItem("odos-lang");
    if (stored === "en" || stored === "id") setLang(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("odos-lang", lang);
  }, [lang]);

  const toggle = () => setLang((l) => (l === "id" ? "en" : "id"));

  return (
    <LangContext.Provider value={{ lang, t: dict[lang], toggle }}>
      {children}
    </LangContext.Provider>
  );
}
```

- [ ] **Step 5: Write `components/MetaPixel.tsx`**

```tsx
"use client";

import Script from "next/script";
import { PIXEL_ID } from "@/lib/pixel";

export default function MetaPixel() {
  if (!PIXEL_ID) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
```

- [ ] **Step 6: Write `components/SmoothScroll.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/scrollState";

export default function SmoothScroll() {
  useEffect(() => {
    // Global scroll progress feeds the orb even in reduced-motion mode.
    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollState.progress = self.progress;
      },
    });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return () => progressTrigger.kill();

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      progressTrigger.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
```

- [ ] **Step 7: Wire providers into `app/layout.tsx`** (replace the `RootLayout` body)

```tsx
import { LanguageProvider } from "@/components/LanguageProvider";
import MetaPixel from "@/components/MetaPixel";
import SmoothScroll from "@/components/SmoothScroll";
```

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={jakarta.variable}>
        <LanguageProvider>
          <MetaPixel />
          <SmoothScroll />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Verify build**

```bash
npm run build
```
Expected: clean compile, no type errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add i18n dictionary, Meta Pixel module, Lenis+GSAP plumbing

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Header + Hero + reveal hook

**Files:**
- Create: `components/Header.tsx`, `components/Hero.tsx`, `lib/useReveal.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useLang`, `waHref`, `trackContact`, `lib/gsap`
- Produces: `useReveal(ref: React.RefObject<HTMLElement | null>): void` — animates every `[data-reveal]` descendant with a fade-up on scroll entry; skipped under reduced motion. Used by Tasks 4–6.

- [ ] **Step 1: Write `lib/useReveal.ts`**

```ts
import { gsap, useGSAP } from "@/lib/gsap";

export function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 44,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
      });
    },
    { scope: ref }
  );
}
```

- [ ] **Step 2: Write `components/Header.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";

export default function Header() {
  const { lang, t, toggle } = useLang();
  return (
    <header className="site-header">
      <a href="#top" className="logo" aria-label="ODOS Creative">
        <Image src="/brand/logo-white.png" alt="ODOS" width={120} height={30} priority />
      </a>
      <nav className="site-nav" aria-label="Main">
        <a href="#layanan">{t.nav.services}</a>
        <a href="#karya">{t.nav.work}</a>
        <a href="#tentang">{t.nav.about}</a>
        <a href="#kontak">{t.nav.contact}</a>
      </nav>
      <button className="lang-toggle" onClick={toggle} aria-label="Switch language">
        {lang === "id" ? "EN" : "ID"}
      </button>
    </header>
  );
}
```

Note: `logo-white.png` must be verified visible on the dark background in Step 5 (spec flags it might be an unusable variant). If it renders empty or as the wrong mark, substitute `/brand/logo-orange.png` here and in `CtaFinale` — orange `#FC6220` reads fine on `#0A0908`.

- [ ] **Step 3: Write `components/Hero.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useLang } from "@/components/LanguageProvider";
import { waHref } from "@/lib/i18n";
import { trackContact } from "@/lib/pixel";
import { useReveal } from "@/lib/useReveal";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  useReveal(ref);
  return (
    <section className="hero" id="top" ref={ref}>
      <p className="eyebrow" data-reveal>{t.hero.eyebrow}</p>
      <h1 data-reveal dangerouslySetInnerHTML={{ __html: t.hero.title }} />
      <p className="sub" data-reveal>{t.hero.sub}</p>
      <a
        className="btn-wa"
        data-reveal
        href={waHref(t)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackContact}
      >
        {t.hero.cta} →
      </a>
      <p className="scroll-hint">{t.hero.scroll}</p>
    </section>
  );
}
```

- [ ] **Step 4: Replace `app/page.tsx`**

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Page() {
  return (
    <>
      <div className="bg-glow" aria-hidden />
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 5: Interactive verification (Playwright MCP)**

```bash
npm run dev   # background
```
1. Navigate to `http://localhost:3000`, screenshot. Expected: dark page, white ODOS logo top-left (see Step 2 note — swap to orange logo if the white PNG is invisible/wrong), orange-accented headline in Indonesian, orange WhatsApp pill button, subtle center glow.
2. Click the `EN` toggle → headline switches to English, button label "Chat on WhatsApp", toggle now reads `ID`. Reload → stays English (localStorage).
3. Assert CTA `href` equals `https://wa.me/6282314393503?text=...` with encoded English text while in EN mode.

- [ ] **Step 6: Pixel smoke check**

Restart dev server with a test ID: `NEXT_PUBLIC_META_PIXEL_ID=TEST123 npm run dev`.
In the browser, evaluate `typeof window.fbq` → `"function"`. Click the hero CTA (it opens WhatsApp in a new tab; the click still registers) and evaluate that the fbq queue/calls include `["track","Contact"]`. Stop, restart dev server without the env var, confirm `window.fbq` is `undefined`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: header, hero with WhatsApp CTA and language toggle

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Services + About sections

**Files:**
- Create: `components/Services.tsx`, `components/About.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useLang`, `useReveal`, `lib/gsap` (counters)

- [ ] **Step 1: Write `components/Services.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useLang } from "@/components/LanguageProvider";
import { useReveal } from "@/lib/useReveal";

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  useReveal(ref);
  return (
    <section className="section" id="layanan" ref={ref}>
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="pill">{t.services.label}</span>
          <h2>{t.services.title}</h2>
        </div>
        {t.services.items.map((item, i) => (
          <div className="service-row" data-reveal key={item.t}>
            <span className="idx">0{i + 1}</span>
            <h3>{item.t}</h3>
            <p>{item.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write `components/About.tsx`** (counters animate once on entry)

```tsx
"use client";

import { useRef } from "react";
import { useLang } from "@/components/LanguageProvider";
import { useReveal } from "@/lib/useReveal";
import { gsap, useGSAP } from "@/lib/gsap";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  useReveal(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          gsap.fromTo(
            el,
            { innerText: 0 },
            {
              innerText: target,
              duration: 1.6,
              ease: "power2.out",
              snap: { innerText: 1 },
              scrollTrigger: { trigger: el, start: "top 85%" },
            }
          );
        });
      });
    },
    { scope: ref, dependencies: [t] }
  );

  return (
    <section className="section" id="tentang" ref={ref}>
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="pill">{t.about.label}</span>
          <h2>{t.about.title}</h2>
        </div>
        <div className="about-grid">
          <p className="body" data-reveal>{t.about.body}</p>
          <div className="counters" data-reveal>
            {t.about.counters.map((c) => (
              <div className="counter" key={c.l}>
                <div className="num">
                  <span data-count={c.n}>{c.n}</span>
                  {c.suffix}
                </div>
                <div className="lbl">{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add both to `app/page.tsx`** inside `<main>` after `<Hero />`:

```tsx
import Services from "@/components/Services";
import About from "@/components/About";
// ...
      <main>
        <Hero />
        <Services />
        <About />
      </main>
```

- [ ] **Step 4: Verify (Playwright MCP)**

Dev server running → scroll to Services: rows fade up, hover a row (desktop): row shifts right, title turns orange. Scroll to About: counters count up to 50 / 30 / 5. Toggle EN → all copy switches. Screenshot both sections.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: services and about sections with animated counters

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Work section — pinned horizontal gallery + client logo strip

**Files:**
- Create: `components/Work.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useLang`, `useReveal`, `lib/gsap`

- [ ] **Step 1: Write `components/Work.tsx`**

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { useReveal } from "@/lib/useReveal";
import { gsap, useGSAP } from "@/lib/gsap";

const PIECES = [
  { src: "/work/rubbix.png", title: "Rubbix", tag: "Branding" },
  { src: "/work/rubbix-beans.png", title: "Rubbix Beans", tag: "Packaging" },
  { src: "/work/rubbix-coffee.png", title: "Rubbix Coffee", tag: "Packaging" },
  { src: "/work/shiawase-website.png", title: "Shiawase", tag: "Web Design" },
  { src: "/work/shiawase-2.png", title: "Shiawase", tag: "Social Media" },
  { src: "/work/spill-photography.png", title: "Spill Photography", tag: "Branding" },
] as const;

const CLIENT_LOGOS = [1, 2, 3, 4, 5, 6, 8, 9, 10] as const;

export default function Work() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  useReveal(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const getX = () => -(track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: getX,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "center center",
            end: () => `+=${-getX()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section className="section work-section" id="karya" ref={ref}>
      <div className="container section-head" data-reveal>
        <span className="pill">{t.work.label}</span>
        <h2>{t.work.title}</h2>
      </div>
      <div className="work-track" ref={trackRef}>
        {PIECES.map((p, i) => (
          <figure className="work-card" key={p.src}>
            <Image
              src={p.src}
              alt={`${p.title} — ${p.tag}`}
              fill
              sizes="(max-width: 767px) 78vw, 460px"
              loading={i < 2 ? "eager" : "lazy"}
              style={{ objectFit: "cover" }}
            />
            <figcaption className="meta">
              <strong>{p.title}</strong>
              <span>{p.tag}</span>
            </figcaption>
          </figure>
        ))}
        <figure className="work-card">
          <video src="/work/rizz-burger.mp4" muted loop playsInline autoPlay preload="metadata" />
          <figcaption className="meta">
            <strong>Rizz Burger</strong>
            <span>Video</span>
          </figcaption>
        </figure>
      </div>
      <div className="container client-strip" data-reveal>
        <p className="label">{t.work.logos}</p>
        <div className="client-grid">
          {CLIENT_LOGOS.map((n) => (
            <div className="tile" key={n}>
              <Image src={`/clients/${n}.png`} alt={`Client logo ${n}`} width={160} height={120} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Note on `fill`: `.work-card` is `position: relative` in CSS, so `next/image` `fill` is valid.

- [ ] **Step 2: Add to `app/page.tsx`** between `<Services />` and `<About />`:

```tsx
import Work from "@/components/Work";
// ...
        <Services />
        <Work />
        <About />
```

- [ ] **Step 3: Verify (Playwright MCP)**

Desktop 1440×900: scroll into Work → section pins, cards slide horizontally with scroll, last card (Rizz Burger) is a playing muted video, unpins and continues to client logo grid (9 white tiles with colored client logos). Mobile 390×844: same behavior with 78vw cards, no horizontal page overflow outside the pinned phase. Screenshot both.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: pinned horizontal work gallery and client logo strip

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: CTA finale + footer + gradient flood

**Files:**
- Create: `components/CtaFinale.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useLang`, `waHref`, `trackContact`, `lib/gsap`
- Produces: renders the fixed `.cta-flood` div (consumed visually; sits at `z-index: 2`, below `main`)

- [ ] **Step 1: Write `components/CtaFinale.tsx`**

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { waHref, WA_NUMBER } from "@/lib/i18n";
import { trackContact } from "@/lib/pixel";
import { gsap, useGSAP } from "@/lib/gsap";

export default function CtaFinale() {
  const ref = useRef<HTMLElement>(null);
  const floodRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(floodRef.current, {
          opacity: 0.96,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            end: "top 5%",
            scrub: true,
          },
        });
        gsap.from(".cta h2, .cta .sub, .cta .btn-wa", {
          y: 50,
          opacity: 0,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 60%" },
        });
      });
      // Reduced motion: flood visible statically so the section stays branded.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(floodRef.current, { opacity: 0.96 });
      });
    },
    { scope: ref }
  );

  return (
    <>
      <div className="cta-flood" ref={floodRef} aria-hidden />
      <section className="cta flooded" id="kontak" ref={ref}>
        <h2>{t.cta.title}</h2>
        <p className="sub">{t.cta.sub}</p>
        <a
          className="btn-wa inverted"
          href={waHref(t)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackContact}
        >
          {t.cta.button} →
        </a>
        <footer className="site-footer">
          <a href="#top" className="logo" aria-label="ODOS Creative">
            <Image src="/brand/logo-white.png" alt="ODOS" width={96} height={24} />
          </a>
          <div className="contacts">
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" onClick={trackContact}>
              +62 823 1439 3503
            </a>
            <a href="mailto:Odoscdc@gmail.com">Odoscdc@gmail.com</a>
            <a href="https://instagram.com/Odos_Creative" target="_blank" rel="noopener noreferrer">
              @Odos_Creative
            </a>
          </div>
          <span>{t.footer.tagline}</span>
        </footer>
      </section>
    </>
  );
}
```

Layering note: `.cta-flood` is `position: fixed` at `z-index: 2`; `main` content is `z-index: 3`, so the flood tints the background (and covers the orb) while text stays readable. It fades in only while the CTA section scrolls into view.

- [ ] **Step 2: Add to `app/page.tsx`** after `<About />`:

```tsx
import CtaFinale from "@/components/CtaFinale";
// ...
        <About />
        <CtaFinale />
```

- [ ] **Step 3: Verify (Playwright MCP)**

Scroll to bottom: background floods to the orange gradient as CTA enters; white "Contact us now" button on gradient; footer shows phone, email, Instagram, tagline. Both WhatsApp links (`btn-wa` and footer phone) have `wa.me/6282314393503` hrefs. Toggle language and re-check CTA copy. Screenshot.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: CTA finale with gradient flood and footer

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Molten orb — WebGL scene

**Files:**
- Create: `components/Scene.tsx`, `components/MoltenOrb.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `scrollState` from `lib/scrollState`
- Produces: `<Scene />` — self-contained; mounts nothing when WebGL unavailable or reduced motion preferred.

- [ ] **Step 1: Write `components/MoltenOrb.tsx`** (shader mesh; complete GLSL)

```tsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

// Keyframes across the page: hero → services → work → about → cta
const KEYS = {
  x: [0, 1.1, 0, -1.1, 0],
  y: [0, -0.15, 0.1, 0, 0],
  scale: [1, 0.9, 0.72, 0.9, 1.55],
  amp: [0.28, 0.38, 0.52, 0.32, 0.8],
};

function sample(arr: readonly number[], t: number): number {
  const seg = (arr.length - 1) * Math.min(Math.max(t, 0), 1);
  const i = Math.min(Math.floor(seg), arr.length - 2);
  return arr[i] + (arr[i + 1] - arr[i]) * (seg - i);
}

const vertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform vec2 uMouse;
varying vec3 vNormal;
varying float vNoise;

// Simplex 3D noise (Ashima Arts / Stefan Gustavson, MIT)
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  float t = uTime * 0.25;
  float n = snoise(normal * 1.8 + vec3(t)) * 0.6
          + snoise(normal * 4.2 - vec3(t * 1.5)) * 0.25;
  vec3 mdir = normalize(vec3(uMouse * 1.2, 1.0));
  float bulge = pow(max(dot(normalize(position), mdir), 0.0), 3.0) * 0.35 * length(uMouse);
  vec3 p = position + normal * (n * uAmp + bulge);
  vNoise = n;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragment = /* glsl */ `
uniform float uScroll;
varying vec3 vNormal;
varying float vNoise;

void main() {
  float fres = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
  vec3 deep   = vec3(0.10, 0.03, 0.01);
  vec3 orange = vec3(0.988, 0.384, 0.125); /* #FC6220 */
  vec3 hot    = vec3(1.0, 0.667, 0.188);   /* #FFAA30 */
  vec3 col = mix(deep, orange, clamp(fres * 1.25 + vNoise * 0.35 + uScroll * 0.15, 0.0, 1.0));
  col = mix(col, hot, pow(fres, 3.0) * (0.45 + uScroll * 0.55));
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function MoltenOrb({ detail }: { detail: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const smooth = useRef({ x: 0, y: 0, progress: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: KEYS.amp[0] },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    const s = smooth.current;
    // low-pass filter so motion feels liquid, not twitchy
    s.x += (scrollState.mouse.x - s.x) * 0.05;
    s.y += (scrollState.mouse.y - s.y) * 0.05;
    s.progress += (scrollState.progress - s.progress) * 0.08;

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = s.progress;
    uniforms.uAmp.value = sample(KEYS.amp, s.progress);
    uniforms.uMouse.value.set(s.x, s.y);

    const m = mesh.current;
    m.position.x = sample(KEYS.x, s.progress);
    m.position.y = sample(KEYS.y, s.progress);
    const sc = sample(KEYS.scale, s.progress);
    m.scale.setScalar(sc);
    m.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, detail]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}
```

- [ ] **Step 2: Write `components/Scene.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import MoltenOrb from "@/components/MoltenOrb";
import { scrollState } from "@/lib/scrollState";

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Scene() {
  const [detail, setDetail] = useState<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !webglAvailable()) return; // CSS .bg-glow stays as the fallback
    setDetail(window.innerWidth < 768 ? 32 : 64);

    const onMove = (e: PointerEvent) => {
      scrollState.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (detail === null) return null;

  return (
    <div className="webgl-scene" aria-hidden>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <MoltenOrb detail={detail} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Add to `app/page.tsx`** right after `.bg-glow`:

```tsx
import Scene from "@/components/Scene";
// ...
      <div className="bg-glow" aria-hidden />
      <Scene />
      <Header />
```

- [ ] **Step 4: Verify (Playwright MCP)**

1. Desktop: hero shows a glowing molten orange orb, organic surface movement. Move mouse across viewport → surface bulges toward cursor. Scroll: orb drifts right at Services, shrinks at Work, drifts left at About, swells hot at CTA (before flood covers it). Watch console: no WebGL errors.
2. Mobile 390×844: orb renders (lower detail), page scrolls smoothly, no jank in screenshot sequence.
3. `npm run build` passes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: molten orange shader orb driven by scroll and cursor

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Polish + full verification + README

**Files:**
- Create: `README.md`
- Modify: whatever the verification rounds surface

- [ ] **Step 1: Full visual pass, round 1 (Playwright MCP)**

Desktop 1440×900 and mobile 390×844, full page scroll with screenshots at each section. Check against spec: colors exact, hairlines present, pill labels, heading weights/tracking, hover/focus/active on every link and button (tab through with keyboard, screenshot focus rings), no horizontal overflow, orb behavior per section. Fix all mismatches found.

- [ ] **Step 2: Full visual pass, round 2**

Repeat Step 1 after fixes. Both rounds are mandatory (≥2 per spec). Stop only when no visible differences remain against the spec's description.

- [ ] **Step 3: Functional smoke checklist**

- Language toggle: ID ⇄ EN swaps every visible string; persists across reload.
- All 3 WhatsApp links point to `wa.me/6282314393503` with localized prefilled text (hero + CTA) or bare number (footer phone).
- With `NEXT_PUBLIC_META_PIXEL_ID=TEST123`: `window.fbq` defined, `PageView` fired on load, `Contact` fired on CTA click. Without it: no fbq, no network calls to facebook.
- View-source: H1, section copy present as real HTML text (SEO).
- `<title>` and OG image `/brand/banner.png` present in head.

- [ ] **Step 4: Write `README.md`**

```markdown
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
```

- [ ] **Step 5: Final build + commit**

```bash
npm run build
git add -A
git commit -m "chore: polish pass, README, deploy notes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** concept/orb (T7), brand system (T1), 5 sections (T3–T6), bilingual (T2/T3), pixel + WhatsApp (T2/T3/T6), performance/a11y (constraints + T7 detection + T8 audit), error handling (T7 feature-detect, T2 pixel guard), testing (T3/T5/T7 verifications + T8 two rounds). OG image (T1 layout metadata). Counters values match spec (50+/30+/5).
- **Known judgment calls:** `IMG_7278.JPG` (11 MB photo) and `Untitled design.png` excluded; `Logo Web/7.png` doesn't exist; Rizz Burger included as 5.2 MB muted loop video. White-logo legibility check is explicit in T3 Step 5 with orange fallback.
- **Type consistency:** `Dict` derived from `dict.id` via `(typeof dict)[Lang]` with `as const` — note `waHref(t)` accepts the active-language `Dict`. About counter label is `c.l` (correction noted inline in T4 Step 2).
