import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import Image from "next/image";

interface VariantButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  image?: string;
  isSelected?: boolean;
}

const VariantButton = React.forwardRef<HTMLButtonElement, VariantButtonProps>(
  ({ className, name, image, isSelected, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={isSelected ? "default" : "outline"}
        className={cn(
          " overflow-hidden text-ellipsis whitespace-nowrap flex items-center justify-start gap-3 p-1",
          isSelected && "ring-2 ring-primary",
          className
        )}
        {...props}
      >
        {image && <Image src={image} alt={name} width={40} height={40} className="rounded-md object-cover" />}
        <span className={cn("flex-grow text-center", image && "text-left")}>{name}</span>
      </Button>
    );
  }
);
VariantButton.displayName = "VariantButton";

export { VariantButton };
