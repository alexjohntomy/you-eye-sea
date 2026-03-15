import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { motion } from "motion/react";

import { useIsMobile } from "@/hooks/use-mobile";

import MiniSearch from "minisearch";

import Link from "next/link";
import { useRouter } from "next/navigation";

import courseList from "@/courseList";
import { Ref } from "react";

import { ChevronRight, GraduationCap, TrendingUp, SearchX } from "lucide-react";
import { SearchResult as CustomSearchResult } from "@/components/custom/main/results-pane";

interface testProps {
  query: string;
  focusStatus: boolean;
  onResetHover?: () => void;
  onSelect?: () => void;
  ref?: Ref<HTMLElement>;
}

interface courseObject {
  subject: string;
  number: number;
  title: string;
  professor: string;
}

let miniSearch = new MiniSearch({
  fields: ["subject", "number", "title", "professor", "combinedName"],
  storeFields: ["subject", "number", "title", "professor", "combinedName"],
});

const coursesListWithID = courseList.map((course, index) => ({
  ...course,
  id: index,
  combinedName: course.subject + course.number,
}));
miniSearch.addAll(coursesListWithID);

function getMatches(query: string) {
  const cleanedQuery = query.trim().toLowerCase();
  let matchedResults = miniSearch.search(cleanedQuery, {
    prefix: true,
    fuzzy: 0.2,
  });

  let exactMatches = matchedResults.filter((course) => {
    const cleanedCourseName = (
      course.subject +
      " " +
      course.number
    ).toLowerCase();
    const cleanedCourseNameNoSpace = course.combinedName.toLowerCase();
    const cleanedProfessorName = course.professor.toLowerCase();
    const cleanedTitle = course.title.toLowerCase();

    // If the query is exactly the course name or exactly the professor or exactly the title
    if (
      cleanedCourseName === cleanedQuery ||
      cleanedCourseNameNoSpace === cleanedQuery ||
      cleanedProfessorName === cleanedQuery ||
      cleanedTitle === cleanedQuery
    ) {
      return true;
    }

    // Check if the query contains the exact course name and part of the professor name
    if (
      cleanedQuery.includes(cleanedCourseName) ||
      cleanedQuery.includes(cleanedCourseNameNoSpace)
    ) {
      return true;
    }

    return false;
  });

  matchedResults = exactMatches.length > 0 ? exactMatches : matchedResults;
  return matchedResults;
}

