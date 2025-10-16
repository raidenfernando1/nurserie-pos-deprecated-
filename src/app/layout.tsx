import { Geist } from "next/font/google";
import "./globals.css";
import React from "react";
import Listener from "./listener";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className={geist.className}>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Listener>
              {children}
              <Toaster />
            </Listener>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
