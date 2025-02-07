"use server";

import { getProduct } from "@/lib/component-actions";
import type { Metadata } from "next";
import React from "react";

// This function generates metadata for the page
export async function generateMetadata({ params }: { params: { url: string } }): Promise<Metadata> {
  const product = await getProduct(params.url);

  if (!product) {
    console.log("No product found in DB");
    return {};
  }

  return {
    title: product.title,
    description: product.description,
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
