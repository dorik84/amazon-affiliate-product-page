import { Button } from "@/components/ui/button";
import type React from "react"; // Added import for React

interface AnimatedButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  onClick: () => void;
  children: React.ReactNode;
}

export function AnimatedButton({ className, size = "default", onClick, children }: AnimatedButtonProps) {
  return (
    <Button
      className={`flex items-center justify-center gap-2 w-full sm:w-auto animate-shadow  ${className}`}
      size={size}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
