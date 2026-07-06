import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import About from "@/components/About";

export default function Page() {
  return (
    <>
      <div className="bg-glow" aria-hidden />
      <Header />
      <main>
        <Hero />
        <Services />
        <Work />
        <About />
      </main>
    </>
  );
}
