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
