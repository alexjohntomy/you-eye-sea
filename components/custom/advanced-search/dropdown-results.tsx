import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/custom/advanced-search/dropdown-list";

import { motion } from "motion/react";

import { Check } from "lucide-react"

interface CommandItem {
  value: string;
  label: string;
}


import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover"

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile"

interface ResultsTypes {
  resultsList: CommandItem[];
  setValueFunction: any;
  setInputFunction: any;
  focusStatus: boolean;
  value: string;
}

function DropdownResults({
  resultsList,
  setValueFunction,
  setInputFunction,
  focusStatus,
  value,
}: ResultsTypes) {

  //Set the selected value, clear the input
  const handleSelect = (value: string) => {
    setValueFunction(value);
    setInputFunction("")
  };

    const [open, setOpen] = useState(true);

    return !useIsMobile() ? (
    focusStatus && (
      <motion.div
        initial={{ opacity: 0, scale: 1, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0, animationDuration: 0.5 }}
        exit={{ opacity: 0, scale: 1, y: -5 }}
        transition={{ ease: "easeInOut" }}
      >
        <CommandList className="bg-background rounded-t-none rounded-b-sm border-t-none border-b border-l border-r border-foreground/10">
          <CommandEmpty></CommandEmpty>
          <CommandGroup className="flex flex-col overflow-scroll">
            {resultsList.map((result, index) => 
            (
              <CommandItem
                className= {index == resultsList.length-1 ? "border-gray-400/30 rounded-b-xs rounded-t-none transition-colors duration-200 ease-ou text-foreground/60" : "border-b border-gray-400/30 rounded-none transition-colors duration-200 ease-out text-foreground/60"}
                key={result.value}
                value={result.value}
                onMouseDown={() => handleSelect(result.value)}
                onTouchStart={() => handleSelect(result.value)}
                onSelect={() => handleSelect(result.value)}
              >
                {result.label}
                <Check className={(result.value === value) ? "opacity-100 ml-auto" : "opacity-0 ml-auto"}/>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </motion.div>
    )
  ) : (
  <Drawer open={focusStatus} onOpenChange={setOpen}>
        <DrawerContent>
        <DrawerTitle className="py-2 text-center">Select from the list</DrawerTitle>
        <CommandList className="bg-background rounded-t-none rounded-b-sm border-t-none border-b border-l border-r border-foreground/10">
          <CommandEmpty></CommandEmpty>
          <CommandGroup className="flex flex-col overflow-scroll">
            {resultsList.map((result, index) => 
            (
              <CommandItem
                className= {index == resultsList.length-1 ? "border-gray-400/30 rounded-b-xs rounded-t-none transition-colors duration-200 ease-ou text-foreground/60" : "border-b border-gray-400/30 rounded-none transition-colors duration-200 ease-out text-foreground/60"}
                key={result.value}
                value={result.value}
                onMouseDown={() => handleSelect(result.value)}
                onTouchStart={() => handleSelect(result.value)}
                onSelect={() => handleSelect(result.value)}
              >
                {result.label}
                <Check className={(result.value === value) ? "opacity-100 ml-auto" : "opacity-0 ml-auto"}/>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        </DrawerContent>
      </Drawer>
      )

  ;
}

export { DropdownResults };
