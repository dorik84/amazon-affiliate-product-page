interface ProductDescriptionProps {
  description: string
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Product Description</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

