import type { VariationData } from "@/types/productData";
import { VariantButton } from "@/components/ui/variant-button";

interface ProductVariationsProps {
  variations: VariationData[] | null | undefined;
  selectedVariations: Record<string, number>;
  onVariationChange: (type: string, index: number) => void;
}

export default function ProductVariations({
  variations,
  selectedVariations,
  onVariationChange,
}: ProductVariationsProps) {
  // Group variations by type
  const groupedVariations =
    variations?.reduce((acc, variation) => {
      const type = variation.type || "default";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(variation);
      return acc;
    }, {} as Record<string, VariationData[]>) || {};

  return (
    <div className="space-y-6">
      {Object.entries(groupedVariations).map(([type, typeVariations]) => (
        <div key={type} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">
            {type === "default" ? "Options" : type} : {typeVariations[selectedVariations[type]].name}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {typeVariations.map((variation, index) => (
              <VariantButton
                className="justify-self-stratch rounded-sm"
                key={index}
                name={variation.name}
                image={variation.image}
                isSelected={selectedVariations[type] === index}
                onClick={() => onVariationChange(type, index)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
