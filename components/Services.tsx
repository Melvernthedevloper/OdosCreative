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
