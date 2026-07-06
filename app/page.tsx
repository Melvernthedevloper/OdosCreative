import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import About from "@/components/About";
import CtaFinale from "@/components/CtaFinale";
import Scene from "@/components/Scene";

export default function Page() {
  return (
    <>
      <div className="bg-glow" aria-hidden />
      <Scene />
      <Header />
      <main>
        <Hero />
        <Services />
        <Work />
        <About />
        <CtaFinale />
      </main>
    </>
  );
}
