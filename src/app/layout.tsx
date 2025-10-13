import { Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Listener from "./listener";
import { Toaster } from "sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const MainFont = Geist_Mono({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${MainFont.variable} ${MainFont.variable} `}>
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
  );
}
