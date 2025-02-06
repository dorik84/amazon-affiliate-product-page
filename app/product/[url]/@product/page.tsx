"use server";
import { getProduct } from "@/lib/component-actions";
import ProductPage from "@/components/ProductPage";

export default async function ProductProvider({ params }: { params: { url: string } }) {
  const product = await getProduct(params.url);

  return <ProductPage product={product} url={params.url} />;
}
