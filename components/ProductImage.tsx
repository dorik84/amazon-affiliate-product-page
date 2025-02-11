"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function ProductImage({
  name,
  src,
  index,
  className,
  alt,
  priority = false,
  width,
  height,
}: {
  name: string;
  src?: string;
  index: number;
  className?: string;
  alt?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt || `${name} - Image ${index ? index + 1 : ""}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`
          object-contain 
          transition-opacity 
          duration-300 
          ${isLoading ? "opacity-0" : "opacity-100"}
          ${className}
        `}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        priority={priority}
        width={width || 500}
        height={height || 500}
      />
    </div>
  );
}
