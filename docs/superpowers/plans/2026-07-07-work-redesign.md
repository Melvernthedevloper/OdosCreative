# Selected Works Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the Work section: data-driven projects (`lib/projects.ts`), big 16:9 ads/consulting case-study cards + the existing branding reel, a tap-to-open `<dialog>` overlay with multi-image galleries and fullscreen zoom, and a CSS-only client-logo marquee on light chips.

**Architecture:** One-page static Next.js site (App Router). All project content lives in one TS data file; the Work section renders featured cards + a pinned horizontal strip from it; a single `ProjectOverlay` component (native `<dialog>`) handles detail view + zoom; the logo grid becomes a pure-CSS marquee. Spec: `docs/superpowers/specs/2026-07-07-work-redesign-design.md`.

**Tech Stack:** Next.js 16 (Turbopack), React 19, GSAP + ScrollTrigger (`lib/gsap.ts`), Lenis smooth scroll, `next/image`. No test framework — verification is `npm run build` + Playwright MCP against `npm run dev`.

## Global Constraints

- **No new npm dependencies.**
- Overlay gallery images must lazy-load (only fetched when overlay opens).
- Marquee must be pure CSS animation (no per-frame JS); pauses on hover; static wrapped row under `prefers-reduced-motion: reduce`.
- All user-visible copy bilingual (ID + EN) via `lib/i18n.ts`; ID is the default language.
- Design tokens (from `app/globals.css:1-9`): `--bg: #0a0908`, `--orange: #fc6220`, `--dim: rgba(255,255,255,0.6)`, `--hairline: rgba(255,255,255,0.12)`.
- Global button reset already exists (`app/globals.css`: `button { font: inherit; background: none; border: none; cursor: pointer; color: inherit; }`) — cards can be `<button>`s without fighting defaults.
- `useLang()` (from `components/LanguageProvider.tsx`) returns `{ lang: "id" | "en", t: Dict, toggle }`.
- Commit after every task; end commit messages with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Work from the worktree root (`.claude/worktrees/work-redesign`); dev server: `npm run dev` → http://localhost:3000.

## File Structure

- `public/work/<slug>/…` — per-project image folders (moved from flat `public/work/`)
- `lib/projects.ts` — **create**: Project type + all project entries (single editable content file)
- `lib/i18n.ts` — **modify**: new `work.*` strings both languages
- `lib/pixel.ts` — **modify**: add `trackViewContent`
- `lib/scrollState.ts` — **modify**: add `lenisRef`
- `components/SmoothScroll.tsx` — **modify**: publish Lenis instance to `lenisRef`
- `components/ProjectOverlay.tsx` — **create**: dialog overlay + zoom layer
- `components/ClientMarquee.tsx` — **create**: logo marquee (moves `CLIENT_LOGOS` out of Work.tsx)
- `components/Work.tsx` — **rewrite**: featured cards + strip driven by `PROJECTS`, opens overlay
- `app/globals.css` — **modify**: featured card, overlay, zoom, marquee styles; delete `.client-grid`/`.tile` styles
- `README.md` — **modify**: slide-export size note

---

### Task 1: Asset reorg + placeholder case-study slides

**Files:**
- Move (git mv): everything in `public/work/` into per-slug subfolders
- Create: `public/work/meta-ads-fnb/slide-1.png`, `slide-2.png`, `public/work/digital-consulting-retail/slide-1.png`, `slide-2.png` (1920×1080 screenshots)

**Interfaces:**
- Produces: the exact asset paths Task 2's `lib/projects.ts` references (listed in Step 1/2 below).

- [ ] **Step 1: Move existing assets into per-slug folders**

```bash
cd public/work
mkdir rubbix shiawase spill-photography rizz-burger meta-ads-fnb digital-consulting-retail
git mv rubbix.png rubbix-beans.png rubbix-coffee.png rubbix/
git mv shiawase-website.png shiawase-2.png shiawase/
git mv spill-photography.png spill-photography/
git mv rizz-burger.mp4 rizz-burger/
cd ../..
```

