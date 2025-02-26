import { ProductData } from "@/types/product";

export type ApiResponse = {
  error?: string;
  message?: string;
  data?: ProductData;
};

export type ProductsResponse = {
  error?: string;
  data?: [] | ProductData[];
  totalPages?: number;
  currentPage?: number;
  limit?: number;
};
