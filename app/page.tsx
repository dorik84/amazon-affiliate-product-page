import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PopularItems } from "@/components/PopularItems";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <PopularItems />
      </main>
      <Footer />
    </div>
  );
}
