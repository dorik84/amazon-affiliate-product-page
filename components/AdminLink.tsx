"use client";

import type React from "react";

import Link from "next/link";
import { useAdminRole } from "@/hooks/use-admin-role";

interface AdminLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminLink({ href, children, className }: AdminLinkProps) {
  const isAdmin = useAdminRole();
  console.log("isAdmin", isAdmin);
  if (!isAdmin) {
    return null;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
