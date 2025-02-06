"use server";
import { getProduct } from "@/lib/component-actions";
import { Suspense, use } from "react";
import ProductPage from "./ProductPage";
import LoadingSpinner from "@/components/LoadingSpinner";

export default async function ProductProvider({ params }: { params: { url: string } }) {
  const product = await getProduct(params.url);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductPage product={product} url={params.url} />
    </Suspense>
  );
}
