export type Lang = "id" | "en";

export const WA_NUMBER = "6282314393503";

export const dict = {
  id: {
    nav: { services: "Layanan", work: "Karya", about: "Tentang", contact: "Kontak" },
    hero: {
      eyebrow: "Performance & Creative Agency",
      title: "Brand Anda sudah jalan. Saatnya <em>naik kelas</em>.",
      sub: "ODOS adalah tim digital di balik bisnis yang siap naik level. Semua dimulai dari konsultasi — kami petakan arah brand Anda, lalu tangani iklan, branding, dan sistem digitalnya sampai tuntas.",
      cta: "Ngobrol via WhatsApp",
      scroll: "Scroll untuk menjelajah",
    },
    services: {
      label: "Layanan",
      title: "Yang kami tangani untuk Anda",
      items: [
        { t: "Ads Management", d: "Iklan digital yang dikelola penuh — dari strategi, materi iklan, sampai optimasi harian supaya setiap budget menghasilkan." },
        { t: "Digital System Consulting & Training", d: "Konsultasi dan pelatihan sistem digital untuk Anda dan tim — supaya bisnis paham arah digitalnya dan bisa berjalan mandiri." },
        { t: "Branding", d: "Identitas visual selevel pemain besar: logo, brand guideline, dan sistem visual yang konsisten." },
      ],
    },
    work: {
      label: "Karya",
      title: "Karya pilihan",
      featured: "Studi kasus",
      strip: "Branding & konten",
      logos: "Brand yang naik kelas bersama kami",
      close: "Tutup",
      categories: { ads: "Performance Ads", consulting: "Konsultasi Digital", branding: "Branding", video: "Video" },
    },
    about: {
      label: "Tentang",
      title: "Tentang ODOS",
      body: "ODOS Creative adalah performance & creative agency untuk bisnis yang siap bertumbuh. Kami hadir untuk pemilik bisnis yang tidak punya waktu — atau tim — untuk mengurus digital sendiri: kami konsultasikan arahnya, lalu tangani iklan, branding, dan sistem digitalnya secara menyeluruh.",
      counters: [
        { n: 50, suffix: "+", l: "Proyek selesai" },
        { n: 30, suffix: "+", l: "Brand ditangani" },
        { n: 3, suffix: "", l: "Layanan inti" },
      ],
    },
    cta: {
      title: "Siap naik kelas?",
      sub: "Ceritakan bisnis Anda — mulai dari obrolan santai, kami bantu petakan langkah digitalnya.",
      button: "Hubungi kami sekarang",
    },
    footer: { tagline: "Digital growth fueled with passion" },
    waText: "Halo ODOS! Bisnis saya sedang bertumbuh dan saya ingin konsultasi soal kebutuhan digitalnya.",
  },
  en: {
    nav: { services: "Services", work: "Work", about: "About", contact: "Contact" },
    hero: {
      eyebrow: "Performance & Creative Agency",
      title: "Your brand is running. Time to <em>level up</em>.",
      sub: "ODOS is the digital team behind businesses ready for the next stage. It all starts with a consultation — we map your brand's direction, then handle the ads, branding, and digital systems end to end.",
      cta: "Chat on WhatsApp",
      scroll: "Scroll to explore",
    },
    services: {
      label: "Services",
      title: "What we handle for you",
      items: [
        { t: "Ads Management", d: "Fully managed digital ads — strategy, creatives, and daily optimisation so every budget performs." },
        { t: "Digital System Consulting & Training", d: "Consulting and training on digital systems for you and your team — so your business understands its digital direction and can run it independently." },
        { t: "Branding", d: "Visual identity that puts you in the big league: logos, guidelines, and consistent visual systems." },
      ],
    },
    work: {
      label: "Work",
      title: "Selected work",
      featured: "Case studies",
      strip: "Branding & content",
      logos: "Brands that levelled up with us",
      close: "Close",
      categories: { ads: "Performance Ads", consulting: "Digital Consulting", branding: "Branding", video: "Video" },
    },
    about: {
      label: "About",
      title: "About ODOS",
      body: "ODOS Creative is a performance & creative agency for businesses ready to grow. We're here for owners who don't have the time — or the team — to handle digital themselves: we consult on the direction, then take care of the ads, branding, and digital systems end to end.",
      counters: [
        { n: 50, suffix: "+", l: "Projects delivered" },
        { n: 30, suffix: "+", l: "Brands served" },
        { n: 3, suffix: "", l: "Core services" },
      ],
    },
    cta: {
      title: "Ready to level up?",
      sub: "Tell us about your business — it starts with a casual chat, and we'll help map your next digital move.",
      button: "Contact us now",
    },
    footer: { tagline: "Digital growth fueled with passion" },
    waText: "Hi ODOS! My business is growing and I'd like to talk about its digital needs.",
  },
} as const;

export type Dict = (typeof dict)[Lang];

export function waHref(t: Dict): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.waText)}`;
}
