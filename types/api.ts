import { NextResponse } from "next/server";
import { ProductData } from "@/types/product";

export type SuccessApiResponse = {
  message: string;
  data: ProductData;
};

export type ApiResponse = {
  error?: string;
  message?: string;
  data?: ProductData;
};

export type DeleteApiResponse = {
  message?: string;
  deletedCount?: number;
  error?: string;
};

export type GetProductResponse = NextResponse<ApiResponse>;
export type PostProductResponse = NextResponse<ApiResponse>;
export type PutProductResponse = NextResponse<ApiResponse>;
export type DeleteProductResponse = NextResponse<DeleteApiResponse>;

export type ProductsResponse = {
  error?: string;
  data?: [] | ProductData[];
  totalPages?: number;
  currentPage?: number;
  limit?: number;
};
