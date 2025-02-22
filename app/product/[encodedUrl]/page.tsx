import ProductNotFound from "@/components/ProductNotFound";
import ProductPage from "@/components/ProductPage";
import RelatedProductsPage, { preloadRelatedProducts } from "@/components/RelatedProductsPage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getProduct } from "@/lib/component-actions";
import { Suspense } from "react";

interface PageProps {
  params: {
    encodedUrl: string;
  };
}
export default async function Page({ params }: PageProps) {
  const product = await getProduct(params.encodedUrl).catch((error) => {
    console.error("[Product / [encodedUrl]/ Page]:", error);
    return null;
  });

  if (!product?.data) {
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
