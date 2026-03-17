import { FilteredDataTable } from "@/components/custom/data-table/filtered-data-table";
import { columns, rowDetails } from "@/app/explore/columns";
import prisma from "@/lib/prisma";

interface TablePaneServerProps {
  slug: string;
}

import { ColumnDef } from "@tanstack/react-table";
import subjectList from "@/subjectList";

interface courseSumsType {
  courseID: string;
  courseNumber: number;
  professorID: number;
  _sum: {
    A: number | null;
    B: number | null;
    C: number | null;
    D: number | null;
    F: number | null;
    W: number | null;
    total_students: number | null;
  };
}

// This function takes in a subject like "CS" or "BIO", and returns...
// a bit complicated but basically the sum of any professor + course combo and adds up the As
// across all semesters.
async function getGradeTotalsForSubject({
  subject,
  sortType,
  level,
}: FilterTypes): Promise<courseSumsType[]> {
  const courseInstanceAggregation = await prisma.courseInstance.groupBy({
    cacheStrategy: { ttl: 604800, swr: 86400 },
    by: ["courseID", "courseNumber", "professorID"],
    _sum: {
      A: true,
      B: true,
      C: true,
      D: true,
      F: true,
      W: true,
      total_students: true,
    },
    where: {
      ...(subject == "all" ? {} : { courseID: subject!.toUpperCase() }),
      ...(level == "all"
        ? {}
        : {
            courseNumber: { gte: parseInt(level!), lte: parseInt(level!) + 99 },
          }),
    },
  });
  return courseInstanceAggregation as unknown as courseSumsType[];
}

async function createTableRowsFromData({
  subject,
  sortType,
  level,
}: FilterTypes): Promise<rowDetails[]> {
  const courseSums: courseSumsType[] = await getGradeTotalsForSubject({
    subject,
    sortType,
    level,
  });
  //Row Creation Step
  const allRows = courseSums
    .filter(
      (course) =>
        course._sum.A! +
          course._sum.B! +
          course._sum.C! +
          course._sum.D! +
          course._sum.F! !=
        0
    )
    .map((item) => {
      let totalGradeCount =
        item._sum.A! +
        item._sum.B! +
        item._sum.C! +
        item._sum.D! +
        item._sum.F!;
      let totalGradeCountIncludingDrops =
        item._sum.A! +
        item._sum.B! +
        item._sum.C! +
        item._sum.D! +
        item._sum.F! +
        item._sum.W!;
      let weightedGrades =
        (item._sum.A ?? 0) * 4 +
        (item._sum.B ?? 0) * 3 +
        (item._sum.C ?? 0) * 2 +
        (item._sum.D ?? 0) * 1;
      let gpa = weightedGrades / totalGradeCount;
      let name = `${item.courseID} ${item.courseNumber}`;
      let professor = item.professorID;
      let passRate =
        ((item._sum.A! + item._sum.B! + item._sum.C! + item._sum.D!) /
          totalGradeCount) *
        100;
      let dropRate = (item._sum.W! / totalGradeCountIncludingDrops) * 100;
      let totalStudents = item._sum.total_students!;

      const rowDetailsObject: rowDetails = {
        course: name,
        professor: professor,
        gpa: gpa,
        passRate: passRate,
        dropRate: dropRate,
        totalStudents: totalStudents,
      };

      return rowDetailsObject;
    });

  //Sorting step
  allRows.sort((rowA, rowB) => {
    switch (sortType) {
      case "gpa":
        return rowB.gpa - rowA.gpa;

      case "passRate":
        return rowB.passRate - rowA.passRate;

      case "dropRate":
        return rowB.dropRate - rowA.dropRate;

      case "totalStudents":
        return rowB.totalStudents - rowA.totalStudents;

      default:
        return rowB.gpa - rowA.gpa;
    }
  });

  return allRows;
}

interface FilterTypes {
  subject: string | undefined;
  sortType: string | undefined;
  level: string | undefined;
}

// This function is called from the main explore page, and it calls a helper function
// to get data from db, then it returns the actual table, by calling the functional component
// and passing it the data it just received from the DB.
async function FilteredDataTableServer({
  subject,
  sortType,
  level,
}: FilterTypes) {
  const validSortTypes = ["gpa", "dropRate", "passRate", "totalStudents"];
  const validLevels = ["100", "200", "300", "400", "500", "600", "all"];

  //This also checks for undefined, by definition of null
  if (subject == null || sortType == null || level == null) {
    return null;
  }
  //Explicitly checking for valid subject (long array so did not specify it in filter types)
  else if (
    (subjectList.includes(subject) || subject == "all") &&
    validSortTypes.includes(sortType) &&
    validLevels.includes(level)
  ) {
    const data = await createTableRowsFromData({ subject, sortType, level });
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 w-full duration-700">
        <FilteredDataTable columns={columns} data={data} />
      </div>
    );
  } else
    return (
      <div className="flex h-20 w-full flex-col items-center justify-center">
        <h1 className="font-bold italic">Sorry, no results were found...</h1>
      </div>
    );
}

export { FilteredDataTableServer };
