import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurapex Next — Multi-Asset Portfolio Management & AI Advisory",
  description: "Enterprise-grade portfolio management platform with AI-powered wealth intelligence, multi-asset tracking, tax optimization, and institutional-grade analytics for Indian investors.",
  keywords: ["portfolio management", "wealth intelligence", "AI advisory", "tax optimization", "XIRR", "mutual funds", "stocks", "Indian market"],
  authors: [{ name: "Aurapex" }],
  openGraph: {
    title: "Aurapex Next — Wealth Intelligence Platform",
    description: "AI-powered portfolio management for the modern Indian investor",
    type: "website",
  },
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
