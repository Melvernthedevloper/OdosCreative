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
