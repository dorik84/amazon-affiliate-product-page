"use server";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PopularItems } from "@/components/PopularItems";
import { Footer } from "@/components/Footer";

import { Suspense } from "react";
import { sanitizeProductData } from "@/lib/utils";
import { getPopularProducts } from "@/lib/server-actions";
import { getRelatedProducts } from "@/lib/component-actions";

export default async function Home() {
  const data = await getRelatedProducts();
  // const data = await getPopularProducts();
  const popularItems = data.map(sanitizeProductData);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <Suspense fallback={<div>Loading...</div>}>
          <PopularItems popularItems={popularItems} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
