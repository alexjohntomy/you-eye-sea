"use client";

import { titleCase } from "text-title-case";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatGradeData } from "@/app/_util/formatGradeData";
import { calculateGPA } from "@/app/_util/gpaCalculator";

interface tablePaneProps {
  statsFromDB: any;
  courseInstanceAggregation: any;
}

function TablePane({ statsFromDB, courseInstanceAggregation }: tablePaneProps) {
  let highestGPA = 0;
  let rowClassName = "";
  return (
    <div className="gap-3 p-8 h-full overflow-auto">
      <h1 className="text-xl font-bold text-foreground">Breakdown</h1>
      <Table className="text-foreground">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left text-xs">Professor</TableHead>
            <TableHead className="text-left text-xs">Semester</TableHead>
            <TableHead className="text-left text-xs">GPA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statsFromDB.map((row: any) => {
            const rowCourseInstanceData = courseInstanceAggregation.find(
              (item: any) => item.courseInstanceID === row.courseInstanceID
            );
            const formattedData = formatGradeData(rowCourseInstanceData);
            const cleanedSemesterText = titleCase(
              row.semester.replace("_20", " ").replace("-20", " ")
            );
            const professorLastName = row.professor.name.split(",")[0];
            const rowGPA = parseFloat(calculateGPA(formattedData));
            highestGPA = highestGPA == 0 ? rowGPA : highestGPA;
            if (rowGPA > highestGPA) {
              rowClassName =
                "text-left font-bold text-s text-foreground bg-green-200/40";
              highestGPA = rowGPA;
            } else {
              rowClassName = "text-foreground";
            }
            return (
              <TableRow key={row.courseInstanceID} className={rowClassName}>
                <TableCell className="text-left text-xs">
                  {professorLastName}
                </TableCell>
                <TableCell className="text-left text-xs">
                  {cleanedSemesterText}
                </TableCell>
                <TableCell className="text-left font-bold text-s">
                  {rowGPA}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <br></br>
      <div className="text-[10px] flex flex-col gap-6 text-foreground">
        <p className="relative top-3 text-center opacity-50">
          The cohort GPA is an approximated weighted average as follows. Total
          Counts does not include nonstandard grades.
        </p>
        <div className="flex flex-col text-[10px] min-w-full font-serif flex-fit gap-1 flex-nowrap justify-center text-center text-xs opacity-80">
          <h4 className="underline underline-offset-4 text-nowrap">
            {" "}
            4(NumAs) + 3(NumBs) + 2(NumCs) + 1(NumDs)
          </h4>
          <h4 className="relative">Total Counts</h4>
        </div>
      </div>
    </div>
  );
}

export { TablePane };
