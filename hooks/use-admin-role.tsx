import { useSession } from "next-auth/react";

export function useAdminRole() {
  const { data: session } = useSession();
  return session?.user?.role === "ADMIN";
}
