"use client";

import { useEffect, useRef, useState } from "react";
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

export default function Work() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const [motionOk, setMotionOk] = useState(true);
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
      <div className="work-track" ref={trackRef}>
        {PIECES.map((p) => (
          <figure className="work-card" key={p.src}>
            {/* ponytail: cards are mid-page in a pinned section, not above the fold — plain lazy, no priority/eager needed for LCP */}
            <Image
              src={p.src}
              alt={`${p.title} — ${p.tag}`}
              fill
              sizes="(max-width: 767px) 78vw, 460px"
              style={{ objectFit: "cover" }}
            />
            <figcaption className="meta">
              <strong>{p.title}</strong>
              <span>{p.tag}</span>
            </figcaption>
          </figure>
        ))}
        <figure className="work-card">
          <video src="/work/rizz-burger.mp4" muted loop playsInline autoPlay={motionOk} preload="metadata" />
          <figcaption className="meta">
            <strong>Rizz Burger</strong>
            <span>Video</span>
          </figcaption>
        </figure>
      </div>
      <div className="container client-strip" data-reveal>
        <p className="label">{t.work.logos}</p>
        <div className="client-grid">
          {CLIENT_LOGOS.map(({ n, name }) => (
            <div className="tile" key={n}>
              <Image src={`/clients/${n}.png`} alt={`${name} — logo designed by ODOS Creative`} width={160} height={120} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
