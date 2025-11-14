"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { Command, CommandInput } from "@/components/ui/command";

import { ResultsPaneMotionComponent } from "./results-pane-motion";

const placeholderArray = [
  "Search for a course...",
  "Search for a title...",
  "Search for a professor...",
];

interface testProps {
  query: string;
}

function PlaceholderText({ query }: testProps) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [query]);

  if (query.length == 0) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ opacity: 0, scale: 1, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0, animationDuration: 0.5 }}
          exit={{ opacity: 0, scale: 1, y: -5 }}
          transition={{ ease: "easeInOut" }}
        >
          <h4 className="text-sm text-wrap font-medium text-foreground/70">
            {placeholderArray.at(count % 3)}
          </h4>
        </motion.div>
      </AnimatePresence>
    );
  } else {
    return null;
  }
}

function SearchBar() {
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(true);
  const handleOnFocus = () => {
    setFocus(true);
  };
  const handleOnBlur = () => {
    setFocus(true);
  };

  return (
    <div className="mx-auto min-w-3/4 md:min-w-1/2 md:max-1/2 max-w-1/4">
      <motion.div
        layout
        style={{
          borderRadius: 16,
          padding: 2,
          background:
            "color-mix(in oklch, var(--color-uic-red-300) 30%, transparent)",
        }}
      >
        <motion.div
          layout
          style={{
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <Command
            defaultValue={"-"}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            shouldFilter={false}
            className="py-[0.5] rounded-none bg-background text-foreground opacity-90"
          >
            <motion.div layout="position">
              <div className="flex items-center p-2 justify-between-safe gap-4 flex-wrap relative">
                <div className="pointer-events-none absolute left-12 right-0">
                  <PlaceholderText query={value} />
                </div>
                <CommandInput
                  placeholder=""
                  onValueChange={setValue}
                  wrapperClassName="flex flex-1 gap-3 border-b-0 items-center"
                  className="w-full text-lg"
                ></CommandInput>
              </div>
              <ResultsPaneMotionComponent query={value} focusStatus={focus} />
            </motion.div>
          </Command>
        </motion.div>
      </motion.div>
    </div>
  );
}

export { SearchBar };
