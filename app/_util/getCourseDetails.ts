import { cache } from "react";
import { cacheLife } from "next/cache";
import { cacheTag } from "next/cache";
import prisma, { prismaCacheStrategy } from "@/lib/prisma";
import { semesterToNumber } from "@/app/_util/semesterToNumber";

interface CourseDetails {
  name: string;
  number: string;
  title: string;
  professors: { id: string; name: string }[];
  semesters: string[];
}

const getCourseDetails = cache(async function getCourseDetails(
  slug: string
): Promise<CourseDetails> {
  'use cache'
  cacheLife('semesterly')
  cacheTag('grade-data')

  const parsedSlug = slug.split("-");
  const courses = await prisma.courseInstance.findMany({
    ...prismaCacheStrategy(604800, 86400),
    where: {
      courseID: parsedSlug[0],
      courseNumber: parseInt(parsedSlug[1]),
    },
    select: {
      course: {
        select: {
          title: true,
        },
      },
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

  const name = parsedSlug[0];
  const number = parsedSlug[1];
  const title = courses[0].course.title;

  const seen = new Set<number>();
  const professors: { id: string; name: string }[] = [];
  const semesterSet = new Set<string>();
  courses.forEach((course) => {
    if (!seen.has(course.professor.id)) {
      professors.push({
        id: String(course.professor.id),
        name: course.professor.name,
      });
      seen.add(course.professor.id);
    }
    semesterSet.add(course.semester);
  });
  const semesters = Array.from(semesterSet).sort(
    (a: string, b: string) => semesterToNumber(b) - semesterToNumber(a)
  );

  return {
    name,
    number,
    title,
    professors,
    semesters,
  };
});

export { getCourseDetails };
export type { CourseDetails };
