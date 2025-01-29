import type { ProductData } from "@/types/productData";

interface ProductDescriptionProps {
  description: ProductData["description"] | null | undefined;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Product Description</h2>
      <p className="text-gray-600 lg:text-justify lg:columns-2 lg:gap-6">{description}</p>
    </div>
  );
}
