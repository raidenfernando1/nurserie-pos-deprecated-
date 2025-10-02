import { Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Listener from "./listener";
import { Toaster } from "sonner";

const MainFont = Geist_Mono({
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
      <body className={`${MainFont.variable} ${MainFont.variable} `}>
        <Listener>
          {children}
          <Toaster />
        </Listener>
      </body>
    </html>
  );
}
