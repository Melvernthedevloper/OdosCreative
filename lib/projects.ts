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
    slug: "high-ticket-leads",
    title: "Meta Ads — High Ticket Leads",
    category: "ads",
    featured: true,
    cover: "/work/high-ticket-leads/slide-1.png",
    images: [
      { src: "/work/high-ticket-leads/slide-1.png", w: 1920, h: 1080 },
      { src: "/work/high-ticket-leads/slide-2.png", w: 1920, h: 1080 },
      { src: "/work/high-ticket-leads/slide-3.png", w: 1920, h: 1080 },
      { src: "/work/high-ticket-leads/slide-4.png", w: 1920, h: 1080 },
      { src: "/work/high-ticket-leads/slide-5.png", w: 1920, h: 1080 },
      { src: "/work/high-ticket-leads/slide-6.png", w: 1920, h: 1080 },
      { src: "/work/high-ticket-leads/slide-7.png", w: 1920, h: 1080 },
      { src: "/work/high-ticket-leads/slide-8.png", w: 1920, h: 1080 },
    ],
    description: {
      id: "Bakar 200 ribu dapat 200 leads berkualitas? Studi kasus iklan jasa High Ticket yang benar-benar jualan, bukan cuma rame.",
      en: "200k spend, 200 qualified leads. A high-ticket lead-gen case study built to sell, not just to get impressions.",
    },
  },
  {
    slug: "app-user-growth",
    title: "Meta Ads — App User Growth",
    category: "ads",
    featured: true,
    cover: "/work/app-user-growth/slide-1.png",
    images: [
      { src: "/work/app-user-growth/slide-1.png", w: 1920, h: 1080 },
      { src: "/work/app-user-growth/slide-2.png", w: 1920, h: 1080 },
      { src: "/work/app-user-growth/slide-3.png", w: 1920, h: 1080 },
      { src: "/work/app-user-growth/slide-4.png", w: 1920, h: 1080 },
      { src: "/work/app-user-growth/slide-5.png", w: 1920, h: 1080 },
    ],
    description: {
      id: "110 → 356. Cara kami naikin user aplikasi 3x lipat dalam sebulan. Studi kasus iklan jual jasa agency kita sendiri.",
      en: "110 → 356. How we tripled app users in a month — a case study from our own agency campaign.",
    },
  },
  {
    slug: "rubbix",
    title: "Rubbix",
    category: "branding",
    cover: "/work/rubbix/packaging.png",
    images: [
      { src: "/work/rubbix/beans.png", w: 1080, h: 1440 },
      { src: "/work/rubbix/packaging.png", w: 1080, h: 1440 },
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
    cover: "/work/shiawase/website.png",
    images: [
      { src: "/work/shiawase/lanyard.png", w: 1080, h: 1440 },
      { src: "/work/shiawase/mascot.png", w: 1080, h: 1440 },
      { src: "/work/shiawase/website.png", w: 1080, h: 1440 },
    ],
    description: {
      id: "Identitas brand, maskot, dan desain web untuk Shiawase.",
      en: "Brand identity, mascot, and web design for Shiawase.",
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
