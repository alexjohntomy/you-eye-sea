"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

// type was Payment
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "professor",
    header: "Professor",
  },
  {
    accessorKey: "gpa",
    header: "GPA",
  },
  {
    accessorKey: "pass-rate",
    header: "Pass Rate",
  },
  {
    accessorKey: "drop-rate",
    header: "Drop Rate",
  },
]