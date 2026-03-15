"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Command, CommandInput } from "@/components/ui/command";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { ResultsPaneMotionComponent } from "@/components/custom/main/results-pane-motion";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Escape to close — window capture fires before Radix's document capture
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [open]);

  const pathname = usePathname();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };

  // Close on navigation
  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [pathname]);


  const searchContent = (
    <Command
      shouldFilter={false}
      className="text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md bg-transparent"
    >
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Search courses..."
        wrapperClassName="h-12 border-b border-foreground/10 px-3 flex items-center gap-2"
      />
      <ResultsPaneMotionComponent
        query={query}
        focusStatus={true}
        onSelect={() => handleOpenChange(false)}
      />
    </Command>
  );

  return (
    <>
      {/* Header trigger — desktop only */}
      {!isMobile && (
        <button
          onClick={() => setOpen(true)}
          className="dark:text-foreground/50 dark:hover:text-foreground/80 dark:bg-foreground/5 dark:hover:bg-foreground/10 dark:border-foreground/10 flex min-w-[400px] cursor-pointer items-center justify-between gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/15 hover:text-white/90"
        >
          <div className="flex items-center gap-2">
            <Search className="size-3.5 shrink-0" />
            <span className="text-sm">Search courses...</span>
          </div>
          <kbd className="dark:border-foreground/15 dark:bg-foreground/5 pointer-events-none inline-flex items-center gap-0.5 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-xs select-none">
            <span>⌘</span>K
          </kbd>
        </button>
      )}

      {/* FAB — mobile only */}
      {isMobile && (
        <button
          onClick={() => setOpen(true)}
          className="bg-uic-navy-900 dark:bg-foreground/10 dark:border-foreground/10 fixed right-6 bottom-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/10 shadow-xl"
          aria-label="Search courses"
        >
          <Search className="dark:text-foreground size-5 text-white" />
        </button>
      )}

      {/* Dialog — manually composed to control overlay opacity separately */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogPortal>
          {/* Lighter overlay so background colours bleed through the glass */}
          <DialogOverlay className="bg-black/50" />
          <DialogPrimitive.Content
            className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-[min(560px,calc(100vw-2rem))] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl border border-white/30 bg-background/95 shadow-2xl backdrop-blur-3xl backdrop-saturate-200 duration-100 dark:border-white/15 dark:bg-zinc-900/90 dark:text-foreground"
          >
            <span className="sr-only">
              <DialogPrimitive.Title>Search</DialogPrimitive.Title>
              <DialogPrimitive.Description>
                Search for UIC courses
              </DialogPrimitive.Description>
            </span>
            {searchContent}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
}

export { GlobalSearch };
