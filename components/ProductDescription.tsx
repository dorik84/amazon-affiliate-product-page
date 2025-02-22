import type { ProductData } from "@/types/product";

export default function ProductDescription({ product }: { product: ProductData | undefined }) {
  return (
    <div className="bg-background text-foreground rounded-lg sm:p-4">
      <div
        className="lg:text-justify lg:columns-2 text-xs sm:text-sm lg:gap-6"
        dangerouslySetInnerHTML={{ __html: product?.description || "" }}
      />
    </div>
  );
}
