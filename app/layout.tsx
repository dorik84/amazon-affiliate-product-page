import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import AffiliateMessage from "@/components/AffiliateMessage";
import ThemeToggle from "@/components/ThemeToggle";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "sonner";

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

        <Toaster
          richColors
          closeButton
          expand={true}
          pauseWhenPageIsHidden={true}
          className="toaster-container"
          toastOptions={{
            classNames: {
              toast: "border rounded-lg shadow-lg",
              title: "font-bold",
              description: "text-sm",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-muted text-muted-foreground",
            },
          }}
        />
      </body>
    </html>
  );
}
