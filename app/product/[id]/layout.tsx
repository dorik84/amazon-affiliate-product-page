"use server";

import React from "react";
import type { Metadata } from "next";
import { getProduct } from "@/lib/component-actions";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id).catch((error) => {
    console.error("[ProductLayout]:", error);
    return null;
  });

  if (!product?.data) {
    console.log("No product found in DB");
    return {};
  }

  const { data } = product;

  return {
    title: data.name,
    description: data.description,
  };
}

export default async function Layout({ children }: { children: React.ReactElement }) {
  return <>{children}</>;
}
