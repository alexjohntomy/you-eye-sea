"use client";

import { usePathname, useRouter } from "next/navigation";

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

import { ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface Professor {
  id: string;
  name: string;
}

interface dropdownTypes {
  listOfProfessors: Professor[];
}

function ProfessorDropdown({ listOfProfessors }: dropdownTypes) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const [professorID, setProfessorID] = useState(
    searchParams.get("professor") ?? "all-professors"
  );
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleDropdownChange = (value: string) => {
    if (value === professorID) return;
    setProfessorID(value);
    startTransition(() => {
      router.push(pathname + "?" + createQueryString("professor", value));
    });
  };

  let professorNameFromID: Professor = {
    name: "All Professors",
    id: "all-professors",
  };

  if (professorID == "all-professors" || !professorID) {
    professorNameFromID = { name: "All Professors", id: "all-professors" };
  } else {
    professorNameFromID = listOfProfessors.find(
      (professor) => professor.id === professorID
    ) ?? { name: "All Professors", id: "all-professors" };
  }

  const triggerButton = (
    <Button
      variant="outline"
      className={`h-10 border-foreground/10 shadow-none rounded-xl transition-all duration-300 hover:bg-accent/30 dark:hover:bg-accent/15 dark:hover:text-foreground ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      <span className="truncate max-w-[150px] md:max-w-none">
        {professorNameFromID.name}
      </span>
      {isPending ? <Spinner className="size-4" /> : <ChevronsUpDown className="size-4 opacity-50 shrink-0" />}
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent className="p-4 px-6 pb-12">
          <DrawerHeader className="px-0 pb-4">
            <DrawerTitle className="text-left text-lg font-bold">
              Professors
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[50vh]">
            <Button
              variant={professorID === "all-professors" ? "secondary" : "ghost"}
              className="justify-start h-12 rounded-xl text-md font-medium"
              onClick={() => {
                handleDropdownChange("all-professors");
                setOpen(false);
              }}
            >
              All Professors
            </Button>
            {listOfProfessors.map((item: Professor) => (
              <Button
                key={item.id}
                variant={professorID === item.id ? "secondary" : "ghost"}
                className="justify-start h-12 rounded-xl text-md font-medium"
                onClick={() => {
                  handleDropdownChange(item.id);
                  setOpen(false);
                }}
              >
                {item.name}
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
        className="w-52 shadow-none border-foreground/10 rounded-xl"
      >
        <DropdownMenuLabel>Professors</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={professorID}
          onValueChange={handleDropdownChange}
        >
          <DropdownMenuRadioItem value={"all-professors"} className="rounded-md">
            All Professors
          </DropdownMenuRadioItem>
          {listOfProfessors.map((item: Professor) => {
            return (
              <DropdownMenuRadioItem
                value={item.id}
                key={item.id}
                className="rounded-md"
              >
                {item.name}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ProfessorDropdown };
