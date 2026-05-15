import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/theme-provider";

import type { Metadata } from "next";
import {
  Manrope,
  Sora,
  Reddit_Sans_Condensed,
  Sofia_Sans_Condensed,
} from "next/font/google";

import { Suspense } from "react";
import { Footer } from "@/components/custom/layout/footer";
import { Header } from "@/components/custom/layout/header";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const redditSansCondensed = Reddit_Sans_Condensed({
  variable: "--font-condensed",
  subsets: ["latin"],
  display: "swap",
});

const sofiaSansCondensed = Sofia_Sans_Condensed({
  variable: "--font-sofia-condensed",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://youeyesea.com"
      : "http://localhost:3000"
  ),
  title: {
    template: "%s | YouEyeSea",
    default: "YouEyeSea - UIC Grade Distributions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sora.variable} ${redditSansCondensed.variable} ${sofiaSansCondensed.variable}`}
      suppressHydrationWarning
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="flex min-h-svh flex-col">
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="relative flex flex-1 md:max-h-[calc(100svh-120px)] md:min-h-[calc(100svh-120px)]">
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
            <Footer />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
