import { ProductData, VariationData } from "@/types/productData";
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
  productData.variations.forEach((variation: VariationData) => {
    const type = variation.type || "default";
    if (!getInitialVariations[type]) {
      getInitialVariations[type] = 0;
    }
  });

  return getInitialVariations;
};

// NOT USED
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || obj2 == null || typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function sanitizeProductData(obj: any): ProductData {
  if (obj === null || typeof obj !== "object") {
    throw new Error("utils | sanitizeProductData | Input is not an object");
  }

  console.log("utils | sanitizeProductData | run");

  const sanitized: ProductData = {
    name: obj.name,
    description: obj.description,
    variations: obj.variations?.map((variation: any) => ({
      name: variation.name,
      price: variation.price,
      image: variation.image,
      type: variation.type,
      disabled: variation.disabled,
    })),
    images: obj.images,
    defaultPrice: obj.defaultPrice,
    url: obj.url,
  };

  return sanitized;
}
