export type UpdateProductResponseBody = {
  message?: string;
  data?: ProductData;
  error?: string;
};

export type AddProductResponseBody = {
  message?: string;
  data?: ProductData;
  error?: string;
};

export type DeleteProductResponseBody = {
  message?: string;
  error?: string;
};

export type GetProductsResponse = {
  data?: ProductData[];
  totalPages?: number;
  currentPage?: number;
  limit?: number;
};
export type GetProductResponse = ProductData | null;

export type GetApiProductsResponse = {
  error?: string;
  data?: ProductData[];
  totalPages?: number;
  currentPage?: number;
  limit?: number;
  status: number;
};

export type GetApiProductResponse = {
  error?: string;
  data?: ProductData;
  status: number;
};
