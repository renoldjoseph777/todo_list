import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarNav } from "@/components/sidebar-nav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Trading Platform",
  description: "Advanced trading platform with integrated tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarNav />
        <div className="pl-16 md:pl-64 min-h-screen bg-[#f5f5f5]">
          {children}
        </div>
      </body>
    </html>
  );
}