Expected final layout: `rubbix/{rubbix,rubbix-beans,rubbix-coffee}.png`, `shiawase/{shiawase-website,shiawase-2}.png`, `spill-photography/spill-photography.png`, `rizz-burger/rizz-burger.mp4`.

- [ ] **Step 2: Write the placeholder slide template**

Write `/tmp/odos-placeholder.html`:

```html
<!doctype html><meta charset="utf-8">
<style>
  body { margin:0; width:1920px; height:1080px; display:flex; flex-direction:column; justify-content:center;
    padding:120px; box-sizing:border-box; font-family: Arial, Helvetica, sans-serif; color:#fff;
    background: radial-gradient(1200px 800px at 20% 10%, #2a1608, #0a0908); position:relative; }
  .pill { color:#fc6220; font-size:28px; letter-spacing:.18em; text-transform:uppercase; font-weight:700; margin-bottom:32px; }
  h1 { font-size:96px; margin:0 0 24px; letter-spacing:-.02em; }
  p { font-size:36px; color:rgba(255,255,255,.6); max-width:1100px; line-height:1.5; }
  .tag { position:absolute; bottom:60px; left:120px; font-size:24px; color:rgba(255,255,255,.35);
    letter-spacing:.12em; text-transform:uppercase; }
</style>
<body>
  <div class="pill" id="pill"></div><h1 id="title"></h1><p id="sub"></p>
  <div class="tag">PLACEHOLDER — replace with real 1920×1080 case-study slide</div>
  <script>
    const [pill, title, sub] = decodeURIComponent(location.hash.slice(1)).split("|");
    document.getElementById("pill").textContent = pill;
    document.getElementById("title").textContent = title;
    document.getElementById("sub").textContent = sub;
  </script>
</body>
```

- [ ] **Step 3: Screenshot the four slides with Playwright MCP**

For each row below: `browser_resize` to 1920×1080 → `browser_navigate` to the URL → `browser_take_screenshot` (full page off, viewport only, `type: "png"`, use the `filename` shown) → `cp` the file from the path the tool reports to the destination.

| URL hash (append to `file:///tmp/odos-placeholder.html#`) | Destination |
|---|---|
| `Performance Ads\|Meta Ads — F%26B Brand\|Campaign results go here: reach, CTR, ROAS, cost per result.` | `public/work/meta-ads-fnb/slide-1.png` |
| `Performance Ads\|Meta Ads — F%26B Brand\|Slide 2: creatives, audience breakdown, learnings.` | `public/work/meta-ads-fnb/slide-2.png` |
| `Digital Consulting\|Digital Consulting — Retail\|Engagement summary: problem, roadmap, before/after.` | `public/work/digital-consulting-retail/slide-1.png` |
| `Digital Consulting\|Digital Consulting — Retail\|Slide 2: funnel, channels, measurable outcomes.` | `public/work/digital-consulting-retail/slide-2.png` |

(URL-encode the hash; `|` separates pill/title/sub. Spaces are fine unencoded in a hash.)

- [ ] **Step 4: Verify the slides**

```bash
for f in public/work/meta-ads-fnb/*.png public/work/digital-consulting-retail/*.png; do sips -g pixelWidth -g pixelHeight "$f" | tr '\n' ' '; echo; done
ls -la public/work/meta-ads-fnb public/work/digital-consulting-retail
```

Expected: four files, each 1920×1080, each well under 500 KB. Also visually inspect one with the Read tool: orange pill, big title, PLACEHOLDER tag visible.

- [ ] **Step 5: Commit**

