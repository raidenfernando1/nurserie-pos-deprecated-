"use client";

import { DM_Sans } from "next/font/google";
import "./globals.css";

const MainFont = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${MainFont.variable} ${MainFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
