import RelatedProducts from "@/components/RelatedProducts";
import { getProducts } from "@/lib/component-actions";

export const preloadRelatedProducts = (category: string | undefined) => {
  const query = `category=${encodeURIComponent(category || "")}`;
  return getProducts(query);
};

export default async function RelatedProductsPage({ category }: { category: string | undefined }) {
  const response = await preloadRelatedProducts(category);
  if (!response.data) {
    return null;
  }
  return <RelatedProducts relatedProducts={response.data} />;
}
