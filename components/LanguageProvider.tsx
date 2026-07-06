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
