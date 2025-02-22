export type DeleteProductResponse = {
  message?: string;
  error?: string;
};

// #########################################

export type GetProductsResponse = {
  data: [] | ProductData[];
  totalPages: number;
  currentPage: any;
  limit: any;
};
