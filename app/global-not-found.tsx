// Import global styles and fonts
import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export default function GlobalNotFound() {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <div className="flex flex-col h-screen justify-center items-center text-primary gap-3">
          <h1 className="font-bold text-2xl">404 - Page Not Found! :(</h1>
          <a
            href="/"
            className="opacity-80 rounded-lg bg-primary text-background p-3 hover:opacity-100 hover:text-background font-semibold"
          >
            Go back home?
          </a>
        </div>
      </body>
    </html>
  );
}
