import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/custom/dropdown-list";

import { motion } from "motion/react";

interface CommandItem {
  value: string;
  label: string;
}

import { useState } from "react";

interface ResultsTypes {
  resultsList: CommandItem[];
  setValueFunction: any;
  focusStatus: boolean;
}

function DropdownResults({
  resultsList,
  setValueFunction,
  focusStatus,
}: ResultsTypes) {
  const [open, setOpen] = useState(false);
  const handleSelect = (value: string) => {
    setValueFunction(value);
    setOpen(false);
  };
  return (
    focusStatus && (
      <motion.div
        initial={{ opacity: 0, scale: 1, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0, animationDuration: 0.5 }}
        exit={{ opacity: 0, scale: 1, y: -5 }}
        transition={{ ease: "easeInOut" }}
      >
        <CommandList className="bg-background rounded-t-none rounded-b-sm border-t-none border-b border-l border-r border-uic-red-300/40 relative">
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
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </motion.div>
    )
  );
}

export { DropdownResults };
