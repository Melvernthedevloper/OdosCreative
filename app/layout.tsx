import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "ODOS Creative — Digital Growth Fueled With Passion",
  description:
    "Agensi marketing & branding: video, logo, sosial media, dan strategi pemasaran untuk membawa bisnis Anda ke dunia digital.",
  openGraph: {
    title: "ODOS Creative — Digital Growth Fueled With Passion",
    description:
      "Marketing & branding agency: video, logo, social media, and marketing strategy.",
    images: ["/brand/banner.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={jakarta.variable}>{children}</body>
    </html>
  );
}
