import { ProductData } from "@/types/product";
import prisma from "@/db/prisma";

// Create a new product
export async function createProduct(
  productData: Omit<ProductData, "id" | "createdAt" | "updatedAt">
): Promise<ProductData> {
  const product = await prisma.product.create({
    data: productData,
  });
  return product;
}

// Get all products with pagination and optional category filter
export async function getAllProducts(
  limit: number,
  page: number,
  category?: string
): Promise<{ data: ProductData[]; totalPages: number; currentPage: number; limit: number }> {
  const where = category ? { category } : {};
  const products = await prisma.product.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
  });

  const count = await prisma.product.count({ where });

  return {
    data: products,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    limit,
  };
}

// Get a single product by ID
export async function getProductById(id: string): Promise<ProductData | null> {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
}

// Update a product
export async function updateProduct(id: string, productData: Partial<ProductData>): Promise<ProductData> {
  const product = await prisma.product.update({
    where: { id },
    data: productData,
  });
  return product;
}

// Delete a product
export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({
    where: { id },
  });
}