```bash
git add -A public/work
git commit -m "feat: per-project asset folders and placeholder case-study slides

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Data + plumbing — `lib/projects.ts`, i18n, pixel, lenisRef

**Files:**
- Create: `lib/projects.ts`
- Modify: `lib/i18n.ts` (both `work:` lines — currently lines 25 and 63)
- Modify: `lib/pixel.ts` (append)
- Modify: `lib/scrollState.ts` (append), `components/SmoothScroll.tsx` (2 lines)

**Interfaces:**
- Produces: `PROJECTS: Project[]`, `type Project = { slug; title; category: Category; featured?; cover?; images: GalleryImage[]; video?; description? }`, `type GalleryImage = { src: string; w: number; h: number }`, `type Category = "ads" | "consulting" | "branding" | "video"`; `trackViewContent(name: string): void`; `lenisRef: { current: Lenis | null }`; i18n keys `t.work.{label,title,featured,strip,logos,close,zoom,categories[Category]}`.

- [ ] **Step 1: Write `lib/projects.ts`**

```ts
// One entry per project. To add one: drop images in public/work/<slug>/,
// add an entry here with each image's pixel size (w/h), redeploy.
export type Category = "ads" | "consulting" | "branding" | "video";

export type GalleryImage = { src: string; w: number; h: number };

export type Project = {
  slug: string;
  title: string;
  category: Category;
  featured?: boolean; // true → big 16:9 case-study card at the top of Work
  cover?: string; // card image; omit for video projects (card plays the video)
  images: GalleryImage[]; // overlay gallery, in order
  video?: string;
  description?: { id: string; en: string }; // shown only inside the overlay
};

export const PROJECTS: Project[] = [
  {
    slug: "meta-ads-fnb",
    title: "Meta Ads — F&B Brand",
    category: "ads",
    featured: true,
    cover: "/work/meta-ads-fnb/slide-1.png",
    images: [
      { src: "/work/meta-ads-fnb/slide-1.png", w: 1920, h: 1080 },
      { src: "/work/meta-ads-fnb/slide-2.png", w: 1920, h: 1080 },
    ],
    description: {
      id: "Studi kasus performance ads. Slide ini placeholder — ganti dengan hasil kampanye asli.",
      en: "Performance ads case study. These slides are placeholders — swap in real campaign results.",
    },
  },
  {
    slug: "digital-consulting-retail",
    title: "Digital Consulting — Retail",
    category: "consulting",
    featured: true,
    cover: "/work/digital-consulting-retail/slide-1.png",
    images: [
      { src: "/work/digital-consulting-retail/slide-1.png", w: 1920, h: 1080 },
      { src: "/work/digital-consulting-retail/slide-2.png", w: 1920, h: 1080 },
    ],
    description: {
      id: "Studi kasus konsultasi digital. Slide ini placeholder — ganti dengan hasil engagement asli.",
      en: "Digital consulting case study. These slides are placeholders — swap in real engagement results.",
    },
  },
  {
    slug: "rubbix",
    title: "Rubbix",
    category: "branding",
    cover: "/work/rubbix/rubbix.png",
    images: [
      { src: "/work/rubbix/rubbix.png", w: 1080, h: 1440 },
      { src: "/work/rubbix/rubbix-beans.png", w: 1080, h: 1440 },
      { src: "/work/rubbix/rubbix-coffee.png", w: 1080, h: 1440 },
    ],
    description: {
      id: "Identitas brand dan desain kemasan untuk Rubbix Coffee.",
      en: "Brand identity and packaging design for Rubbix Coffee.",
    },
  },
  {
    slug: "shiawase",
    title: "Shiawase",
    category: "branding",
    cover: "/work/shiawase/shiawase-website.png",
    images: [
      { src: "/work/shiawase/shiawase-website.png", w: 1080, h: 1440 },
      { src: "/work/shiawase/shiawase-2.png", w: 1080, h: 1440 },
    ],
    description: {
      id: "Desain web dan konten sosial media untuk Shiawase.",
      en: "Web design and social media content for Shiawase.",
    },
  },
  {
    slug: "spill-photography",
    title: "Spill Photography",
    category: "branding",
    cover: "/work/spill-photography/spill-photography.png",
    images: [{ src: "/work/spill-photography/spill-photography.png", w: 1080, h: 1350 }],
  },
  {
    slug: "rizz-burger",
    title: "Rizz Burger",
    category: "video",
    images: [],
    video: "/work/rizz-burger/rizz-burger.mp4",
  },
];
```

- [ ] **Step 2: Update `lib/i18n.ts` work strings**

Replace line 25 (ID dict):

```ts
    work: {
      label: "Karya",
      title: "Karya pilihan",
      featured: "Studi kasus",
      strip: "Branding & konten",
      logos: "Brand yang kami bentuk",
      close: "Tutup",
      zoom: "Perbesar gambar",
      categories: { ads: "Performance Ads", consulting: "Konsultasi Digital", branding: "Branding", video: "Video" },
    },
