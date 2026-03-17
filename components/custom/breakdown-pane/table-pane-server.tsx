import { TablePane } from "@/components/custom/breakdown-pane/table-pane";
import prisma from "@/lib/prisma";

async function getCourseInstanceSums(courseName: string[]) {
  const courseInstanceAggregation = await prisma.courseInstance.groupBy({
    cacheStrategy: { ttl: 604800, swr: 86400 },
    by: ["courseInstanceID"],
    _sum: {
      A: true,
      B: true,
      C: true,
      D: true,
      F: true,
    },
    where: {
      courseID: courseName[0],
      courseNumber: parseInt(courseName[1]),
    },
  });

  return courseInstanceAggregation as unknown as {
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

function semesterToNumber(semester: string): number {
  const [term, year] = semester.split(/[_-]/);
  const termOrder: Record<string, number> = { spring: 1, summer: 2, fall: 3 };
  return parseInt(year) * 10 + (termOrder[term] ?? 0);
}

async function getStatsFromDB(courseName: string[]) {
  const statsFromDB = await prisma.courseInstance.findMany({
    cacheStrategy: { ttl: 604800, swr: 86400 },
    where: {
      courseID: courseName[0],
      courseNumber: parseInt(courseName[1]),
    },
    select: {
      A: true,
      total_students: true,
      professor: {
        select: {
          name: true,
          id: true,
        },
      },
      courseInstanceID: true,
      semester: true,
    },
  });
  return statsFromDB.sort(
    (a: { semester: string }, b: { semester: string }) =>
      semesterToNumber(b.semester) - semesterToNumber(a.semester)
  );
}

interface TablePaneServerProps {
  slug: string;
}

async function TablePaneServer({ slug }: TablePaneServerProps) {
  const parsedCourseName = slug.split("-") ?? ["test", "test"];
  const [statsFromDB, courseInstanceAggregation] = await Promise.all([
    getStatsFromDB(parsedCourseName),
    getCourseInstanceSums(parsedCourseName),
  ]);
  return (
    <TablePane
      statsFromDB={statsFromDB}
      courseInstanceAggregation={courseInstanceAggregation}
    />
  );
}

export { TablePaneServer };
