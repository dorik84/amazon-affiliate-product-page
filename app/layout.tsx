import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Wireless Headphones",
  description: "Experience crystal-clear audio with our premium wireless headphones.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-custom-radial bg-custom-size bg-fixed`}>
        {/* <div className="bg-custom-radial bg-custom-size inset-0 "> */}
        {/* <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div> */}

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        {/* </div> */}
      </body>
    </html>
  );
}
