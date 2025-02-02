import type { ProductData } from "@/types/productData";

interface ProductDescriptionProps {
  description: ProductData["description"] | null | undefined;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="bg-background text-foreground rounded-lg sm:p-4">
      <h2 className="text-xl font-semibold mb-2">Product Description</h2>
      <p className="lg:text-justify lg:columns-2 text-sm lg:gap-6">{description}</p>
    </div>
  );
}
