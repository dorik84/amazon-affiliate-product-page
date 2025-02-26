import { ProductData } from "@/types/product";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomUserAgent() {
  const options = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
  ];
  return options[Math.floor(Math.random() * options.length)];
}

export const getInitialVariations = (productData: ProductData) => {
  if (!productData) return {};
  const getInitialVariations: Record<string, number> = {};
  productData.variations.forEach((variation) => {
    const type = variation.type || "default";
    if (!getInitialVariations[type]) {
      getInitialVariations[type] = 0;
    }
  });

  return getInitialVariations;
};

/**
 * Validates if the provided object is a valid ProductData object
 * @param obj - The object to validate
 * @returns boolean - True if the object is a valid ProductData, false otherwise
 */
export function isProductData(obj: any): obj is ProductData {
  // Check if obj is an object and not null
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return false;
  }

  // Check required string properties
  const requiredStringProps = ["name", "description", "url", "category"];
  for (const prop of requiredStringProps) {
    if (typeof obj[prop] !== "string" || obj[prop] === "") {
      return false;
    }
  }

  // Check defaultPrice
  if (typeof obj.defaultPrice !== "number" || isNaN(obj.defaultPrice)) {
    return false;
  }

  // Check images array
  if (!Array.isArray(obj.images)) {
    return false;
  }

  // Validate that all images are strings
  if (!obj.images.every((img) => typeof img === "string")) {
    return false;
  }

  // Check variations array
  if (!Array.isArray(obj.variations)) {
    return false;
  }

  // Validate each variation
  for (const variation of obj.variations) {
    if (typeof variation !== "object" || variation === null) {
      return false;
    }

    // Check required variation properties
    if (typeof variation.name !== "string" || variation.name === "") {
      return false;
    }

    if (typeof variation.price !== "number" || isNaN(variation.price)) {
      return false;
    }

    if (typeof variation.image !== "string" || variation.image === "") {
      return false;
    }

    if (typeof variation.type !== "string" || variation.type === "") {
      return false;
    }

    // Check optional disabled property if it exists
    if ("disabled" in variation && typeof variation.disabled !== "boolean") {
      return false;
    }
  }

  return true;
}
