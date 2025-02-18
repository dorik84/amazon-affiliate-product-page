import RelatedProducts from "@/components/RelatedProducts";
import { getRelatedProducts } from "@/lib/component-actions";
import React from "react";

export default async function Page() {
  const relatedProducts = await getRelatedProducts();
  return <RelatedProducts relatedProducts={relatedProducts} />;
}
