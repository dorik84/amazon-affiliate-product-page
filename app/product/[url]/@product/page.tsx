"use server";

import ProductNotFound from "@/components/ProductNotFound";
import ProductPage from "@/components/ProductPage";
import { getProduct, updateProduct } from "@/lib/component-actions";

export default async function Page({ params }: { params: { url: string } }) {
  // void updateProduct(params.url);
  let product = await getProduct(params.url);
  if (!product) {
    return <ProductNotFound />;
  }
  return <ProductPage product={product} />;
}
