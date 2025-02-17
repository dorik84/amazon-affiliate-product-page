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

// import { createStorage } from "unstorage"
// import memoryDriver from "unstorage/drivers/memory"
// import vercelKVDriver from "unstorage/drivers/vercel-kv"
// import { UnstorageAdapter } from "@auth/unstorage-adapter"

// const storage = createStorage({
//   driver: process.env.VERCEL
//     ? vercelKVDriver({
//         url: process.env.AUTH_KV_REST_API_URL,
//         token: process.env.AUTH_KV_REST_API_TOKEN,
//         env: false,
//       })
//     : memoryDriver(),
// })

export const authOptions = {
  // debug: !!process.env.AUTH_DEBUG,
  // theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  //   adapter: UnstorageAdapter(storage),
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    async session({ session, user }) {
      // Add custom fields to the session
      session.user.id = user.id;
      session.user.role = user.role || "user";

      return session;
    },
  },
  // pages: {
  //   signIn: "/auth/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error",
  // },
  //   experimental: { enableWebAuthn: true },
};

// ###############################
// import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";

// const GITHUB_ID = process.env.GITHUB_ID;
// const GITHUB_SECRET = process.env.GITHUB_SECRET;

// if (!GITHUB_ID) {
//   throw new Error("Please define the GITHUB_ID environment variable inside .env.local");
// }
// if (!GITHUB_SECRET) {
//   throw new Error("Please define the GITHUB_SECRET environment variable inside .env.local");
// }

// export const authOptions = {
//   // Configure one or more authentication providers
//   providers: [
//     GithubProvider({
//       clientId: GITHUB_ID,
//       clientSecret: GITHUB_SECRET,
//     }),
//     // ...add more providers here
//   ],
// };

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
