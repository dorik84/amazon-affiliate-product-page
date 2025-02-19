"use server";

import React from "react";
import type { Metadata } from "next";
import { ProductData } from "@/types/product";
import { getProduct } from "@/lib/component-actions";

export async function generateMetadata({ params }: { params: { encodedUrl: string } }): Promise<Metadata> {
  const product = await getProduct(params.encodedUrl);

  if (!product) {
    console.log("No product found in DB");
    return {};
  }

  return {
    title: (product as ProductData).name,
    description: (product as ProductData).description,
  };
}

export default async function Layout({ children }: { children: React.ReactElement }) {
  return <>{children}</>;
}
