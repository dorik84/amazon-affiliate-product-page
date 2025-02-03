import React from 'react'
import { SelectItem } from "@/components/ui/select"
import Image from 'next/image'

interface CustomSelectItemProps {
  value: string
  disabled?: boolean
  image?: string
  children: React.ReactNode
}

export function CustomSelectItem({ value, disabled, image, children }: CustomSelectItemProps) {
  return (
    <SelectItem value={value} disabled={disabled}>
      <div className="flex items-center space-x-2">
        {image && (
          <div className="relative w-8 h-8">
            <Image
              src={image || "/placeholder.svg"}
              alt={children?.toString() || ""}
              layout="fill"
              objectFit="cover"
              className="rounded-sm"
            />
          </div>
        )}
        <span>{children}</span>
      </div>
    </SelectItem>
  )
}
