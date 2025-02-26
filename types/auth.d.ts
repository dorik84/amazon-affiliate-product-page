import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "ADMIN" | "USER";
    // Add any additional fields you want to store
    email?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: "ADMIN" | "USER";
    };
  }
}

// Extend the default JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "USER";
    id: string;
  }
}
