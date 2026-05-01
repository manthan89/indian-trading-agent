import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "sonner";
import "@/app/globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Indian Trading Agent",
  description: "AI-powered multi-agent trading system for Indian markets (v2026-05-01)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
