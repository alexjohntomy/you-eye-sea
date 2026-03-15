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
      return (
        <Link 
          className="group flex w-fit flex-row items-center gap-1 font-medium text-foreground/80 transition-colors hover:text-foreground" 
          href={"/course/" + courseName.replace(" ", "-") + "?professor=" + professorID}
        >
          {courseName}
          <ChevronRight className="size-3.5 opacity-40 transition-opacity group-hover:opacity-80" />
        </Link>
      )
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
      return (<Button variant="ghost" className="font-bold text-xs text-foreground hover:bg-foreground/5 dark:hover:bg-foreground/10 hover:text-foreground hover:underline hover:underline-offset-3" onClick={handleClick}>GPA<ArrowDown className="ml-1 size-3"/></Button>) 
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
      return (<Button variant="ghost" className="font-bold text-xs text-foreground hover:bg-foreground/5 dark:hover:bg-foreground/10 hover:text-foreground hover:underline hover:underline-offset-3" onClick={handleClick}>Pass Rate<ArrowDown className="ml-1 size-3"/></Button>) 
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
      return (<Button variant="ghost" className="font-bold text-xs text-foreground hover:bg-foreground/5 dark:hover:bg-foreground/10 hover:text-foreground hover:underline hover:underline-offset-3" onClick={handleClick}>Drop Rate<ArrowDown className="ml-1 size-3"/></Button>) 
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
      return (<Button variant="ghost" className="font-bold text-xs text-foreground hover:bg-foreground/5 dark:hover:bg-foreground/10 hover:text-foreground hover:underline hover:underline-offset-3" onClick={handleClick}>Total Students<ArrowDown className="ml-1 size-3"/></Button>) 
      },
      cell: (info) => {
        return <h1 className="ml-3">{info.getValue<number>()}</h1>
      }
  },
]