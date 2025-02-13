"use server";

import ProductPage from "@/components/ProductPage";
import { getProduct, updateProduct } from "@/lib/component-actions";
import { ProductData } from "@/types/productData";

export default async function Page({ params }: { params: { url: string } }) {
  // void updateProduct(params.url);
  let product = await getProduct(params.url);
  console.log("url =", params.url);
  return <ProductPage product={product as ProductData} />;
}
