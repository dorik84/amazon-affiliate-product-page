import { getRelatedProducts } from "@/lib/component-actions";
import ProductCard from "./ProductCard";

export default async function RelatedProductsWidget() {
  const relatedProducts = await getRelatedProducts();

  return (
    <div className="w-full overflow-x-auto pb-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Related Products</h2>
      <div className="flex space-x-3 sm:space-x-4">
        {relatedProducts?.map((product) => (
          <ProductCard key={product.url} product={product} />
        ))}
      </div>
    </div>
  );
}
