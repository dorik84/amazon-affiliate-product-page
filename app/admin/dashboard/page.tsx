"use server";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";

import { getProductsResponse } from "@/types/responses";
import { getProducts } from "@/lib/component-actions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Fdashboard");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }
  const response: getProductsResponse = await getProducts();

  return <AdminDashboard allProducts={response} />;
}
