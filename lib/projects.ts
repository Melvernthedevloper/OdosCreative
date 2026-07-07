// One entry per project. To add one: drop images in public/work/<slug>/,
// add an entry here with each image's pixel size (w/h), redeploy.
export type Category = "ads" | "consulting" | "branding" | "video";

export type GalleryImage = { src: string; w: number; h: number };

export type Project = {
  slug: string;
  title: string;
  category: Category;
  featured?: boolean; // true → big 16:9 case-study card at the top of Work
  cover?: string; // card image; omit for video projects (card plays the video)
  images: GalleryImage[]; // overlay gallery, in order
  video?: string;
  description?: { id: string; en: string }; // shown only inside the overlay
};

export const PROJECTS: Project[] = [
  {
    slug: "meta-ads-fnb",
    title: "Meta Ads — F&B Brand",
    category: "ads",
    featured: true,
    cover: "/work/meta-ads-fnb/slide-1.png",
    images: [
      { src: "/work/meta-ads-fnb/slide-1.png", w: 1920, h: 1080 },
      { src: "/work/meta-ads-fnb/slide-2.png", w: 1920, h: 1080 },
    ],
    description: {
      id: "Studi kasus performance ads. Slide ini placeholder — ganti dengan hasil kampanye asli.",
      en: "Performance ads case study. These slides are placeholders — swap in real campaign results.",
    },
  },
  {
    slug: "digital-consulting-retail",
    title: "Digital Consulting — Retail",
    category: "consulting",
    featured: true,
    cover: "/work/digital-consulting-retail/slide-1.png",
    images: [
      { src: "/work/digital-consulting-retail/slide-1.png", w: 1920, h: 1080 },
      { src: "/work/digital-consulting-retail/slide-2.png", w: 1920, h: 1080 },
    ],
    description: {
      id: "Studi kasus konsultasi digital. Slide ini placeholder — ganti dengan hasil engagement asli.",
      en: "Digital consulting case study. These slides are placeholders — swap in real engagement results.",
    },
  },
  {
    slug: "rubbix",
    title: "Rubbix",
    category: "branding",
    cover: "/work/rubbix/rubbix.png",
    images: [
      { src: "/work/rubbix/rubbix.png", w: 1080, h: 1440 },
      { src: "/work/rubbix/rubbix-beans.png", w: 1080, h: 1440 },
      { src: "/work/rubbix/rubbix-coffee.png", w: 1080, h: 1440 },
    ],
    description: {
      id: "Identitas brand dan desain kemasan untuk Rubbix Coffee.",
      en: "Brand identity and packaging design for Rubbix Coffee.",
    },
  },
  {
    slug: "shiawase",
    title: "Shiawase",
    category: "branding",
    cover: "/work/shiawase/shiawase-website.png",
    images: [
      { src: "/work/shiawase/shiawase-website.png", w: 1080, h: 1440 },
      { src: "/work/shiawase/shiawase-2.png", w: 1080, h: 1440 },
    ],
    description: {
      id: "Desain web dan konten sosial media untuk Shiawase.",
      en: "Web design and social media content for Shiawase.",
    },
  },
  {
    slug: "spill-photography",
    title: "Spill Photography",
    category: "branding",
    cover: "/work/spill-photography/spill-photography.png",
    images: [{ src: "/work/spill-photography/spill-photography.png", w: 1080, h: 1350 }],
  },
  {
    slug: "rizz-burger",
    title: "Rizz Burger",
    category: "video",
    images: [],
    video: "/work/rizz-burger/rizz-burger.mp4",
  },
];
