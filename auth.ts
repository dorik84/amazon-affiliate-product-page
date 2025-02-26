import NextAuth, { User, NextAuthOptions } from "next-auth";
import "next-auth/jwt";
import jwt from "jsonwebtoken";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import clientPromise from "./db/mongodb";

import prisma from "@/db/prisma";
const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
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
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  // adapter: MongoDBAdapter(clientPromise),
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
  // Configure token generation
  jwt: {
    // Use a custom encode/decode if needed
    async encode({ secret, token }) {
      // console.log("Encoding token:", token);
      return jwt.sign(token, secret, {
        algorithm: "HS256",
      });
    },
    async decode({ secret, token }) {
      // console.log("Decoding token:", token);
      return jwt.verify(token, secret);
    },
  },
} satisfies NextAuthOptions;

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
