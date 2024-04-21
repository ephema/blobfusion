"use client";
import { Inter as FontSans } from "next/font/google";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/components/ThemeProvider";
import { BackgroundGradients } from "@/components/BackgroundGradients";

import { queryClient } from "@/data/queryClient";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>BlobFusion</title>
      </head>
      <body
        className={cn(
          "dark:dark min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <section className="dark relative overflow-hidden">
                <BackgroundGradients />
                <div className="mx-auto min-h-screen p-8 md:max-w-3xl">
                  {children}
                </div>
              </section>
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
