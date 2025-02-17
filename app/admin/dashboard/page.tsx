"use server";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { getRelatedProducts } from "@/lib/component-actions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Fdashboard");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }
  const products = await getRelatedProducts();

  return <AdminDashboard allProducts={products} />;
}