```

Replace line 63 (EN dict):

```ts
    work: {
      label: "Work",
      title: "Selected work",
      featured: "Case studies",
      strip: "Branding & content",
      logos: "Brands we've shaped",
      close: "Close",
      zoom: "Zoom image",
      categories: { ads: "Performance Ads", consulting: "Digital Consulting", branding: "Branding", video: "Video" },
    },
```

(The `Dict` type is derived from `dict.id`, so the EN shape must match exactly.)

- [ ] **Step 3: Append to `lib/pixel.ts`**

```ts
export function trackViewContent(name: string): void {
  if (!PIXEL_ID) return;
  window.fbq?.("track", "ViewContent", { content_name: name });
}
```

- [ ] **Step 4: Expose Lenis via `lib/scrollState.ts`**

Append to `lib/scrollState.ts`:

```ts
// Set by SmoothScroll; the project overlay stops/starts it while open.
// null when reduced-motion (no Lenis) — callers must optional-chain.
import type Lenis from "lenis";
export const lenisRef: { current: Lenis | null } = { current: null };
```

(Type-only import — erased at build, no runtime cost. Move the import to the top of the file.)

In `components/SmoothScroll.tsx`: import `lenisRef` from `@/lib/scrollState`; after `const lenis = new Lenis();` add `lenisRef.current = lenis;`; in the cleanup function add `lenisRef.current = null;` before `lenis.destroy()`.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: compiles, TypeScript passes. (Work.tsx still uses its own PIECES/old i18n keys? No — it uses `t.work.label/title/logos`, all still present. Build must be green.)

- [ ] **Step 6: Commit**

```bash
git add lib/projects.ts lib/i18n.ts lib/pixel.ts lib/scrollState.ts components/SmoothScroll.tsx
git commit -m "feat: project data model, work i18n, ViewContent pixel, lenis handle

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: ProjectOverlay component + overlay/zoom CSS

**Files:**
- Create: `components/ProjectOverlay.tsx`
- Modify: `app/globals.css` (append overlay styles after the `/* work */` block)

**Interfaces:**
- Consumes: `Project`, `lenisRef`, `trackViewContent`, `useLang` (Task 2).
- Produces: `<ProjectOverlay project={Project | null} onClose={() => void} />` — renders nothing when `project` is null; parent clears its state in `onClose`.

