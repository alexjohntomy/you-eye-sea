"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import { AnimatePresence, motion } from "motion/react";

import { Command, CommandInput } from "@/components/ui/command";

import { ResultsPaneMotionComponent } from "./results-pane-motion";
import { useWebHaptics } from "web-haptics/react";

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
          <h4 className="text-foreground/70 text-sm font-medium text-wrap">
            {placeholderArray.at(count % 3)}
          </h4>
        </motion.div>
      </AnimatePresence>
    );
  } else {
    return null;
  }
}

function SearchBar({ enableHaptics = false }: { enableHaptics?: boolean } = {}) {
  const [value, setValue] = useState("");
  const [commandValue, setCommandValue] = useState("-");
  const isMobile = useIsMobile();
  const { trigger } = useWebHaptics({ showSwitch: enableHaptics });

  return (
    <div className="md:max-1/2 mx-auto max-w-1/4 min-w-3/4 md:min-w-1/2">
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
            value={commandValue}
            onValueChange={setCommandValue}
            shouldFilter={false}
            className="dark:bg-background text-foreground rounded-none bg-background py-[0.5] opacity-95"
          >
            <motion.div layout="position">
              <div className="justify-between-safe relative flex flex-wrap items-center gap-4 p-2">
                <div className="pointer-events-none absolute right-0 left-12">
                  <PlaceholderText query={value} />
                </div>
                <CommandInput
                  placeholder=""
                  autoFocus={!isMobile}
                  onValueChange={(val) => {
                    setValue(val);
                    if (enableHaptics && val !== value) {
                      trigger("nudge");
                    }
                  }}
                  wrapperClassName="flex flex-1 gap-3 border-b-0 items-center"
                  className="w-full text-lg"
                ></CommandInput>
              </div>
              <ResultsPaneMotionComponent
                query={value}
                focusStatus={true}
                onResetHover={() => setCommandValue("-")}
              />
            </motion.div>
          </Command>
        </motion.div>
      </motion.div>
    </div>
  );
}

export { SearchBar };
