import "@/app/globals.css";
import type { Metadata } from 'next'

import { Badge } from "@/components/ui/badge"

import {
  SearchBar
} from "@/components/custom/search-bar"

export default function Home() {
  return (
    <div className="flex flex-col items-center align-middle justify-center p-4 w-full">
      <Badge variant="outline" className="relative bottom-2 px-2 py-1 bg-background/70 border-secondary/20 text-uic-navy-700/50">Coming soon...</Badge>
    </div>
);
}
