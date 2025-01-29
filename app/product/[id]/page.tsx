"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import AffiliateMessage from "@/components/AffiliateMessage"
import ProductCarousel from "@/components/ProductCarousel"
import ProductDescription from "@/components/ProductDescription"
import ProductVariations from "@/components/ProductVariations"
import ThemeToggle from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ProductPage() {
  const [selectedVariation, setSelectedVariation] = useState(0)
  const { theme } = useTheme()

  const product = {
    name: "Premium Wireless Headphones",
    description:
      "Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise-cancellation technology and a comfortable over-ear design, these headphones are perfect for music lovers and professionals alike. The ergonomic design ensures hours of comfortable wear, while the long-lasting battery life keeps your music playing all day long. With seamless Bluetooth connectivity, you can easily pair these headphones with your favorite devices and enjoy your audio without any wires getting in the way. The built-in microphone allows for clear hands-free calling, making these headphones perfect for both work and play. Whether you're commuting, working out, or just relaxing at home, these headphones deliver exceptional sound quality that brings your music to life. The sleek and modern design not only looks great but also incorporates touch controls for easy operation. With multiple color options available, you can choose the perfect style to match your personality. Elevate your listening experience with these premium wireless headphones and immerse yourself in the world of high-fidelity audio.",
    images: [
      "/placeholder.svg?height=400&width=400&text=Image1",
      "/placeholder.svg?height=400&width=400&text=Image2",
      "/placeholder.svg?height=400&width=400&text=Image3",
      "/placeholder.svg?height=400&width=400&text=Image4",
      "/placeholder.svg?height=400&width=400&text=Image5",
    ],
    variations: [
      {
        name: "Classic Black",
        price: 199.99,
        color: "black",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Sleek White",
        price: 209.99,
        color: "white",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Metallic Silver",
        price: 219.99,
        color: "silver",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Rose Gold",
        price: 229.99,
        color: "rose-gold",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Navy Blue",
        price: 209.99,
        color: "navy",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  }

  const handleVariationChange = (index: number) => {
    setSelectedVariation(index)
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <AffiliateMessage />
        <ThemeToggle />
      </div>

      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{product.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="md:col-span-1">
            <ProductCarousel product={product} />
          </div>

          <div className="md:col-span-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
              <p className="text-2xl font-semibold bg-primary/10 text-primary px-4 py-2 rounded-md">
                ${product.variations[selectedVariation].price.toFixed(2)}
              </p>
              <Button
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
                size="lg"
                onClick={() => window.open("https://www.amazon.com", "_blank")}
              >
                <Image src="/amazon-icon.svg" alt="Amazon" width={24} height={24} className="w-6" />
                View on Amazon
              </Button>
            </div>

            <ProductVariations
              variations={product.variations}
              selectedVariation={selectedVariation}
              onVariationChange={handleVariationChange}
            />
          </div>

          <div className="md:col-span-2">
            <ProductDescription description={product.description} />
          </div>
        </div>
      </div>
    </div>
  )
}

