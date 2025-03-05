"use server";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { getProducts } from "@/lib/component-actions";
import { sendGTMEvent } from "@next/third-parties/google";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Fdashboard");
  }
  if (session.user.role !== "ADMIN") {
    sendGTMEvent({
      event: "unauthorized_access",
      email: session?.user?.email || "",
      name: session?.user?.name || "",
    });
    redirect("/unauthorized");
  }
  const response = await getProducts();

  return <AdminDashboard allProducts={response} />;
}
