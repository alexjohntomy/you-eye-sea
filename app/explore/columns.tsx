"use client"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { getProfessorNameFromID } from "@/app/_util/getProfessorNameFromID";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type rowDetails = {
  course : string;
  professor : number;
  gpa : number;
  passRate : number;
  dropRate : number;
  totalStudents : number;
}

const columnHelper = createColumnHelper<rowDetails>()

// type was Payment
export const columns: ColumnDef<rowDetails>[] = [
  {
    accessorKey: "course",
    header: "Course",
    cell: (info) => {
      const courseName = info.getValue<string>()
      const professorID = info.row.original.professor
      return <Link className="flex flex-row items-center font-bold text-uic-navy-500 justify-between underline underline-offset-4" href={"/course/" + courseName.replace(" ", "-") + "?professor=" + professorID}>{courseName}</Link>
    }
  },
  {
    accessorKey: "professor",
    header: "Professor",
    cell: (info) => getProfessorNameFromID(info.getValue<number>())
  },
  {
    accessorKey: "gpa",
    header: "GPA",
    cell: (info) => info.getValue<number>().toFixed(2)
  },
  {
    accessorKey: "passRate",
    header: "Pass Rate",
    cell: (info) => info.getValue<number>().toFixed(1) + "%"
  },
  {
    accessorKey: "dropRate",
    header: "Drop Rate",
    cell: (info) => info.getValue<number>().toFixed(1) + "%"
  },
  {
    accessorKey: "totalStudents",
    header: "Total Students",
    cell: (info) => {
      return <h1>{info.getValue<number>()}</h1>
    }
  },
]