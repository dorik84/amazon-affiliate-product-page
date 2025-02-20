import { getProducts } from "@/lib/component-actions";
import RelatedProducts from "@/components/RelatedProducts";

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