function ResultsPaneMotion({
  query,
  focusStatus,
  onResetHover,
  onSelect,
  ref,
}: testProps) {
  const router = useRouter();
  const trendingClasses: any = [
    {
      id: 1,
      combinedName: "CS 342",
      subject: "CS",
      number: 342,
      title: "Software Design",
      professor: "Mark Hallenbeck",
    },
    {
      id: 2,
      combinedName: "ART 170",
      subject: "ART",
      number: 170,
      title: "Introduction to Filmmaking",
      professor: "Zachary Hutchinson",
    },
    {
      id: 3,
      combinedName: "BIOS 220",
      subject: "BIOS",
      number: 220,
      title: "Genetics",
      professor: "Peter Okkema",
    },
    {
      id: 4,
      combinedName: "MATH 310",
      subject: "MATH",
      number: 310,
      title: "Applied Linear Algebra",
      professor: "Nicholas Switala",
    },
    {
      id: 5,
      combinedName: "SPAN 102",
      subject: "SPAN",
      number: 102,
      title: "Elementary Spanish II",
      professor: "Diego Rodriguez",
    },
  ];
  if (query.length > 0) {
    return (
      <CommandList
        className="min-h-fit border-t border-gray-200/50 dark:border-white/10"
        onMouseLeave={onResetHover}
      >
        <CommandGroup>
          <h3 className="text-foreground/50 dark:text-foreground/50 flex flex-row gap-2 px-2 py-1 text-sm font-medium">
            <GraduationCap width={13} className="relative bottom-[1.75]" />
            Courses
          </h3>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 opacity-90">
              <SearchX
                width={25}
                className="text-gray-400 dark:text-gray-500"
              />
              <h1 className="dark:text-foreground/50 text-sm text-gray-500">
                No Results Found :(
              </h1>
              <Link
                href="/explore"
                className="hover:bg-uic-red-600 bg-uic-red-500 rounded-lg px-3 py-2 font-semibold text-white"
              >
                Try the explore page?
              </Link>
            </div>
          </CommandEmpty>
          {getMatches(query)
            .slice(0, 5)
            .map((item, index) => {
              const resultItem = item as unknown as CustomSearchResult;
              const href =
                "/course/" + resultItem.subject + "-" + resultItem.number;
              return (
                <CommandItem
                  key={resultItem.id}
                  value={resultItem.id.toString()}
                  onSelect={() => {
                    router.push(href);
                    onSelect?.();
                  }}
                  className={`rounded-lg transition-colors duration-200 ease-out ${index === 4 ? "hidden md:flex" : ""}`}
                >
                  <Link
                    href={href}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect?.();
                    }}
                    className="flex min-w-0 grow flex-col"
                  >
                    <div className="flex flex-col align-bottom md:flex-row md:items-center md:gap-1">
                      <h2 className="text-uic-navy-800 dark:text-foreground/90 text-sm font-semibold text-nowrap md:text-base">
                        {item.subject + " " + item.number}
                      </h2>
                      <h2 className="text-s text-uic-navy-700 dark:text-foreground/70 truncate">
                        {item.title}
                      </h2>
                    </div>
                    <h4 className="text-uic-navy-500 dark:text-foreground/50 text-xs font-light italic">
                      {item.professor}
                    </h4>
                  </Link>
                  <ChevronRight className="relative -left-1 opacity-50" />
                </CommandItem>
              );
            })}
        </CommandGroup>
      </CommandList>
    );
  } else if (query.length == 0) {
    return (
      <CommandList
        className="min-h-fit border-t border-gray-200/50 dark:border-white/10"
        onMouseLeave={onResetHover}
      >
        <CommandGroup>
          <h3 className="text-foreground/50 dark:text-foreground/50 flex flex-row gap-2 px-2 py-1 text-sm font-medium">
            <TrendingUp width={12} className="relative bottom-[1]" />
            Popular This Week
          </h3>
          {trendingClasses.slice(0, 5).map((item: any, index: number) => {
            const resultItem = item as unknown as CustomSearchResult;
            const href =
              "/course/" + resultItem.subject + "-" + resultItem.number;
            return (
              <CommandItem
                key={resultItem.id}
                value={resultItem.id.toString()}
                onSelect={() => {
                  router.push(href);
                  onSelect?.();
                }}
                className={`rounded-lg transition-colors duration-200 ease-out ${index === 4 ? "hidden md:flex" : ""}`}
              >
                <Link
                  href={href}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.();
                  }}
                  className="flex min-w-0 grow flex-col"
                >
                  <div className="flex flex-col align-bottom md:flex-row md:items-center md:gap-1">
                    <h2 className="text-uic-navy-800 dark:text-foreground/90 text-sm font-semibold text-nowrap md:text-base">
                      {item.subject + " " + item.number}
                    </h2>
                    <h2 className="text-s text-uic-navy-700 dark:text-foreground/70 truncate">
                      {item.title}
                    </h2>
                  </div>
                  <h4 className="text-uic-navy-500 dark:text-foreground/50 text-xs font-light italic">
                    {item.professor}
                  </h4>
                </Link>
                <ChevronRight className="relative -left-1 opacity-50" />
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    );
  } else return null;
}

const ResultsPaneMotionComponent = motion.create(ResultsPaneMotion, {
  forwardMotionProps: true,
});

export { ResultsPaneMotionComponent };