- [ ] **Step 1: Write `components/ProjectOverlay.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryImage, Project } from "@/lib/projects";
import { useLang } from "@/components/LanguageProvider";
import { lenisRef } from "@/lib/scrollState";
import { trackViewContent } from "@/lib/pixel";

export default function ProjectOverlay({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState<GalleryImage | null>(null);
  const [zoomedIn, setZoomedIn] = useState(false);
  const { lang, t } = useLang();

  useEffect(() => {
    const dialog = ref.current;
    if (!project || !dialog) return;
    dialog.showModal();
    dialog.scrollTop = 0;
    lenisRef.current?.stop();
    // Back button (mobile) closes the overlay instead of leaving the site.
    history.pushState({ overlay: project.slug }, "");
    trackViewContent(project.slug);
    const onPop = () => dialog.close();
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      lenisRef.current?.start();
      if (dialog.open) dialog.close();
    };
  }, [project]);

  // Every UI close goes through history.back() so the pushed entry is
  // consumed; the popstate handler does the actual dialog.close().
  const requestClose = () => history.back();

  if (!project) return null;

  return (
    <dialog
      ref={ref}
      className="project-overlay"
      aria-label={project.title}
      onClose={() => {
        setZoom(null);
        setZoomedIn(false);
        onClose();
      }}
      onCancel={(e) => {
        e.preventDefault(); // Esc: close zoom first, dialog second
        if (zoom) {
          setZoom(null);
          setZoomedIn(false);
        } else {
          requestClose();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose(); // backdrop click
      }}
    >
      <div className="overlay-inner">
        <button className="overlay-close" onClick={requestClose} aria-label={t.work.close}>
          ×
        </button>
        <header className="overlay-head">
          <span className="pill">{t.work.categories[project.category]}</span>
          <h3>{project.title}</h3>
          {project.description && <p>{project.description[lang]}</p>}
        </header>
        <div className="overlay-gallery">
          {project.video && <video src={project.video} muted loop playsInline controls preload="metadata" />}
          {project.images.map((img) => (
            <button className="gallery-item" key={img.src} onClick={() => setZoom(img)} aria-label={t.work.zoom}>
              <Image src={img.src} alt={project.title} width={img.w} height={img.h} sizes="(max-width: 960px) 92vw, 880px" />
            </button>
          ))}
        </div>
      </div>
      {zoom && (
        <div className="zoom-layer">
          <button
            className="overlay-close"
            onClick={() => {
              setZoom(null);
              setZoomedIn(false);
            }}
            aria-label={t.work.close}
          >
            ×
          </button>
          <div className={`zoom-scroll${zoomedIn ? " zoomed" : ""}`} onClick={() => setZoomedIn((v) => !v)}>
            {/* separate <Image> so the high-res variant is only fetched on zoom */}
            <Image src={zoom.src} alt={project.title} width={zoom.w} height={zoom.h} sizes={zoomedIn ? "250vw" : "100vw"} />
          </div>
        </div>
      )}
    </dialog>
  );
}
```

- [ ] **Step 2: Append overlay CSS to `app/globals.css`** (after the client-strip block, before `/* about */`)

```css
/* project overlay */
html:has(dialog.project-overlay[open]) { overflow: hidden; } /* native scroll lock (reduced-motion has no Lenis) */
dialog.project-overlay {
  border: 0; padding: 0; margin: 0; width: 100vw; height: 100dvh;
  max-width: 100vw; max-height: 100dvh;
  background: rgba(10, 9, 8, 0.9); color: var(--white); overflow-y: auto;
}
dialog.project-overlay::backdrop { background: rgba(10, 9, 8, 0.7); backdrop-filter: blur(6px); }
.overlay-inner { max-width: 960px; margin: 0 auto; padding: 84px 24px 96px; }
.overlay-close {
  position: fixed; top: 18px; right: 18px; z-index: 6;
  width: 48px; height: 48px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.08); border: 1px solid var(--hairline);
  font-size: 26px; line-height: 1; display: flex; align-items: center; justify-content: center;
}
.overlay-close:hover { background: rgba(255, 255, 255, 0.16); }
.overlay-head { margin-bottom: 36px; }
.overlay-head h3 { font-size: clamp(28px, 5vw, 44px); font-weight: 800; letter-spacing: -0.02em; margin: 14px 0 10px; }
.overlay-head p { color: var(--dim); max-width: 640px; }
.overlay-gallery { display: grid; gap: 20px; }
.overlay-gallery video { width: 100%; border-radius: 14px; }
.gallery-item { display: block; width: 100%; padding: 0; border-radius: 14px; overflow: hidden; cursor: zoom-in; }
.gallery-item img { width: 100%; height: auto; display: block; }

/* fullscreen zoom inside the overlay */
.zoom-layer { position: fixed; inset: 0; z-index: 5; background: rgba(10, 9, 8, 0.98); }
.zoom-scroll { height: 100%; overflow: auto; display: grid; place-items: center; cursor: zoom-in; }
.zoom-scroll img { width: 100%; height: auto; }
.zoom-scroll.zoomed { cursor: zoom-out; }
/* ponytail: tap-toggle 250% + native scroll panning; add pinch gestures only if users ask */
.zoom-scroll.zoomed img { width: 250%; max-width: none; }
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: green. (Component isn't mounted anywhere yet — that's Task 4.)

- [ ] **Step 4: Commit**

```bash
git add components/ProjectOverlay.tsx app/globals.css
git commit -m "feat: project detail overlay with gallery and fullscreen zoom

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Rewrite Work section — featured cards + strip, wired to overlay

