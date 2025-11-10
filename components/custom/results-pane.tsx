import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

//imports for command bar
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import { ChevronDownIcon, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import MiniSearch from "minisearch";

import Link from "next/link";

import courseList from "@/courseList";

interface testProps {
  query: string;
}

interface courseObject {
  subject: string;
  number: number;
  title: string;
  professor: string;
}

let miniSearch = new MiniSearch({
  fields: ["subject", "number", "title", "professor"],
  storeFields: ["subject", "number", "title", "professor"],
});

const coursesListWithID = courseList.map((course, index) => ({
  ...course,
  id: index,
}));
miniSearch.addAll(coursesListWithID);

function getMatches(query: string) {
  let matchedResults = miniSearch.search(query);
  const cleanedQuery = query.trim().toLowerCase();

  let exactMatches = matchedResults.filter((course) => {
    const cleanedCourseName = (
      course.subject +
      " " +
      course.number
    ).toLowerCase();
    const cleanedProfessorName = course.professor.toLowerCase();
    const cleanedTitle = course.title.toLowerCase();
    if (
      cleanedCourseName == cleanedQuery ||
      cleanedProfessorName == cleanedQuery ||
      cleanedTitle == cleanedQuery
    ) {
      return true;
    }
  });

  matchedResults = exactMatches.length > 0 ? exactMatches : matchedResults;
  return matchedResults;
}

function ResultsPane({ query }: testProps) {
  if (query.length > 0) {
    return (
      <CommandList className="border-t border-gray-200">
        <CommandEmpty>No results found.</CommandEmpty>
        {/* <CommandGroup heading="Trending">
                <CommandItem>
                  <Calendar />
                  <span>CS 342</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator /> */}
        <CommandGroup heading="Courses">
          {getMatches(query)
            .slice(0, 5)
            .map((item: any) => {
              return (
                <CommandItem key={item.id} value={item.id}>
                  <Link
                    href={"/course/" + item.subject + "-" + item.number}
                    className="w-full"
                  >
                    <div className="flex items-center gap-1 align-bottom">
                      <h2 className="text-base font-semibold">
                        {item.subject + " " + item.number}
                      </h2>
                      <h2 className="text-s text-gray-600">{item.title}</h2>
                    </div>
                    <h4 className="text-xs font-light italic text-gray-500">
                      {item.professor}
                    </h4>
                  </Link>
                </CommandItem>
              );
            })}
        </CommandGroup>
      </CommandList>
    );
  } else return null;
}

export { ResultsPane };
