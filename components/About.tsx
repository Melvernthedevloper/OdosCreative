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
