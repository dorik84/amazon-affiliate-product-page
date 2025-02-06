import React, { lazy, Suspense } from "react";

const RelatedProductsWidget = lazy(() => import("@/components/RelatedProductsWidget"));

export default async function Page({}) {
  return (
    <Suspense fallback={<div>Loading related products...</div>}>
      <RelatedProductsWidget />
    </Suspense>
  );
}
