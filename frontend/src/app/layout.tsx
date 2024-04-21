"use client";
import "./globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { Inter as FontSans } from "next/font/google";
import { WagmiProvider } from "wagmi";

import { BackgroundGradients } from "@/components/BackgroundGradients";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/data/queryClient";
import { cn } from "@/lib/utils";
import { wagmiConfig } from "@/lib/wagmiConfig";

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
              <Toaster />
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
