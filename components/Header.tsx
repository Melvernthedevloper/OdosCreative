"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";

export default function Header() {
  const { lang, t, toggle } = useLang();
  return (
    <header className="site-header">
      <a href="#top" className="logo" aria-label="ODOS Creative">
        {/* ponytail: source PNG is a square 1000x1000 mark, not a 4:1 wordmark — width must match height or Next warns about aspect-ratio mismatch */}
        <Image src="/brand/logo-white.png" alt="ODOS" width={30} height={30} priority />
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
