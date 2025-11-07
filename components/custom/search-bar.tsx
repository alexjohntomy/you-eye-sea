"use client"

import { useState, useEffect } from "react"

import { motion, AnimatePresence, LayoutGroup, easeInOut } from "motion/react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import { ChevronDownIcon, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { ResultsPane } from "./results-pane"
import { ResultsPaneMotionComponent } from "./results-pane-motion"

const placeholderArray = ["Search for a course...", "Search for a title...", "Search for a professor..."]

interface testProps {
    query: string;
}

function PlaceholderText({query} : testProps) {

  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 2000);
    return () => {
        clearInterval(interval)
    }
  }, [query]);

  if (query.length == 0) {
    return (
      <AnimatePresence mode = "wait">
        <motion.div
          key={count}
          initial={{ opacity: 0, scale: 1, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0, animationDuration: .5}}
          exit={{ opacity: 0, scale: 1, y: -5}}
          transition={{ease: "easeInOut"}}
          >
          <h4 className="text-sm text-wrap font-medium text-foreground/50">{placeholderArray.at(count%3)}</h4>
        </motion.div>
      </AnimatePresence>
    )}
  else {
    return (null)
  }
}

const MotionComponent = motion.create('ResultsPane')

function SearchBar() {
  const [value, setValue] = useState('')
  return (
    // <LayoutGroup>
    <div className="mx-auto min-w-1/2 md:min-w-1/2">
        <Command shouldFilter={false} className="rounded-2xl inset-shadow-2xs shadow-[0px_8px_16px_-2px_var(--shadow-inset-color)] shadow-shadow-color border-uic-red-300/40 double-border border-2 bg-background text-foreground opacity-90">
          <div className="flex items-center p-2 justify-between-safe gap-4 flex-wrap relative">
              <div className="pointer-events-none absolute left-12 right-30">
                  <PlaceholderText query={value}/>
              </div>
              <CommandInput onValueChange={setValue} wrapperClassName="flex flex-1 gap-3 border-b-0 items-center" className="w-full"></CommandInput>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost" className="w-fit h-10 text-xs items-center">
                All Semesters <ChevronDownIcon className="size-3" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="[--radius:0.95rem]">
              <DropdownMenuItem>All Time</DropdownMenuItem>
              <DropdownMenuItem>Spring 2025</DropdownMenuItem>
              <DropdownMenuItem>Summer 2025</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          </div>
              {/* <ResultsPane query={value}/> */}
              <ResultsPaneMotionComponent query={value}/>
          </Command>
      </div>
      // </LayoutGroup>
)}

export {SearchBar}