import "@/app/globals.css";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

import { SearchBar } from "@/components/custom/main/search-bar";

export const metadata: Metadata = {
  title: "YouEyeSea - UIC Grade Distributions",
  description:
    "Get grade distribution data, tips from former students, and cohort GPAs for any course at University of Illinois at Chicago (UIC).",
};

export default function Home() {
  return (
    <div className="animate-in fade-in flex min-h-[calc(100svh-4rem)] w-full flex-col px-1 py-1 duration-700 md:min-h-full md:justify-center">
      {/* Hero Text */}
      <div className="mt-4.5 mb-3 flex flex-col items-center md:mt-10 md:mb-6 md:gap-2">
        <Badge
          variant="outline"
          className="bg-background/70 border-uic-navy-700/20 dark:border-secondary/20 text-uic-navy-700/70 dark:text-uic-navy-700/50 relative bottom-2 flex px-2 py-1 md:inline-flex"
        >
          Fall 2026 Registration Now Open
        </Badge>
        <h1 className="bg-text-gradient-uic bg-clip-text px-5 pt-0 pb-0 text-center text-2xl font-black text-transparent text-shadow-[0px_0px_0px_20px_var(--inset-color)] md:text-5xl">
          Find Your Next Class<span className="hidden md:inline"> Today</span>
        </h1>
        <h2 className="text-l text-uic-navy-800 px-10 text-center font-semibold opacity-80 md:text-xl">
          <span className="md:hidden">Grade distributions, tips, and more</span>
          <span className="hidden md:inline">
            Get detailed grade distribution data, tips, and more...
          </span>
        </h2>
      </div>
      {/* Search Bar */}
      <div className="min-h-96">
        <SearchBar />
      </div>
      <div className="bg-gradient-uic absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[30px_30px]"></div>
    </div>
  );
}
