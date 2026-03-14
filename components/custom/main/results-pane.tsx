import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

//imports for command bar

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

export interface SearchResult extends courseObject {
  id: number;
}

function ResultsPane({ query }: testProps) {
  if (query.length > 0) {
    return (
      <CommandList className="border-t border-gray-200">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Courses">
          {getMatches(query)
            .slice(0, 5)
            .map((item: any) => {
              const resultItem = item as SearchResult;
              return (
                <CommandItem key={resultItem.id} value={resultItem.id.toString()}>
                  <Link
                    href={"/course/" + resultItem.subject + "-" + resultItem.number}
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