**Files:**
- Rewrite: `components/Work.tsx`
- Modify: `app/globals.css` (featured card styles; make `.work-card` button-friendly)

**Interfaces:**
- Consumes: `PROJECTS`, `Project` (Task 2), `ProjectOverlay` (Task 3), existing `useReveal`, `gsap`/`useGSAP`.
- Produces: `<Work />` unchanged externally (already in `app/page.tsx`); client marquee is *removed* from Work here and re-added by Task 5 — the logo strip is intentionally absent between Task 4 and Task 5.

- [ ] **Step 1: Rewrite `components/Work.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { useReveal } from "@/lib/useReveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { PROJECTS, type Project } from "@/lib/projects";
import ProjectOverlay from "@/components/ProjectOverlay";

const FEATURED = PROJECTS.filter((p) => p.featured);
const STRIP = PROJECTS.filter((p) => !p.featured);

export default function Work() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const [motionOk, setMotionOk] = useState(true);
  const [open, setOpen] = useState<Project | null>(null);
  useReveal(ref);

  useEffect(() => {
    setMotionOk(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const getX = () => Math.min(0, -(track.scrollWidth - window.innerWidth));
        gsap.to(track, {
          x: getX,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "center center",
            end: () => `+=${-getX() || 1}`,
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

      <div className="container" data-reveal>
        <p className="label">{t.work.featured}</p>
        <div className="featured-list">
          {FEATURED.map((p) => (
            <button className="featured-card" key={p.slug} onClick={() => setOpen(p)}>
              <Image
                src={p.cover!}
                alt={`${p.title} — ${t.work.categories[p.category]}`}
                fill
                sizes="(max-width: 1024px) 92vw, 912px"
                style={{ objectFit: "cover" }}
              />
              <span className="meta">
                <strong>{p.title}</strong>
                <span>{t.work.categories[p.category]}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="container" data-reveal>
        <p className="label">{t.work.strip}</p>
      </div>
      <div className="work-track" ref={trackRef}>
        {STRIP.map((p) => (
          <button className="work-card" key={p.slug} onClick={() => setOpen(p)}>
            {p.video ? (
              <video src={p.video} muted loop playsInline autoPlay={motionOk} preload="metadata" />
            ) : (
              /* ponytail: cards are mid-page in a pinned section, not above the fold — plain lazy is fine for LCP */
              <Image
                src={p.cover!}
                alt={`${p.title} — ${t.work.categories[p.category]}`}
                fill
                sizes="(max-width: 767px) 78vw, 460px"
                style={{ objectFit: "cover" }}
              />
            )}
            <span className="meta">
              <strong>{p.title}</strong>
              <span>{t.work.categories[p.category]}</span>
            </span>
          </button>
        ))}
      </div>

      <ProjectOverlay project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
```

Note: the `CLIENT_LOGOS` array and the `client-strip` JSX are deliberately dropped here; Task 5 recreates them as `ClientMarquee`.

- [ ] **Step 2: Add featured-card CSS and adapt `.work-card`**

In `app/globals.css`, inside the `/* work */` block: add after `.work-section { … }`:

```css
.work-section .label { color: var(--dim); font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 24px; }
.featured-list { display: grid; gap: 28px; margin-bottom: 72px; }
.featured-card {
  position: relative; width: 100%; aspect-ratio: 16 / 9;
  border-radius: 18px; overflow: hidden; text-align: left;
  border: 1px solid var(--hairline); background: #141210;
}
.featured-card img { transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.featured-card:hover img { transform: scale(1.04); }
.featured-card .meta {
  position: absolute; left: 0; right: 0; bottom: 0; padding: 44px 22px 18px;
  background: linear-gradient(to top, rgba(10, 9, 8, 0.85), transparent);
  display: flex; justify-content: space-between; align-items: baseline;
}
.featured-card .meta strong { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
.featured-card .meta span { color: var(--orange); font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
```

