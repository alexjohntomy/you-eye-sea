"use client";

import { usePathname, useRouter } from "next/navigation";

import { useCallback, useState } from "react";

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
import { useSearchParams } from "next/navigation";

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
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const [professorID, setProfessorID] = useState(searchParams.get("professor") ?? "all-professors");
  const handleDropdownChange: any = (value: any) => {
    console.log(value);
    setProfessorID(value);
    router.push(pathname + "?" + createQueryString("professor", value));
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10">
          {professorNameFromID.name}
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Professors</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={professorID}
          onValueChange={handleDropdownChange}
        >
          <DropdownMenuRadioItem value={"all-professors"}>
            All Professors
          </DropdownMenuRadioItem>
          {listOfProfessors.map((item: any) => {
            return (
              <DropdownMenuRadioItem value={item.id} key={item.id}>
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
