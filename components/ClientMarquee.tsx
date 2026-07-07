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
