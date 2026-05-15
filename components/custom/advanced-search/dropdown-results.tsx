import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/custom/advanced-search/dropdown-list";
import { Button } from "@/components/ui/button";

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

import React from "react";

interface ResultsTypes {
  resultsList: CommandItem[];
  setValueFunction: React.Dispatch<React.SetStateAction<string>>;
  setInputFunction: React.Dispatch<React.SetStateAction<string>>;
  focusStatus: boolean;
  setFocusStatus: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
}

function DropdownResults({
  resultsList,
  setValueFunction,
  setInputFunction,
  focusStatus,
  setFocusStatus,
  value,
}: ResultsTypes) {

  //Set the selected value, clear the input
  const handleSelect = (value: string) => {
    setValueFunction(value);
    setInputFunction("")
    setFocusStatus(false)
  };

    return !useIsMobile() ? (
    focusStatus && (
      <motion.div
        initial={{ opacity: 0, scale: 1, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0, animationDuration: 0.25 }}
        exit={{ opacity: 0, scale: 1, y: -5 }}
        transition={{ ease: "easeInOut" }}
      >
        <CommandList className="bg-background rounded-t-none rounded-b-xl border-t-none border-b border-l border-r border-foreground/10">
          <CommandEmpty></CommandEmpty>
          <CommandGroup className="flex flex-col overflow-scroll p-1 gap-0.5">
            {resultsList.map((result, index) => 
            (
              <CommandItem
                className="rounded-md transition-colors duration-200 ease-out text-foreground/70 dark:data-[selected=true]:bg-blue-500/12 dark:data-[selected=true]:text-blue-100"
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
  <Drawer open={focusStatus} onOpenChange={setFocusStatus}>
        <DrawerContent className="p-4 px-6 pb-12">
        <DrawerTitle className="px-0 pb-4 text-left text-lg font-bold">Select from the list</DrawerTitle>
          <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[50vh]">
            {resultsList.map((result, index) => 
            (
              <Button
                variant={result.value === value ? "secondary" : "ghost"}
                className="justify-start h-12 rounded-xl text-md font-medium"
                key={result.value}
                onClick={() => handleSelect(result.value)}
              >
                {result.label}
                <Check className={(result.value === value) ? "opacity-100 ml-auto" : "opacity-0 ml-auto"}/>
              </Button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
      )

  ;
}

export { DropdownResults };
