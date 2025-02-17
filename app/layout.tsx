import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import AffiliateMessage from "@/components/AffiliateMessage";
import ThemeToggle from "@/components/ThemeToggle";
// import { SessionProvider } from "next-auth/react";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Best Choice Goods",
  description: "The best choice goods for you",
};

export default function RootLayout({ children, session }: { children: React.ReactNode; session: any }) {
  // export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={`${inter.className} bg-custom-radial bg-custom-size bg-fixed`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider session={session}>
            <div className="flex justify-between items-center mb-4 px-4 gap-4 sm:mb-6">
              <AffiliateMessage />
              <ThemeToggle />
            </div>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
