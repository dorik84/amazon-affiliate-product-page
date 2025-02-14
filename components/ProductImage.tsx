"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProductImage({
  name,
  src,
  index,
  className,
  alt,
  priority = false,
  width,
  height,
  style,
}: {
  name: string;
  src?: string;
  index: number;
  className?: string;
  alt?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/10">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt || `${name} - Image ${index ? index + 1 : ""}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        priority={priority}
        draggable={false}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 70vw"
        style={{
          objectFit: "contain",
          maxWidth: "100%",
          maxHeight: "100%",
          ...style,
        }}
        className={cn(`transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`, `${className}`)}
      />
    </div>
  );
}
