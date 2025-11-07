import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import { motion, LayoutGroup, AnimatePresence, easeInOut } from "motion/react"
          
import MiniSearch from 'minisearch'

import Link from 'next/link'

import courseList from "@/courseList"
import { Ref } from "react"

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
  fields: ['subject', 'number', 'title', 'professor', 'combinedName'],
  storeFields: ['subject', 'number', 'title', 'professor', 'combinedName']
})

const coursesListWithID = courseList.map((course, index) => ({...course, 
  id: index,
  combinedName: course.subject + course.number
}))
miniSearch.addAll(coursesListWithID)

function getMatches(query: string) {
    const cleanedQuery = query.trim().toLowerCase()
    let matchedResults = miniSearch.search(cleanedQuery, {fuzzy: 0.2})

    let exactMatches = matchedResults.filter((course) => {
      const cleanedCourseName = (course.subject + " " + course.number).toLowerCase()
      const cleanedCourseNameNoSpaces = course.combinedName.toLowerCase()
      const cleanedProfessorName = (course.professor).toLowerCase()
      const cleanedTitle = (course.title).toLowerCase()
      if (cleanedCourseName == cleanedQuery || cleanedCourseNameNoSpaces == cleanedQuery || cleanedProfessorName == cleanedQuery || cleanedTitle == cleanedQuery) {
        return true;
      }
    })

    matchedResults = exactMatches.length > 0 ? exactMatches : matchedResults
    return matchedResults
}

function ResultsPaneMotion({query, ref}: {query: string; ref?: Ref<HTMLElement>}) {
    if (query.length > 0) {
        return (
            <CommandList className="border-t border-gray-200/20">
            <CommandGroup heading="Courses">
            <CommandEmpty>
            <h2 className="italic text-xs relative py-6">No results found.</h2>
            </CommandEmpty>
                <AnimatePresence>
                {getMatches(query).slice(0,5).map((item: any) => {
                  return (
                        <CommandItem key = {item.id} value = {item.id} className="rounded-xl">
                          <Link href = {"/course/" + item.subject + "-" + item.number} className="w-full">
                            <div className = "flex items-center gap-1 align-bottom">
                              <h2 className="text-base font-semibold text-gray-600">{item.subject + " " + item.number}</h2>
                              <h2 className="text-s text-gray-600">{item.title}</h2>
                            </div>
                            <h4 className="text-xs font-light italic text-gray-500">{item.professor}</h4>
                          </Link>
                        </CommandItem>
                  )
                })}
                </AnimatePresence>
              </CommandGroup>
            </CommandList>
        );
    }
    else return null
  }

const ResultsPaneMotionComponent = motion.create(ResultsPaneMotion, { forwardMotionProps: true })



export {ResultsPaneMotionComponent}