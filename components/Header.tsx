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
