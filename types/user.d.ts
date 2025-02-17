import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    // Add any additional fields you want to store
    email?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role?: string;
    };
  }
}

// Extend the default JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
