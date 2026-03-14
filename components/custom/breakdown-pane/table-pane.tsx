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
  // Pre-compute all GPAs, then find the highest and lowest values
  const rowGPAs: Map<string, number> = new Map();
  statsFromDB.forEach((row: any) => {
    const data = courseInstanceAggregation.find(
      (item: any) => item.courseInstanceID === row.courseInstanceID
    );
    const gpaStr = calculateGPA(formatGradeData(data));
    if (gpaStr !== "N/A") rowGPAs.set(row.courseInstanceID, parseFloat(gpaStr));
  });
  const allGPAs = [...rowGPAs.values()];
  const highestGPA = allGPAs.length > 0 ? Math.max(...allGPAs) : null;
  const lowestGPA = allGPAs.length > 0 ? Math.min(...allGPAs) : null;

  return (
    <div className="h-full gap-3 overflow-auto py-8 px-6">
      <h1 className="text-foreground mt-1.5 pb-2 text-center text-xl font-bold">
        Breakdown
      </h1>
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
            const gpaStr = calculateGPA(formattedData);
            const rowGPA = gpaStr === "N/A" ? NaN : parseFloat(gpaStr);
            const rowClassName =
              !isNaN(rowGPA) && rowGPA === highestGPA
                ? "text-foreground font-bold bg-green-200/40"
                : !isNaN(rowGPA) && rowGPA === lowestGPA
                  ? "text-foreground font-bold bg-red-200/40"
                  : "text-foreground";
            return (
              <TableRow key={row.courseInstanceID} className={rowClassName}>
                <TableCell className="text-left text-xs">
                  {professorLastName}
                </TableCell>
                <TableCell className="text-left text-xs">
                  {cleanedSemesterText}
                </TableCell>
                <TableCell className="text-s text-left font-bold">
                  {isNaN(rowGPA) ? "N/A" : rowGPA}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <br></br>
      <div className="text-foreground flex flex-col gap-6 text-[10px]">
        <p className="relative top-3 text-center opacity-50">
          The cohort GPA is an approximated weighted average as follows. Total
          Counts does not include nonstandard grades.
        </p>
        <div className="flex-fit flex min-w-full flex-col flex-nowrap justify-center gap-1 text-center font-serif text-xs text-[10px] opacity-80">
          <h4 className="text-nowrap underline underline-offset-4">
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
