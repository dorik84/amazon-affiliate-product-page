import NextAuth, { User } from "next-auth";
import "next-auth/jwt";
import { Session } from "next-auth";

import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./db/auth-db";

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;

if (!GITHUB_ID) {
  throw new Error("Please define the GITHUB_ID environment variable inside .env.local");
}
if (!GITHUB_SECRET) {
  throw new Error("Please define the GITHUB_SECRET environment variable inside .env.local");
}

export const authOptions = {
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
      }
      if (account?.provider === "github") {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, user, token }) {
      console.log("token", token);
      if (token) {
        session.user.role = token.role;
        session.user.id = token.sub;
        session.accessToken = token.accessToken;
      }
      console.log("session", session);
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
