"use server";

import ProductPage from "@/components/ProductPage";
import { getProduct } from "@/lib/component-actions";

export default async function CarouselPage({ params }: { params: { url: string } }) {
  const product = await getProduct(params.url);

  return <ProductPage product={product} />;
}
