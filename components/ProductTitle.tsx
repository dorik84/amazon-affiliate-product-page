import { ProductData } from "@/types/productData";

export default function ProductTitle({ product }: { product: ProductData | undefined }) {
  return <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center">{product?.name}</h1>;
}
