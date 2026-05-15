import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { motion } from "motion/react";

import MiniSearch from "minisearch";

import { HoverPrefetchLink as Link } from "@/components/custom/main-ui/hover-prefetch-link";
import { useRouter } from "next/navigation";

import courseList from "@/cache/course-list";
import { Ref, useState } from "react";

import { ChevronRight, GraduationCap, TrendingUp } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";

interface ResultsPaneProps {
  query: string;
  focusStatus: boolean;
  onResetHover?: () => void;
  onSelect?: () => void;
  ref?: Ref<HTMLElement>;
}

const miniSearch = new MiniSearch({
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

  const exactMatches = matchedResults.filter((course) => {
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

interface courseInstance {
  id: number;
  combinedName: string;
  subject: string;
  number: number;
  title: string;
  professor: string;
}

function ResultsPaneMotion({ query, onResetHover, onSelect }: ResultsPaneProps) {
  const router = useRouter();
  const { trigger } = useWebHaptics();
  const [pressedId, setPressedId] = useState<number | null>(null);

  const handleSelect = (href: string, id: number) => {
    setPressedId(id);
    trigger("nudge");
    (document.activeElement as HTMLElement)?.blur();
    router.push(href, { scroll: false });
    onSelect?.();
    setPressedId(null);
  };
  const productionTrendingCourses: courseInstance[] = [
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

  const sampleTrendingCourses: courseInstance[] = [
    {
      id: 1,
      combinedName: "CS 111",
      subject: "CS",
      number: 111,
      title: "Introduction to Centering Divs",
      professor: "Richard Hendricks",
    },
    {
      id: 2,
      combinedName: "CS 400",
      subject: "CS",
      number: 400,
      title: "Navigating BSB",
      professor: "Dennis Reynolds",
    },
    {
      id: 3,
      combinedName: "PHYS 141",
      subject: "PHYS",
      number: 141,
      title: "Dropping Things",
      professor: "Dee Reynolds",
    },
    {
      id: 4,
      combinedName: "ANTH 100",
      subject: "ANTH",
      number: 100,
      title: "Making Friends",
      professor: "Jared Dunn",
    },
    {
      id: 5,
      combinedName: "CHEM 101",
      subject: "CHEM",
      number: 101,
      title: "Introduction to Coffee Testing",
      professor: "Walter White",
    },
  ];

  const trendingCourseInstances = process.env.NODE_ENV === "development"
    ? sampleTrendingCourses
    : productionTrendingCourses;
  if (query.length > 0) {
    return (
      <CommandList
        className="min-h-fit border-t border-gray-200/50 dark:border-white/10"
        onMouseLeave={onResetHover}
      >
        <CommandGroup>
          <h3 className="text-foreground/50 dark:text-foreground/50 hidden md:flex flex-row gap-2 px-2 py-1 text-sm font-medium">
            <GraduationCap width={13} className="relative bottom-[1.75]" />
            Courses
          </h3>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 opacity-90">
              <h1 className="dark:text-foreground/50 text-sm text-gray-500">
                No Results Found :(
              </h1>
              <Link
                href="/explore"
                className="bg-uic-red-600 hover:bg-uic-red-600 rounded-lg px-3 py-2 font-semibold text-white opacity-90 transition-colors hover:opacity-100 shadow-md"
              >
                Try the explore page?
              </Link>
            </div>
          </CommandEmpty>
          {getMatches(query)
            .slice(0, 5)
            .map((item, index) => {
              const resultItem = item;
              const href =
                "/course/" + resultItem.subject + "-" + resultItem.number;
              return (
                <CommandItem
                  key={resultItem.id}
                  value={resultItem.id.toString()}
                  onSelect={() => handleSelect(href, resultItem.id)}
                   className={`rounded-xl transition-all duration-50 ease-out active:scale-[0.992] ${pressedId === resultItem.id ? "scale-[0.992] bg-accent/50" : ""}`}
                >
                  <Link
                    href={href}
                    onClick={() => {
                      // handleSelect(href, resultItem.id); // Bubble to onSelect
                    }}
                    className="flex min-w-0 grow flex-col"
                  >
                    <div className="flex flex-col align-bottom md:flex-row md:items-baseline md:gap-1">
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
          <h3 className="text-foreground/50 dark:text-foreground/50 hidden md:flex flex-row gap-2 px-2 py-1 text-sm font-medium">
            <TrendingUp width={12} className="relative bottom-[1]" />
            Popular This Week
          </h3>
          {trendingCourseInstances
            .slice(0, 5)
            .map((item: courseInstance, index: number) => {
              const resultItem = item;
              const href =
                "/course/" + resultItem.subject + "-" + resultItem.number;
              return (
                <CommandItem
                  key={resultItem.id}
                  value={resultItem.id.toString()}
                  onSelect={() => handleSelect(href, resultItem.id)}
                   className={`rounded-xl transition-all duration-50 ease-out active:scale-[0.992] ${pressedId === resultItem.id ? "scale-[0.992] bg-accent/50" : ""}`}
                >
                  <Link
                    href={href}
                    onClick={() => {
                      // handleSelect(href, resultItem.id); // Bubble to onSelect
                    }}
                    className="flex min-w-0 grow flex-col"
                  >
                    <div className="flex flex-col align-bottom md:flex-row md:items-baseline md:gap-1">
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
