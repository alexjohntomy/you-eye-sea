"use client"

import { useState } from "react"

import { titleCase } from 'text-title-case'

import KatexSpan from "./formula"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { calculateGPA } from "@/app/_util/gpaCalculator"
import { formatGradeData } from '@/app/_util/formatGradeData'

interface tablePaneProps {
    statsFromDB: any
    courseInstanceAggregation: any
}

function TablePane({statsFromDB, courseInstanceAggregation} : tablePaneProps) {
    let highestGPA = 0
    let rowClassName = ""
    return (
        <div className="gap-3 p-8">
            <h1 className='text-xl font-bold text-foreground'>Breakdown</h1>
            <Table className="text-foreground">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left text-xs">Prof.</TableHead>
                        <TableHead className="text-left text-xs">Sem.</TableHead>
                        <TableHead className="text-left text-xs">Cohort GPA</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {statsFromDB.map((row : any) => {
                            const rowCourseInstanceData = courseInstanceAggregation.find((item:any) => item.courseInstanceID === row.courseInstanceID)
                            const formattedData = formatGradeData(rowCourseInstanceData)
                            const cleanedSemesterText = titleCase(row.semester.replace("_20"," ").replace("-20"," "))
                            const professorLastName = row.professor.name.split(",")[0]
                            const rowGPA = parseFloat(calculateGPA(formattedData))
                            highestGPA = (highestGPA == 0) ? rowGPA : highestGPA
                            if (rowGPA > highestGPA) {
                                rowClassName = "text-right font-bold text-s text-foreground bg-green-200/40"
                                highestGPA = rowGPA
                            }
                            else {
                                rowClassName = "text-foreground"
                            }
                            return (
                            <TableRow key={row.courseInstanceID} className={rowClassName}>
                                <TableCell className="text-left text-xs">{professorLastName}</TableCell>
                                <TableCell className="text-left text-xs">{cleanedSemesterText}</TableCell>
                                <TableCell className="text-right font-bold text-s">{rowGPA}</TableCell>
                            </TableRow>
                            )
                        }
                        )}
                    </TableBody>
            </Table>
                <br></br>
                <div className="text-[9px] flex flex-col gap-3 text-foreground/60 ">
                    <p className="relative top-3 text-center">
                    The cohort GPA is an approximated as follows.
                    </p>
                    <KatexSpan
                    text={`$$\\frac{4\\cdot \\text{numAs} + 3\\cdot \\text{numBs} + 2\\cdot \\text{numCs} + 1\\cdot \\text{numDs}}{\\text{totalCounts}}$$`}
                    />
                </div>
        </div>
    )
}

export { TablePane }