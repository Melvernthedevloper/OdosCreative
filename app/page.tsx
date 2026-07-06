import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Page() {
  return (
    <>
      <div className="bg-glow" aria-hidden />
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}
