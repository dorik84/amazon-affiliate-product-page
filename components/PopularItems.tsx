"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MobilePopularItems } from "./MobilePopularItems"

const scrollbarHideClass = "scrollbar-hide"

interface Item {
  id: number
  name: string
  price: number
  image: string
  category: string
}

const popularItems: Item[] = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Home Hub",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home & Garden",
  },
  {
    id: 4,
    name: "Stainless Steel Cookware Set",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home & Garden",
  },
  { id: 5, name: "Casual Sneakers", price: 79.99, image: "/placeholder.svg?height=300&width=300", category: "Fashion" },
  {
    id: 6,
    name: "Wooden Building Blocks",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Toys & Games",
  },
  {
    id: 7,
    name: "Smart Watch",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
  },
  {
    id: 8,
    name: "Yoga Mat",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Sports & Outdoors",
  },
  {
    id: 9,
    name: "Portable Blender",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home & Garden",
  },
  {
    id: 10,
    name: "Wireless Keyboard",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
  },
]

const FilmStrip = ({ items, index }: { items: Item[]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollSpeed] = useState(() => 0.5 + Math.random() * 0.5)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const totalHeight = container.scrollHeight
    const visibleHeight = container.clientHeight

    const handleScroll = () => {
      const newScrollPosition = (scrollPosition + scrollSpeed) % (totalHeight - visibleHeight)
      setScrollPosition(newScrollPosition)
      container.scrollTop = newScrollPosition
    }

    let interval: NodeJS.Timeout
    if (!isHovered) {
      interval = setInterval(handleScroll, 16) // Approximately 60 FPS
    }

    return () => clearInterval(interval)
  }, [isHovered, scrollSpeed, scrollPosition])

  // Duplicate items to create a seamless loop
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items]

  return (
    <div
      ref={containerRef}
      className="film-strip relative w-full md:w-1/5 h-[300px] md:h-[calc(100vh-200px)] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-0 w-full flex flex-col gap-1">
        {duplicatedItems.map((item, i) => (
          <motion.div
            key={`${item.id}-${i}`}
            className="w-full h-[300px] flex-shrink-0 p-4 bg-white rounded-lg shadow-md overflow-hidden"
            /*style={{
              boxShadow: "0 0 0 8px #000, 0 0 0 10px #fff, 0 0 0 12px #000",
            }}*/
          >
            <div className="relative h-32">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} layout="fill" objectFit="cover" />
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-1 truncate">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{item.category}</p>
              <p className="text-gray-800 font-bold mb-2">${item.price.toFixed(2)}</p>
              <Button className="w-full">Add to Cart</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function PopularItems() {
  const filmStrips = Array.from({ length: 5 }, (_, i) => (
    <FilmStrip key={i} items={popularItems.slice(i * 2, (i + 1) * 2).concat(popularItems.slice(0, i * 2))} index={i} />
  ))

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Items</h2>
        {/* Desktop version */}
        <div className="hidden md:flex md:flex-row gap-4 w-full">{filmStrips}</div>
        {/* Mobile version */}
        <div className="md:hidden">
          <MobilePopularItems items={popularItems} />
        </div>
      </div>
    </section>
  )
}

