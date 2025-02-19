import ProductNotFound from "@/components/ProductNotFound";
import ProductPage from "@/components/ProductPage";
import RelatedProductsPage, { preloadRelatedProducts } from "@/components/RelatedProductsPage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getProduct } from "@/lib/component-actions";
import { Suspense } from "react";

export default async function Page({ params }: { params: { encodedUrl: string } }) {
  const productPromise = getProduct(params.encodedUrl);
  const product = await productPromise;

  if (!product) {
    return <ProductNotFound />;
  }

  // Start preloading related products as soon as we have the category
  preloadRelatedProducts(product.category);

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductPage product={product} />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <RelatedProductsPage category={product.category} />
      </Suspense>
    </>
  );
}
