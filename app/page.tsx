import "@/app/globals.css";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

import { SearchBar } from "@/components/custom/search-bar";

export const metadata: Metadata = {
  title: "YouEyeSea - UIC Grade Distributions",
  description:
    "Get grade distribution data, tips from former students, and cohort GPAs for any course at University of Illinois at Chicago (UIC).",
};

export default function Home() {
  return (
    <div className="flex flex-col p-4 w-full justify-center min-h-full">
      {/* Hero Text */}
      <div className="flex flex-col items-center mt-10">
        <Badge
          variant="outline"
          className="relative bottom-2 px-2 py-1 bg-background/70 border-secondary/20 text-uic-navy-700/50"
        >
          Spring 2026 Registration Open Now
        </Badge>
        <h1 className="font-black text-4xl md:text-5xl py-2 text-center text-transparent bg-text-gradient-uic bg-clip-text text-shadow-[0px_0px_0px_20px_var(--inset-color)]">
          Find Your Next Class Today
        </h1>
        <h2 className="font-semibold text-l md:text-xl text-center text-uic-navy-800 opacity-80">
          Get detailed grade distribution data, tips, and more...
        </h2>
        <br />
      </div>
      {/* Search Bar */}
      <div className="min-h-96">
        <SearchBar></SearchBar>
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-uic" />
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:30px_30px]"></div>
    </div>
  );
}
