import { ProductData } from "@/types/product";
import logger from "@/lib/logger";

/**
 * Validates if the provided object is a valid ProductData object
 * @param obj - The object to validate
 * @returns boolean - True if the object is a valid ProductData, false otherwise
 */
export function isProductData(obj: any): obj is ProductData {
  logger.debug("[lib/utils.ts] | isProductData() | start");

  // Check if obj is an object and not null
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    logger.error("[lib/utils.ts] | isProductData() | is not object");
    return false;
  }

  // Check required string properties
  const requiredStringProps = ["name", "description", "url", "category"];
  for (const prop of requiredStringProps) {
    if (typeof obj[prop] !== "string" || obj[prop] === "") {
      logger.error("[lib/utils.ts] | isProductData() | does not have property", prop);
      return false;
    }
  }

  // Check defaultPrice
  if (typeof obj.defaultPrice !== "number" || isNaN(obj.defaultPrice)) {
    logger.error("[lib/utils.ts] | isProductData() | no defaultPrice or not a number");
    return false;
  }

  // Check images array
  if (!Array.isArray(obj.images)) {
    logger.error("[lib/utils.ts] | isProductData() | images property is not array");
    return false;
  }

  // Validate that all images are strings
  if (!obj.images.every((img: any) => typeof img === "string")) {
    logger.error("[lib/utils.ts] | isProductData() | some of the images items is not a string");
    return false;
  }

  // Check variations array
  if (!Array.isArray(obj.variations)) {
    logger.error("[lib/utils.ts] | isProductData() | variations prop is not a array");
    return false;
  }

  // Validate each variation
  for (const variation of obj.variations) {
    if (typeof variation !== "object" || variation === null) {
      logger.error("[lib/utils.ts] | isProductData() | variation is not obj | variation", variation);
      return false;
    }

    // Check required variation properties
    if (typeof variation.name !== "string" || variation.name === "") {
      logger.error("[lib/utils.ts] | isProductData() | variation.name is not string | variation", variation);
      return false;
    }

    if (typeof variation.price !== "number" || isNaN(variation.price)) {
      logger.error("[lib/utils.ts] | isProductData() | variation.price is not number | variation", variation);
      return false;
    }

    if ("image" in variation && typeof variation.image !== "string") {
      logger.error("[lib/utils.ts] | isProductData() | variation.image is not string | variation", variation);
      return false;
    }

    if (typeof variation.type !== "string" || variation.type === "") {
      logger.error("[lib/utils.ts] | isProductData() | variation.type is not string | variation", variation);
      return false;
    }

    // Check optional disabled property if it exists
    if ("disabled" in variation && typeof variation.disabled !== "boolean") {
      logger.error("[lib/utils.ts] | isProductData() | variation.disabled is not boolean | variation", variation);
      return false;
    }
  }

  return true;
}
