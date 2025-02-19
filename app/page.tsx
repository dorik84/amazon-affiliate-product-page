"use server";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PopularItems } from "@/components/PopularItems";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";
// import { getProducts } from "@/lib/server-actions";
import { getProducts } from "@/lib/component-actions";

export default async function Home() {
  const response = await getProducts();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <Suspense fallback={<div>Loading...</div>}>
          <PopularItems popularItems={response.data} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
