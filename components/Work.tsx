"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { useReveal } from "@/lib/useReveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { PROJECTS, type Project } from "@/lib/projects";
import ProjectOverlay from "@/components/ProjectOverlay";
import ClientMarquee from "@/components/ClientMarquee";

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

      <ClientMarquee />

      <ProjectOverlay project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
