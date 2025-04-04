import "next-auth/jwt";

import NextAuth, { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/db/prisma";

const GITHUB_ID = process.env.GIT_HUB_ID;
const GITHUB_SECRET = process.env.GIT_HUB_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!GITHUB_ID) {
  throw new Error("Please define the GITHUB_ID environment variable inside .env.local");
}
if (!GITHUB_SECRET) {
  throw new Error("Please define the GITHUB_SECRET environment variable inside .env.local");
}

if (!NEXTAUTH_SECRET) {
  throw new Error("Please define the NEXTAUTH_SECRET environment variable inside .env.local");
}

export const authOptions = {
  debug: true,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },

  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
  secret: NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthOptions;

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
