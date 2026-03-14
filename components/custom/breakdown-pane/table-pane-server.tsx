import { TablePane } from "@/components/custom/breakdown-pane/table-pane";
import prisma from "@/lib/prisma";

async function getCourseInstanceSums(courseName: any) {
  const courseInstanceAggregation = await prisma.courseInstance.groupBy({
    cacheStrategy: { ttl: 86400, swr: 86400 },
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

  return courseInstanceAggregation;
}

function semesterToNumber(semester: string): number {
  const [term, year] = semester.split(/[_-]/);
  const termOrder: Record<string, number> = { spring: 1, summer: 2, fall: 3 };
  return parseInt(year) * 10 + (termOrder[term] ?? 0);
}

async function getStatsFromDB(courseName: any) {
  const statsFromDB = await prisma.courseInstance.findMany({
    cacheStrategy: { ttl: 86400, swr: 86400 },
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
  return statsFromDB.sort((a, b) => semesterToNumber(b.semester) - semesterToNumber(a.semester));
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
