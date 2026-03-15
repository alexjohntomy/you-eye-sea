"use client";

import { Command, CommandInput } from "@/components/custom/advanced-search/dropdown-list";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import subjectList from "@/subjectList";

import { DropdownResults } from "./dropdown-results";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PopoverAnchor } from "@radix-ui/react-popover";

interface DropdownValueType {
  value: string
  label: string
}

function DropdownSearchBar() {
  //Make Subject Dropdown
  const subjects = subjectList.map(item => 
  {
    const subjectObject : DropdownValueType = {
      value: item,
      label: item
    }
    
    return subjectObject
  })
  subjects.unshift({value: "all", label: "All Subjects"})

  //Make Sort Types Dropdown
  const sortTypes = [
    {
      value: "gpa",
      label: "By GPA",
    },
    {
      value: "dropRate",
      label: "By Drop Rate",
    },
    {
      value: "passRate",
      label: "By Pass Rate",
    },
    {
      value: "totalStudents",
      label: "By Total Students",
    },
  ];

  //Make Levels Dropdown
  const levels = [
    {
      value: "all",
      label: "All Levels",
    },
    {
      value: "100",
      label: "100",
    },
    {
      value: "200",
      label: "200",
    },
    {
      value: "300",
      label: "300",
    },
    {
      value: "400",
      label: "400",
    },
  ];

  // Keeps track of focus
  const [focusOne, setFocusOne] = useState(false);
  const [focusTwo, setFocusTwo] = useState(false);
  const [focusThree, setFocusThree] = useState(false);

  // Keeps track of the actual selected value
  const [valueOne, setValueOne] = useState("all");
  const [valueTwo, setValueTwo] = useState("gpa");
  const [valueThree, setValueThree] = useState("all");

  // Keeps track of what's been typed
  const [inputOne, setInputOne] = useState("");
  const [inputTwo, setInputTwo] = useState("");
  const [inputThree, setInputThree] = useState("");
  
  const subjectPlaceholder = (subjects.find((obj) => obj.value === valueOne)?? {value: undefined, label: "None Selected"}).label;
  const sortTypePlaceholder = (sortTypes.find((obj) => obj.value === valueTwo)?? {value: undefined, label: "None Selected"}).label;
  const levelPlaceholder = (levels.find((obj) => obj.value === valueThree) ?? {value: undefined, label: "None Selected"}).label;

  //Append search params when button is clicked
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("subject", valueOne);
      params.set("sort", valueTwo);
      params.set("level", valueThree);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex justify-between md:w-3/4 bg-background dark:bg-card py-4 md:py-8 rounded-xl gap-5 border border-foreground/10 shadow-none md:max-h-20 relative md:items-start opacity-100">
      <div className="flex flex-col md:flex-row w-full gap-5 justify-center relative md:-top-5 px-2">
      <Command className="rounded-sm bg-background dark:bg-card md:w-1/4">
        <p className="text-xs px-3 tracking-wide opacity-50">SUBJECT</p>
          <Popover open={focusOne}>
          <PopoverAnchor asChild>
          <CommandInput
            placeholder={subjectPlaceholder}
            className="relative font-semibold text-base"
            wrapperClassName="flex flex-row w-full"
            onValueChange={setInputOne}
            onFocus={() => setFocusOne(true)}
            onBlur={() => setFocusOne(false)}
            value={inputOne}
          />
          </PopoverAnchor>
          <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}         // don’t steal focus from input
          onCloseAutoFocus={(e) => e.preventDefault()}        // don’t force focus back
          side="bottom"
          align="start"
          avoidCollisions={false}
          sideOffset={-2}
          alignOffset={-10}
          className="w-55 p-0 border-0 rounded-b-lg"
          >
          <DropdownResults
            resultsList={subjects}
            setValueFunction={setValueOne}
            setInputFunction={setInputOne}
            focusStatus={focusOne}
            value={valueOne}
          ></DropdownResults>
          </PopoverContent>
        </Popover>
      </Command>

<Command className="rounded-sm bg-background dark:bg-card md:w-1/4">
        <p className="text-xs px-3 tracking-wide opacity-50">LEVEL</p>
          <Popover open={focusThree}>
          <PopoverAnchor asChild>
          <CommandInput
            placeholder={levelPlaceholder}
            className="relative font-semibold text-base"
            wrapperClassName="flex flex-row w-full"
            onValueChange={setInputThree}
            onFocus={() => setFocusThree(true)}
            onBlur={() => setFocusThree(false)}
            value={inputThree}
          />
          </PopoverAnchor>
          <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}         // don’t steal focus from input
          onCloseAutoFocus={(e) => e.preventDefault()}        // don’t force focus back
          side="bottom"
          align="start"
          avoidCollisions={false}
          sideOffset={-2}
          alignOffset={-10}
          className="w-55 p-0 border-0 rounded-b-lg"
          >
          <DropdownResults
            resultsList={levels}
            setValueFunction={setValueThree}
            setInputFunction={setInputThree}
            focusStatus={focusThree}
            value={valueThree}
          ></DropdownResults>
          </PopoverContent>
        </Popover>
      </Command>

      <Command className="rounded-sm bg-background dark:bg-card md:w-1/4">
        <p className="text-xs px-3 tracking-wide opacity-50">SORT BY</p>
          <Popover open={focusTwo}>
          <PopoverAnchor asChild>
          <CommandInput
            placeholder={sortTypePlaceholder}
            className="relative font-semibold text-base"
            wrapperClassName="flex flex-row w-full"
            onValueChange={setInputTwo}
            onFocus={() => setFocusTwo(true)}
            onBlur={() => setFocusTwo(false)}
            value={inputTwo}
          />
          </PopoverAnchor>
          <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}         // don’t steal focus from input
          onCloseAutoFocus={(e) => e.preventDefault()}        // don’t force focus back
          side="bottom"
          align="start"
          avoidCollisions={false}
          sideOffset={-2}
          alignOffset={-10}
          className="w-55 p-0 border-0 rounded-b-lg"
          >
          <DropdownResults
            resultsList={sortTypes}
            setValueFunction={setValueTwo}
            setInputFunction={setInputTwo}
            focusStatus={focusTwo}
            value={valueTwo}
          ></DropdownResults>
          </PopoverContent>
        </Popover>
      </Command>

      <Button
        onClick={handleSearch}
        className="relative md:top-1 py-6 rounded-xl bg-uic-red-500/10 border border-uic-red-500/15 hover:bg-uic-red-500/20 text-uic-red-500 hover:text-uic-red-500 opacity-100 shadow-none font-semibold transition-all duration-300"
        variant="outline"
      >
        {isPending ? <Spinner className="size-4" /> : <SearchIcon className="size-4" />} Show Results
      </Button>
      </div>
    </div>
  );
}

export { DropdownSearchBar };
