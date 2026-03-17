import "@/app/globals.css";
import type { Metadata } from "next";

import { DropdownSearchBar } from "@/components/custom/advanced-search/dropdown-search-bar";
import { FilteredDataTableServer } from "@/components/custom/data-table/filtered-data-table-server";
import { PresetButtons } from "./preset-buttons";

export const metadata: Metadata = {
  title: "YouEyeSea - Explore",
  description:
    "Apply fine-grain filters and sorts to grade distribution data at UIC.",
};

export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const filteredParams = await searchParams;
  return (
    <div className="flex flex-col p-4 w-full justify-start min-h-full overflow-y-hidden animate-in fade-in duration-700">
      {/* Hero Text */}
      <div className="flex flex-col items-center gap-0">
        <h1 className="font-black text-2xl md:text-3xl py-5 text-center text-transparent bg-text-gradient-uic bg-clip-text text-shadow-[0px_0px_0px_20px_var(--inset-color)]">
          Explore
        </h1>
        <PresetButtons />
      </div>
      <div className="flex flex-col gap-2">
        {/* Search Bar */}
        <div className="flex flex-row w-full items-start justify-center">
          <DropdownSearchBar></DropdownSearchBar>
        </div>

        {/* Table */}
        <div className="flex">
          <FilteredDataTableServer subject={filteredParams.subject} sortType={filteredParams.sort} level={filteredParams.level}></FilteredDataTableServer>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-uic-navy" />
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:30px_30px]"></div>
    </div>
  );
}
