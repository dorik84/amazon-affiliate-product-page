import type { ProductData } from "@/types/productData";

interface ProductDescriptionProps {
  description: ProductData["description"] | null | undefined;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="bg-background text-foreground rounded-lg sm:p-4">
      <div
        className="lg:text-justify lg:columns-2 text-sm lg:gap-6"
        dangerouslySetInnerHTML={{ __html: description || "" }}
      />
    </div>
  );
}
