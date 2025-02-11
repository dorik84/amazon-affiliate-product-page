import { ProductData, VariationData } from "@/types/productData";
import { Schema, model, models, Document } from "mongoose";

const variationSchema = new Schema<VariationData>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  type: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});

const productSchema = new Schema<ProductData>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    variations: { type: [variationSchema], required: true }, // Using the sub-schema for variations
    images: { type: [String], required: true }, // Array of strings for images
    defaultPrice: { type: Number, required: true },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model<ProductData>("Product", productSchema);

export default Product;
