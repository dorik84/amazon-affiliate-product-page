import Image from "next/image"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Variation {
  name: string
  price: number
  color: string
  image: string
}

interface ProductVariationsProps {
  variations: Variation[]
  selectedVariation: number
  onVariationChange: (index: number) => void
}

export default function ProductVariations({
  variations,
  selectedVariation,
  onVariationChange,
}: ProductVariationsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Color Options</h3>
      <RadioGroup
        value={selectedVariation.toString()}
        onValueChange={(value) => onVariationChange(Number.parseInt(value))}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {variations.map((variation, index) => (
          <div className="flex items-center space-x-2" key={index}>
            <RadioGroupItem value={index.toString()} id={`color-${variation.color}`} />
            <Label htmlFor={`color-${variation.color}`} className="flex items-center cursor-pointer">
              <Image
                src={variation.image || "/placeholder.svg"}
                alt={variation.name}
                width={50}
                height={50}
                className="mr-2 rounded-md"
              />
              <span className="flex-grow">{variation.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

