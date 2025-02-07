"use client";

import type { VariationData } from "@/types/productData";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomSelectItem } from "@/components/ui/custom-select-item";
import Image from "next/image";

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
  if (!variations || !selectedVariations) return null;

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
            {type === "default" ? "Options" : type} : {typeVariations[selectedVariations[type]]?.name}
          </h3>

          <Select
            value={selectedVariations[type]?.toString()}
            onValueChange={(value) => onVariationChange(type, Number.parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {typeVariations[selectedVariations[type]]?.image && (
                  <div className="relative w-6 h-6 mr-2 inline-block align-middle">
                    <Image
                      src={typeVariations[selectedVariations[type]]?.image || "/placeholder.svg"}
                      alt={typeVariations[selectedVariations[type]]?.name}
                      layout="fill"
                      className="rounded-sm"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <span className="align-middle">{typeVariations[selectedVariations[type]]?.name}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {typeVariations.map((variation, index) => (
                <CustomSelectItem
                  key={index}
                  value={index.toString()}
                  disabled={variation.disabled}
                  image={variation.image}
                >
                  {variation.name}
                </CustomSelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
