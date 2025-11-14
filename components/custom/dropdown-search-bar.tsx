"use client";

import { Command, CommandInput } from "@/components/custom/dropdown-list";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { DropdownResults } from "./dropdown-results";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function DropdownSearchBar() {
  const subjects = [
    {
      value: "all-subjects",
      label: "All Subjects",
    },
    {
      value: "CS",
      label: "CS",
    },

    {
      value: "CHEM",
      label: "CHEM",
    },

    {
      value: "BIO",
      label: "BIO",
    },

    {
      value: "MATH",
      label: "MATH",
    },

    {
      value: "PHYS",
      label: "PHYS",
    },

    {
      value: "STAT",
      label: "STAT",
    },

    {
      value: "ECON",
      label: "ECON",
    },

    {
      value: "psych",
      label: "PSYCH",
    },
  ];

  const sortTypes = [
    {
      value: "by-gpa",
      label: "By GPA",
    },
    {
      value: "by-drop-rate",
      label: "By Drop Rate",
    },
    {
      value: "by-pass-rate",
      label: "By Pass Rate",
    },
    {
      value: "by-num-a",
      label: "By Number of As",
    },
  ];

  const levels = [
    {
      value: "all-levels",
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

  const [focusOne, setFocusOne] = useState(false);
  const [focusTwo, setFocusTwo] = useState(false);
  const [focusThree, setFocusThree] = useState(false);
  const handleOnFocusOne = () => {
    setFocusOne(true);
  };
  const handleOnFocusTwo = () => {
    setFocusTwo(true);
  };

  const handleOnFocusThree = () => {
    setFocusThree(true);
  };

  const handleOnblurOne = () => {
    setFocusOne(false);
  };
  const handleOnblurTwo = () => {
    setFocusTwo(false);
  };

  const handleOnblurThree = () => {
    setFocusThree(false);
  };

  const [valueOne, setValueOne] = useState("all-subjects");
  const [valueTwo, setValueTwo] = useState("by-gpa");
  const [valueThree, setValueThree] = useState("all-levels");

  const subjectPlaceholder = subjects.filter((obj) => obj.value === valueOne)[0]
    .label;
  const sortTypePlaceholder = sortTypes.filter(
    (obj) => obj.value === valueTwo
  )[0].label;
  const levelPlaceholder = levels.filter((obj) => obj.value === valueThree)[0]
    .label;
  // Trying to add url logic

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("subject", valueOne);
    params.set("sort", valueTwo);
    params.set("level", valueThree);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-between md:w-3/4 bg-background py-4 md:py-8 rounded-lg gap-5 border-2 border-uic-red-300/40 md:max-h-20 relative md:items-start opacity-90">
      <div className="flex flex-col md:flex-row w-full gap-5 justify-center relative md:-top-5 px-2 z-10">
      <Command className="rounded-sm bg-background md:w-1/4">
        <p className="text-xs px-3 tracking-wide opacity-50">SUBJECT</p>
        <CommandInput
          placeholder={subjectPlaceholder}
          className="relative font-semibold"
          wrapperClassName="flex flex-row w-full"
          onValueChange={setValueOne}
          onFocus={handleOnFocusOne}
          onBlur={handleOnblurOne}
        />
        <DropdownResults
          resultsList={subjects}
          setValueFunction={setValueOne}
          focusStatus={focusOne}
        ></DropdownResults>
      </Command>

      <Command className="rounded-sm bg-background md:w-1/4">
        <p className="text-xs px-3 tracking-wide opacity-50">LEVEL</p>
        <CommandInput
          placeholder={levelPlaceholder}
          className="relative font-semibold"
          wrapperClassName="flex flex-row w-full"
          onValueChange={setValueThree}
          onFocus={handleOnFocusThree}
          onBlur={handleOnblurThree}
        />
        <DropdownResults
          resultsList={levels}
          setValueFunction={setValueThree}
          focusStatus={focusThree}
        ></DropdownResults>
      </Command>

      <Command className="rounded-sm bg-background md:w-1/4">
        <p className="text-xs px-3 tracking-wide opacity-50">SORT BY</p>
        <CommandInput
          placeholder={sortTypePlaceholder}
          className="relative font-semibold"
          wrapperClassName="flex flex-row w-full"
          onValueChange={setValueTwo}
          onFocus={handleOnFocusTwo}
          onBlur={handleOnblurTwo}
        />
        <DropdownResults
          resultsList={sortTypes}
          setValueFunction={setValueTwo}
          focusStatus={focusTwo}
        ></DropdownResults>
      </Command>

      <Button
        onClick={handleSearch}
        className="relative md:top-1 py-6 rounded-sm bg-uic-red-500 opacity-100 inset-shadow-2xl hover:bg-uic-red-600 hover:text-background hover:opacity-100 font-semibold text-white shadow-lg"
        variant="default"
      >
        <SearchIcon></SearchIcon> Show Results
      </Button>
      </div>
    </div>
  );
}

export { DropdownSearchBar };
