"use server";

import ProductPage from "@/components/ProductPage";
import { getProduct, updateProduct } from "@/lib/component-actions";

import { ProductData } from "@/types/productData";

export default async function CarouselPage({ params }: { params: { url: string } }) {
  let product = await getProduct(params.url);
  updateProduct(params.url);
  return <ProductPage product={product as ProductData} />;
}
