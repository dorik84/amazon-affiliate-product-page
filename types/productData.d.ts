export interface ProductData {
  title: string;
  description: string;
  variations: VariationData[];
  images: string[];
}

export interface VariationData {
  name: string;
  price: number;
  option: string;
  image: string;
}
