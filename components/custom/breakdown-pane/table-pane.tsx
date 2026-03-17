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
import { GPALineChart } from "./gpa-line-chart";

interface tablePaneProps {
  statsFromDB: {
    courseInstanceID: number;
    semester: string;
    A: number;
    total_students: number;
    professor: {
      id: number;
      name: string;
    };
  }[];
  courseInstanceAggregation: {
    courseInstanceID: number;
    _sum: {
      A: number | null;
      B: number | null;
      C: number | null;
      D: number | null;
      F: number | null;
    };
  }[];
}

function TablePane({ statsFromDB, courseInstanceAggregation }: tablePaneProps) {
  // Pre-compute all GPAs, then find the highest and lowest values
  const rowGPAs: Map<string, number> = new Map();
  statsFromDB.forEach((row) => {
    const data = courseInstanceAggregation.find(
      (item) => item.courseInstanceID === row.courseInstanceID
    );
    const gpaStr = calculateGPA(formatGradeData(data));
    if (gpaStr !== "N/A")
      rowGPAs.set(row.courseInstanceID.toString(), parseFloat(gpaStr));
  });
  const allGPAs = [...rowGPAs.values()];
  const highestGPA = allGPAs.length > 0 ? Math.max(...allGPAs) : null;
  const lowestGPA = allGPAs.length > 0 ? Math.min(...allGPAs) : null;

  const semesterGroups = new Map<string, { totalGpa: number; count: number }>();
  statsFromDB.forEach((row) => {
    const gpa = rowGPAs.get(row.courseInstanceID.toString());
    if (gpa !== undefined && !isNaN(gpa)) {
      const cleanedSemesterText = titleCase(
        row.semester.replace("_20", " ").replace("-20", " ")
      );
      const existing = semesterGroups.get(cleanedSemesterText) || {
        totalGpa: 0,
        count: 0,
      };
      semesterGroups.set(cleanedSemesterText, {
        totalGpa: existing.totalGpa + gpa,
        count: existing.count + 1,
      });
    }
  });

  const gpaChartData = Array.from(semesterGroups.entries())
    .map(([semester, data]) => ({
      semester,
      gpa: Number((data.totalGpa / data.count).toFixed(2)),
    }))
    .reverse();

  return (
    <div className="h-full gap-3 overflow-auto px-6 py-8">
      <h1 className="text-foreground -mt-2 pb-3 text-center text-lg font-bold">
        Breakdown
      </h1>
      <GPALineChart data={gpaChartData} />
      <Table className="text-foreground">
        <TableHeader className="bg-muted/70">
          <TableRow>
            <TableHead className="rounded-tl-md text-left text-xs font-bold">
              Professor
            </TableHead>
            <TableHead className="text-left text-xs font-bold">
              Semester
            </TableHead>
            <TableHead className="rounded-tr-md text-left text-xs font-bold">
              GPA
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statsFromDB.map((row) => {
            const rowCourseInstanceData = courseInstanceAggregation.find(
              (item) => item.courseInstanceID === row.courseInstanceID
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
                ? "text-foreground font-bold bg-green-500/20 dark:bg-green-500/30"
                : !isNaN(rowGPA) && rowGPA === lowestGPA
                  ? "text-foreground font-bold bg-red-500/20 dark:bg-red-500/30"
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
