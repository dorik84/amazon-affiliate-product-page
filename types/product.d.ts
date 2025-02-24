export interface ProductData {
  name: string;
  description: string;
  variations: VariationData[];
  images: string[];
  defaultPrice: number;
  url: string;
  category?: string;
}

export interface VariationData {
  name: string;
  price: number;
  image: string;
  type: string;
  disabled?: boolean;
}
