import { TablePane } from "@/components/custom/breakdown-pane/table-pane";
import prisma, { prismaCacheStrategy } from "@/lib/prisma";
import { semesterToNumber } from "@/app/_util/semesterToNumber";

async function getStatsFromDB(courseName: string[]) {
  const statsFromDB = await prisma.courseInstance.findMany({
    ...prismaCacheStrategy(604800, 86400),
    where: {
      courseID: courseName[0],
      courseNumber: parseInt(courseName[1]),
    },
    select: {
      A: true,
      B: true,
      C: true,
      D: true,
      F: true,
      W: true,
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
  const statsFromDB = await getStatsFromDB(parsedCourseName);

  const courseInstanceAggregation = statsFromDB.map((row) => ({
    courseInstanceID: row.courseInstanceID,
    _sum: {
      A: row.A,
      B: row.B,
      C: row.C,
      D: row.D,
      F: row.F,
    },
  }));

  return (
    <TablePane
      statsFromDB={statsFromDB}
      courseInstanceAggregation={courseInstanceAggregation}
    />
  );
}

export { TablePaneServer };
