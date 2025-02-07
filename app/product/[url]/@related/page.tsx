import RelatedProductsWidget from "@/components/RelatedProductsWidget";
import { getRelatedProducts } from "@/lib/component-actions";
import React from "react";

export default async function Page({}) {
  const relatedProducts = await getRelatedProducts();
  return <RelatedProductsWidget relatedProducts={relatedProducts} />;
}
