export type UpdateProductResponseBody = {
  message?: string;
  data?: ProductData;
  error?: string;
};

export type DeleteProductResponseBody = {
  message?: string;
  error?: string;
};

export type getProductsResponse = {
  data?: ProductData[];
  totalPages?: number;
  currentPage?: number;
  limit?: number;
};
