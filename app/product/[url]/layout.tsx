"use server";

import React from "react";
import type { Metadata } from "next";
import { ProductData } from "@/types/productData";
import { getProduct } from "@/lib/component-actions";

export async function generateMetadata({ params }: { params: { url: string } }): Promise<Metadata> {
  const product = await getProduct(params.url);

  if (!product) {
    console.log("No product found in DB");
    return {};
  }

  return {
    title: (product as ProductData).name,
    description: (product as ProductData).description,
  };
}

export default async function Layout({
  product,
  related,
}: {
  product: React.ReactElement;
  related: React.ReactElement;
}) {
  return (
    <>
      {product}
      {related}
    </>
  );
}
