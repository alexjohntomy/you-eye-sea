"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link";
import { ChevronRight, ExternalLink, ArrowDown } from "lucide-react";
import { getProfessorNameFromID } from "@/app/_util/getProfessorNameFromID";
import { Button } from "@/components/ui/button";

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

columnHelper.accessor

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
    cell: (info) => <h1 className="italic">{getProfessorNameFromID(info.getValue<number>())}</h1>
  },
  {
    accessorKey: "gpa",
    header: ({ column }) => {
      const router = useRouter()
      const searchParams = useSearchParams()
      const params = new URLSearchParams(searchParams.toString());
      const pathname = usePathname();
      const handleClick = () => {
          params.set("sort", "gpa");
          router.push(`${pathname}?${params.toString()}`);
      }
      return (<Button variant="ghost" className="font-black hover:bg-transparent hover:underline hover:underline-offset-3 hover:text-background" onClick={handleClick}>GPA<ArrowDown/></Button>) 
    },
    cell: (info) => {
      return <h1 className="ml-3">{info.getValue<number>().toFixed(2)}</h1> 
    }
  },
  {
    accessorKey: "passRate",
    header: ({ column }) => {
      const router = useRouter()
      const searchParams = useSearchParams()
      const params = new URLSearchParams(searchParams.toString());
      const pathname = usePathname();
      const handleClick = () => {
          params.set("sort", "passRate");
          router.push(`${pathname}?${params.toString()}`);
      }
      return (<Button variant="ghost" className="font-black hover:bg-transparent hover:underline hover:underline-offset-3 hover:text-background" onClick={handleClick}>Pass Rate<ArrowDown/></Button>) 
    },
    cell: (info) => {
      return <h1 className="ml-3">{info.getValue<number>().toFixed(1) + "%"}</h1> 
    }
  },
  {
    accessorKey: "dropRate",
      header: ({ column }) => {
      const router = useRouter()
      const searchParams = useSearchParams()
      const params = new URLSearchParams(searchParams.toString());
      const pathname = usePathname();
      const handleClick = () => {
          params.set("sort", "dropRate");
          router.push(`${pathname}?${params.toString()}`);
      }
      return (<Button variant="ghost" className="font-black hover:bg-transparent hover:underline hover:underline-offset-3 hover:text-background" onClick={handleClick}>Drop Rate<ArrowDown/></Button>) 
    },
    cell: (info) => {
        return <h1 className="ml-3">{info.getValue<number>().toFixed(1)}%</h1>
    }
  },
  {
    accessorKey: "totalStudents",
    header: ({ column }) => {
      const router = useRouter()
      const searchParams = useSearchParams()
      const params = new URLSearchParams(searchParams.toString());
      const pathname = usePathname();
      const handleClick = () => {
          params.set("sort", "totalStudents");
          router.push(`${pathname}?${params.toString()}`);
      }
      return (<Button variant="ghost" className="font-black hover:bg-transparent hover:underline hover:underline-offset-3 hover:text-background" onClick={handleClick}>Total Students<ArrowDown/></Button>) 
      },
      cell: (info) => {
        return <h1 className="ml-3">{info.getValue<number>()}</h1>
      }
  },
]