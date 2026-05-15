import courseList from "@/cache/course-list";

function getCourseTitle(slug: string): string | null {
  const dashIndex = slug.lastIndexOf("-");
  const subject = slug.slice(0, dashIndex);
  const number = parseInt(slug.slice(dashIndex + 1), 10);
  if (isNaN(number)) return null;
  const entry = courseList.find(
    (course) => course.subject === subject && course.number === number
  );
  return entry?.title ?? null;
}

export { getCourseTitle };
