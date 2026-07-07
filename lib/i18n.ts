export type Lang = "id" | "en";

export const WA_NUMBER = "6282314393503";

export const dict = {
  id: {
    nav: { services: "Layanan", work: "Karya", about: "Tentang", contact: "Kontak" },
    hero: {
      eyebrow: "Marketing & Branding Agency",
      title: "Brand Anda, <em>menyala</em> di dunia digital.",
      sub: "ODOS Creative membantu bisnis masuk ke dunia digital dengan mudah dan cepat — lewat video, logo, sosial media, dan strategi pemasaran yang dikerjakan dengan passion.",
      cta: "Ngobrol via WhatsApp",
      scroll: "Scroll untuk menjelajah",
    },
    services: {
      label: "Layanan",
      title: "Yang kami kerjakan",
      items: [
        { t: "Video Production", d: "Konten video yang bikin orang berhenti scroll — dari konsep, produksi, sampai final cut." },
        { t: "Logo & Branding", d: "Identitas visual yang melekat: logo, brand guideline, dan sistem visual yang konsisten." },
        { t: "Social Media Management", d: "Sosial media terurus tanpa pusing — konten terjadwal, audiens tetap engaged." },
        { t: "Marketing Strategy", d: "Strategi pemasaran berbasis data supaya setiap budget bekerja lebih keras." },
      ],
    },
    work: {
      label: "Karya",
      title: "Karya pilihan",
      featured: "Studi kasus",
      strip: "Branding & konten",
      logos: "Brand yang kami bentuk",
      close: "Tutup",
      zoom: "Perbesar gambar",
      categories: { ads: "Performance Ads", consulting: "Konsultasi Digital", branding: "Branding", video: "Video" },
    },
    about: {
      label: "Tentang",
      title: "Tentang ODOS",
      body: "ODOS Creative adalah agensi marketing & branding dengan spesialisasi pembuatan video, logo, manajemen sosial media, branding, dan strategi pemasaran. Tujuan kami satu: membantu setiap bisnis masuk ke dunia digital dengan mudah dan cepat.",
      counters: [
        { n: 50, suffix: "+", l: "Proyek selesai" },
        { n: 30, suffix: "+", l: "Brand ditangani" },
        { n: 5, suffix: "", l: "Layanan inti" },
      ],
    },
    cta: {
      title: "Siap bertumbuh?",
      sub: "Ceritakan bisnis Anda. Kami balas cepat di WhatsApp.",
      button: "Hubungi kami sekarang",
    },
    footer: { tagline: "Digital growth fueled with passion" },
    waText: "Halo ODOS! Saya tertarik mengembangkan bisnis saya bersama kalian.",
  },
  en: {
    nav: { services: "Services", work: "Work", about: "About", contact: "Contact" },
    hero: {
      eyebrow: "Marketing & Branding Agency",
      title: "Your brand, <em>glowing</em> in the digital world.",
      sub: "ODOS Creative takes businesses into the digital world fast and friction-free — through video, logos, social media, and marketing strategy fueled with passion.",
      cta: "Chat on WhatsApp",
      scroll: "Scroll to explore",
    },
    services: {
      label: "Services",
      title: "What we do",
      items: [
        { t: "Video Production", d: "Video content that stops the scroll — concept, production, and final cut." },
        { t: "Logo & Branding", d: "Visual identity that sticks: logos, brand guidelines, and consistent visual systems." },
        { t: "Social Media Management", d: "Hands-off social media — scheduled content, audiences kept engaged." },
        { t: "Marketing Strategy", d: "Data-driven marketing strategy that makes every budget work harder." },
      ],
    },
    work: {
      label: "Work",
      title: "Selected work",
      featured: "Case studies",
      strip: "Branding & content",
      logos: "Brands we've shaped",
      close: "Close",
      zoom: "Zoom image",
      categories: { ads: "Performance Ads", consulting: "Digital Consulting", branding: "Branding", video: "Video" },
    },
    about: {
      label: "About",
      title: "About ODOS",
      body: "ODOS Creative is a marketing & branding agency specialising in video production, logo design, social media management, branding, and marketing strategy. One goal: getting every business into the digital world quickly and easily.",
      counters: [
        { n: 50, suffix: "+", l: "Projects delivered" },
        { n: 30, suffix: "+", l: "Brands served" },
        { n: 5, suffix: "", l: "Core services" },
      ],
    },
    cta: {
      title: "Ready to grow?",
      sub: "Tell us about your business. We reply fast on WhatsApp.",
      button: "Contact us now",
    },
    footer: { tagline: "Digital growth fueled with passion" },
    waText: "Hi ODOS! I'd like to grow my business with you.",
  },
} as const;

export type Dict = (typeof dict)[Lang];

export function waHref(t: Dict): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.waText)}`;
}
