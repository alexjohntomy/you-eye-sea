import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/theme-provider";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Sora, Reddit_Sans_Condensed, Sofia_Sans_Condensed } from "next/font/google";

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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
    <html lang="en" className={`${manrope.variable} ${sora.variable} ${redditSansCondensed.variable} ${sofiaSansCondensed.variable}`} suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="flex flex-col min-h-svh">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex flex-1 md:min-h-[calc(100svh-120px)] md:max-h-[calc(100svh-120px)] relative">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
