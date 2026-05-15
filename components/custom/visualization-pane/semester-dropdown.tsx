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
import { cleanSemesterName } from "@/app/_util/cleanSemesterName";

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

  const label =
    semester === "all-semesters"
      ? "All Semesters"
      : cleanSemesterName(semester);

  const triggerButton = (
    <Button
      variant="outline"
      className={`border-foreground/10 hover:bg-accent/30 dark:hover:bg-accent/15 dark:hover:text-foreground h-10 rounded-xl shadow-none transition-all duration-300 ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      <span className="max-w-[150px] truncate md:max-w-none">{label}</span>
      {isPending ? (
        <Spinner className="size-4" />
      ) : (
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
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
          <div className="flex max-h-[50vh] flex-col gap-1.5 overflow-y-auto">
            <Button
              variant={semester === "all-semesters" ? "secondary" : "ghost"}
              className="text-md h-12 justify-start rounded-xl font-medium"
              onClick={() => {
                handleChange("all-semesters");
                setOpen(false);
              }}
            >
              All Semesters
            </Button>
            {semesters.map((sem) => (
              <Button
                key={sem}
                variant={semester === sem ? "secondary" : "ghost"}
                className="text-md h-12 justify-start rounded-xl font-medium"
                onClick={() => {
                  handleChange(sem);
                  setOpen(false);
                }}
              >
                {cleanSemesterName(sem)}
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
        className="border-foreground/10 w-44 rounded-xl shadow-none"
      >
        <DropdownMenuLabel>Semester</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={semester} onValueChange={handleChange}>
          <DropdownMenuRadioItem value="all-semesters" className="rounded-md">
            All Semesters
          </DropdownMenuRadioItem>
          {semesters.map((semester) => (
            <DropdownMenuRadioItem
              key={semester}
              value={semester}
              className="rounded-md"
            >
              {cleanSemesterName(semester)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { SemesterDropdown };
