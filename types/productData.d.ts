export interface ProductData {
  title: string;
  description: string;
  variations: VariationData[];
  images: string[];
}

export interface VariationData {
  name: string;
  price: number;
  image: string;
  type: string;
}
