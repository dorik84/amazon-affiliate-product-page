import ProductNotFound from "@/components/ProductNotFound";
import ProductPage from "@/components/ProductPage";
import RelatedProductsPage, { preloadRelatedProducts } from "@/components/RelatedProductsPage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getProduct } from "@/lib/component-actions";
import type { ApiResponse } from "@/types/api";
import { Suspense } from "react";

interface PageProps {
  params: {
    id: string;
  };
}
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const product: ApiResponse | null = await getProduct(id).catch((error) => {
    console.error("[product/[id]/Page.tsx]:", error);
    return null;
  });

  if (!product || !product.data) {
    return <ProductNotFound />;
  }

  const { data } = product;

  // Preload related products in parallel
  preloadRelatedProducts(data.category);

  return (
    <main>
      <article>
        <Suspense fallback={<LoadingSpinner aria-label="Loading product details" />}>
          <ProductPage product={data} />
        </Suspense>
      </article>

      <section>
        <Suspense fallback={<LoadingSpinner aria-label="Loading related products" />}>
          <RelatedProductsPage category={data.category} />
        </Suspense>
      </section>
    </main>
  );
}
