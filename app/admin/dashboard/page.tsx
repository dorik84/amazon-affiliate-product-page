"use server";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { getProducts } from "@/lib/component-actions";
import { sendGAEvent } from "@/lib/analytics";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Fdashboard");
  }
  if (session.user.role !== "ADMIN") {
    sendGAEvent("Unauthorized access", "unauthorized-access", "admin/dashboard", session?.user?.name || "");
    redirect("/unauthorized");
  }
  const response = await getProducts();

  return <AdminDashboard allProducts={response} />;
}
