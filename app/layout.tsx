import { ThemeProvider } from "@/components/theme-provider"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Manrope } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/custom/header"
import { Footer } from "@/components/custom/footer"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ['latin'],
  display: 'swap',
})

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
    template: '%s | YouEyeSea',
    default: "YouEyeSea",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header/>
              <main className="flex flex-1 min-h-[calc(100svh-120px)] max-h-[calc(100svh-120px)] relative">
                  {children}
              </main>
            <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
