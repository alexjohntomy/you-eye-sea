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

import { motion, LayoutGroup, AnimatePresence, easeInOut } from "motion/react";

import MiniSearch from "minisearch";

import Link from "next/link";

import courseList from "@/courseList";
import { Ref } from "react";

import { TrendingUp, GraduationCap } from "lucide-react";

interface testProps {
  query: string;
  focusStatus: boolean
  ref?: Ref<HTMLElement>
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
  let matchedResults = miniSearch.search(cleanedQuery, { fuzzy: 0.2 });

  let exactMatches = matchedResults.filter((course) => {
    const cleanedCourseName = (
      course.subject +
      " " +
      course.number
    ).toLowerCase();
    const cleanedCourseNameNoSpaces = course.combinedName.toLowerCase();
    const cleanedProfessorName = course.professor.toLowerCase();
    const cleanedTitle = course.title.toLowerCase();
    if (
      cleanedCourseName == cleanedQuery ||
      cleanedCourseNameNoSpaces == cleanedQuery ||
      cleanedProfessorName == cleanedQuery ||
      cleanedTitle == cleanedQuery
    ) {
      return true;
    }
  });

  matchedResults = exactMatches.length > 0 ? exactMatches : matchedResults;
  return matchedResults;
}

function ResultsPaneMotion({
  query,
  focusStatus,
  ref,
}: testProps) {
  const trendingClasses : any = [
    {
    id: 1,
    combinedName: "CS 342",
    subject: "CS",
    number: 342,
    title: "Software Design",
    professor: "Mark Hallenbeck"
    },
    {
    id: 2,
    combinedName: "CHEM 232",
    subject: "CHEM",
    number: 232,
    title: "Structure and Function",
    professor: "Justin Mohr"
    },
    {
    id: 3,
    combinedName: "BIOS 220",
    subject: "BIOS",
    number: 220,
    title: "Genetics",
    professor: "Peter Okkema"
    },
    {
    id: 4,
    combinedName: "MATH 310",
    subject: "MATH",
    number: 310,
    title: "Applied Linear Algebra",
    professor: "Nicholas Switala"
    }
  ]
  if (query.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }} // Starts hidden and slightly below its final position
        animate={{ opacity: 1, y: 0 }}    // Fades in and slides up to its final position
        transition={{ duration: 0.25 }}   // Animation duration
      >
      <CommandList className="border-t border-gray-200/50">
        <CommandGroup>
          <h3 className="flex flex-row gap-2 py-1 text-sm px-2 text-gray-500 font-medium">
            <GraduationCap width={13} className="relative bottom-[1.75]"/>
            Courses
          </h3>
          <CommandEmpty>
            <h2 className="italic text-xs relative py-6">No results found.</h2>
          </CommandEmpty>
          <AnimatePresence>
            {getMatches(query)
              .slice(0, 5)
              .map((item: any) => {
                return (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    className="rounded-lg"
                  >
                    <Link
                      href={"/course/" + item.subject + "-" + item.number}
                      className="w-full"
                    >
                      <div className="flex items-center gap-1 align-bottom">
                        <h2 className="text-base font-semibold text-gray-600">
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
          </AnimatePresence>
        </CommandGroup>
      </CommandList>
      </motion.div>
    );
  } else if (query.length == 0 && focusStatus) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
      <CommandList className="border-t border-gray-200/50">
        <CommandGroup>
          <h3 className="flex py-1 flex-row gap-2 text-sm px-2 text-gray-500 font-medium">
            <TrendingUp width={12} className="relative bottom-[1]"/>
            Popular This Week
          </h3>
          <CommandItem value="-" className="hidden" />
            {trendingClasses.map((item: any) => {
                return (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    className="rounded-lg"
                  >
                    <Link
                      href={"/course/" + item.subject + "-" + item.number}
                      className="w-full"
                    >
                      <div className="flex items-center gap-1 align-bottom">
                        <h2 className="text-base font-semibold text-gray-600">
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
      </motion.div>
    )
  }
  else return null;
}

const ResultsPaneMotionComponent = motion.create(ResultsPaneMotion, {
  forwardMotionProps: true,
});

export { ResultsPaneMotionComponent };