And extend the two existing `.work-card .meta*` selectors so they also cover featured cards is NOT needed (rules duplicated above on purpose — different sizes). Change `.work-card` only by adding `text-align: left;` to its rule block (it's now a `<button>`; the global button reset handles the rest). The old `.client-strip .label` rule stays until Task 5.

- [ ] **Step 3: Verify with Playwright MCP against `npm run dev`**

Start `npm run dev` (background). Then:

1. Desktop 1440×900, http://localhost:3000: scroll to Work → two big 16:9 case-study cards ("Meta Ads — F&B Brand", "Digital Consulting — Retail") under "Studi kasus", then "Branding & konten" strip pins and scrolls horizontally (Rubbix, Shiawase, Spill Photography, Rizz Burger video). Screenshot.
2. Click a featured card → overlay opens: pill + title + description + 2 slides stacked; page behind doesn't scroll (mouse wheel over overlay scrolls the overlay).
3. Click a slide → fullscreen zoom, fit to screen. Click again → 250% zoom, scrollable both axes. Esc → back to overlay (NOT closed). Esc again → overlay closes, page is exactly where it was.
4. Reopen overlay → close via X; reopen → close via backdrop click; reopen → `browser_navigate_back` (back button) → overlay closes, still on the page, same scroll position.
5. Open Rubbix from the strip → 3 images in the gallery. Open Rizz Burger → video plays in overlay.
6. Mobile 390×844: featured cards full-width 16:9, no horizontal page overflow outside the pinned phase; overlay + zoom usable. Screenshot.
7. Check the browser console for errors (`browser_console_messages`) — expect none.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: green, TypeScript passes.

- [ ] **Step 5: Commit**

```bash
git add components/Work.tsx app/globals.css
git commit -m "feat: featured case-study cards and tappable strip wired to project overlay

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Client logo marquee on light chips

**Files:**
- Create: `components/ClientMarquee.tsx`
- Modify: `components/Work.tsx` (mount it), `app/globals.css` (replace `.client-grid`/`.tile` styles with marquee styles)

**Interfaces:**
- Consumes: `t.work.logos` (Task 2).
- Produces: `<ClientMarquee />` rendered inside the Work section after the strip.

- [ ] **Step 1: Write `components/ClientMarquee.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";

const CLIENT_LOGOS = [
  { n: 1, name: "CASH" },
  { n: 2, name: "TNOS World" },
  { n: 3, name: "Sinergi" },
  { n: 4, name: "Linox Coffee Space" },
  { n: 5, name: "Universitas Ciputra" },
  { n: 6, name: "Aoi" },
  { n: 8, name: "Client brand logo" },
  { n: 9, name: "Lima Dimensi Berkat" },
  { n: 10, name: "Gadis Padi" },
] as const;

// ponytail: 3 copies keep the CSS loop seamless up to ~2800px viewports;
// bump COPIES if the row ever shows a gap on ultrawide screens.
const COPIES = [0, 1, 2];

export default function ClientMarquee() {
  const { t } = useLang();
  return (
    <div className="container client-strip" data-reveal>
      <p className="label">{t.work.logos}</p>
      <div className="client-marquee">
        <div className="marquee-row">
          {COPIES.flatMap((c) =>
            CLIENT_LOGOS.map(({ n, name }) => (
              <div className="chip" key={`${c}-${n}`} aria-hidden={c > 0}>
                <Image
                  src={`/clients/${n}.png`}
                  alt={c === 0 ? `${name} — logo designed by ODOS Creative` : ""}
                  width={148}
                  height={111}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount it in `components/Work.tsx`**

Add `import ClientMarquee from "@/components/ClientMarquee";` and render `<ClientMarquee />` between the closing `</div>` of `.work-track` and `<ProjectOverlay …/>`.

- [ ] **Step 3: Replace grid CSS with marquee CSS in `app/globals.css`**

Delete the `.client-grid { … }`, `.client-grid .tile { … }`, `.client-grid .tile:hover { … }`, `.client-grid img { … }` rules. Keep `.client-strip` and `.client-strip .label`. Add:

```css
.client-marquee { overflow: hidden; }
.marquee-row { display: flex; gap: 16px; width: max-content; animation: marquee 32s linear infinite; }
.marquee-row:hover { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(calc(-100% / 3)); } }
.chip {
  background: #f5efe7; border-radius: 14px; width: 148px; aspect-ratio: 4 / 3;
  display: flex; align-items: center; justify-content: center; padding: 20px; flex-shrink: 0;
}
.chip img { max-width: 100%; max-height: 100%; object-fit: contain; }
@media (prefers-reduced-motion: reduce) {
  .marquee-row { animation: none; width: auto; flex-wrap: wrap; }
  .chip[aria-hidden="true"] { display: none; } /* duplicates exist only for the loop */
}
```

- [ ] **Step 4: Verify with Playwright MCP**

1. Desktop 1440×900: below the branding strip, logos slide continuously on warm chips (no white boxy grid); hover pauses. Screenshot.
2. Emulate `prefers-reduced-motion: reduce` (relaunch browser context or CDP emulation): row is static, wrapped, exactly 9 chips visible.
3. Console clean.

- [ ] **Step 5: Verify build, commit**

Run: `npm run build` → green.

```bash
git add components/ClientMarquee.tsx components/Work.tsx app/globals.css
git commit -m "feat: client logo marquee on light chips, replaces tile grid

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Full verification + README note

**Files:**
- Modify: `README.md` ("Edit content" section)

- [ ] **Step 1: Update README "Edit content" section**

Replace the existing "Edit content" paragraph with:

```markdown
## Edit content

All copy (ID + EN) lives in `lib/i18n.ts`. Projects live in `lib/projects.ts`:
drop images in `public/work/<slug>/`, add one entry (with each image's pixel
size), redeploy. Ads/consulting case-study slides are 1920×1080 — export them
as JPG/PNG **under ~500 KB each**. The two shipped case studies are
placeholders; replace their slide files with real ones. Client logos live in
`public/clients/` and are listed in `components/ClientMarquee.tsx`.
```

- [ ] **Step 2: Full visual pass (Playwright MCP)**

Desktop 1440×900 and mobile 390×844, full page scroll top to bottom:
- Hero → Services → Work (featured cards → strip pins → marquee) → About → CTA all render; orb visible; no layout breakage from the new blocks.
- Overlay round-trip on both viewports: open (featured + strip project), scroll gallery, zoom in/out, close via Esc, X, backdrop, and back button; landing scroll position preserved every time.
- Language toggle → EN: "Case studies", "Branding & content", "Brands we've shaped", category labels switch; overlay description switches.
- Reduced-motion pass: no pin, static marquee, overlay still opens/closes, page scroll locked behind overlay (html overflow rule).
- Console clean on both viewports.

- [ ] **Step 3: Pixel smoke check**

With `NEXT_PUBLIC_META_PIXEL_ID` unset (default dev), confirm no `fbq` errors in console when opening a project (trackViewContent no-ops). Grep sanity:

Run: `grep -n "ViewContent" lib/pixel.ts components/ProjectOverlay.tsx`
Expected: definition + one call site.

- [ ] **Step 4: Final build + commit**

Run: `npm run build` → green.

```bash
git add README.md
git commit -m "docs: content-editing guide for projects, slides, and marquee

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** data model (T2), asset folders + placeholders (T1), featured+strip layout (T4), overlay incl. history/back-button, Lenis stop, ViewContent (T3+T4), zoom (T3), marquee chips + reduced motion (T5), i18n (T2), README size note (T6), performance constraints (lazy overlay images T3, CSS-only marquee T5, no new deps everywhere).
- **Judgment calls:** gallery images carry explicit `w`/`h` so `next/image` gets intrinsic sizes (mild friction when adding projects, documented in README). Zoom uses a second `<Image>` with `sizes="250vw"` so the sharp variant is fetched only on zoom. Video project has `images: []` and no cover; both card and overlay render `<video>`.
- **Type consistency:** `t.work.categories[project.category]` works because `Category` keys match the i18n `categories` object in both dicts; `description[lang]` matches `Lang = "id" | "en"`; `GalleryImage` is exported from `lib/projects.ts` and imported by ProjectOverlay.
