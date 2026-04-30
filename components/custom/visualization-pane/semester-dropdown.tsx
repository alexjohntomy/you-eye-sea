"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";

interface SemesterDropdownProps {
  semesters: string[];
}

function SemesterDropdown({ semesters }: SemesterDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const [semester, setSemester] = useState(
    searchParams.get("semester") ?? "all-semesters"
  );

  const handleChange = (value: string) => {
    if (value === semester) return;
    setSemester(value);
    startTransition(() => {
      router.push(pathname + "?" + createQueryString("semester", value));
    });
  };

  const label = semester === "all-semesters" ? "All Semesters" : semester;

  const triggerButton = (
    <Button
      variant="outline"
      className={`h-10 border-foreground/10 shadow-none rounded-xl transition-all duration-300 hover:bg-accent/30 dark:hover:bg-accent/15 ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      <span className="truncate max-w-[150px] md:max-w-none">{label}</span>
      {isPending ? (
        <Spinner className="size-4" />
      ) : (
        <ChevronsUpDown className="size-4 opacity-50 shrink-0" />
      )}
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent className="p-4 px-6 pb-12">
          <DrawerHeader className="px-0 pb-4">
            <DrawerTitle className="text-left text-lg font-bold">
              Semester
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[50vh]">
            <Button
              variant={semester === "all-semesters" ? "secondary" : "ghost"}
              className="justify-start h-12 rounded-xl text-md font-medium"
              onClick={() => { handleChange("all-semesters"); setOpen(false); }}
            >
              All Semesters
            </Button>
            {semesters.map((s) => (
              <Button
                key={s}
                variant={semester === s ? "secondary" : "ghost"}
                className="justify-start h-12 rounded-xl text-md font-medium"
                onClick={() => { handleChange(s); setOpen(false); }}
              >
                {s}
              </Button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 shadow-none border-foreground/10 rounded-xl"
      >
        <DropdownMenuLabel>Semester</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={semester} onValueChange={handleChange}>
          <DropdownMenuRadioItem value="all-semesters" className="rounded-md">
            All Semesters
          </DropdownMenuRadioItem>
          {semesters.map((s) => (
            <DropdownMenuRadioItem key={s} value={s} className="rounded-md">
              {s}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { SemesterDropdown };
