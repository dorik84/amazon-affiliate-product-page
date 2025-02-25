export type ProductData = {
  id: string;
  name: string;
  description: string;
  variations: {
    name: string;
    price: number;
    image: string;
    type: string;
    disabled?: boolean;
  }[];
  images: string[];
  defaultPrice: number;
  url: string;
  category: string;
};

// export type VariationData = {
//   name: string;
//   price: number;
//   image: string;
//   type: string;
//   disabled?: boolean;
// };
