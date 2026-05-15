import { getCourseDetails } from "@/app/_util/getCourseDetails";
import { getCourseTitle } from "@/app/_util/getCourseTitle";
import { CourseActionButtons } from "@/components/custom/visualization-pane/course-action-buttons";
import { ProfessorDropdown } from "@/components/custom/visualization-pane/professor-dropdown";
import { SemesterDropdown } from "@/components/custom/visualization-pane/semester-dropdown";

function CourseHeaderTitle({ slug }: { slug: string }) {
  const [subject, number] = slug.split("-");
  const title = getCourseTitle(slug);

  return (
    <div className="flex min-w-0 flex-col">
      <h1 className="text-uic-red-600 text-4xl leading-tight font-black">
        {subject} {number}
      </h1>
      {title && (
        <p className="text-foreground/70 text-md leading-none font-medium">
          {title}
        </p>
      )}
    </div>
  );
}

async function CourseHeaderDropdownGroup({
  slug,
  filteredParams,
}: {
  slug: string;
  filteredParams: { [key: string]: string | string[] | undefined };
}) {
  const courseDetails = await getCourseDetails(slug);

  return (
    <div className="mt-1 flex shrink-0 flex-col gap-2 md:flex-row">
      <SemesterDropdown semesters={courseDetails.semesters} />
      <ProfessorDropdown listOfProfessors={courseDetails.professors} />
    </div>
  );
}

async function CourseHeaderActionGroup({
  slug,
  filteredParams,
}: {
  slug: string;
  filteredParams: { [key: string]: string | string[] | undefined };
}) {
  const courseDetails = await getCourseDetails(slug);
  const selectedProfessorName =
    courseDetails.professors.find(
      (p) => p.id === String(filteredParams.professor)
    )?.name ?? "";

  return (
    <CourseActionButtons
      courseName={courseDetails.name}
      courseNumber={courseDetails.number}
      selectedProfessorName={selectedProfessorName}
    />
  );
}

export { CourseHeaderTitle, CourseHeaderDropdownGroup, CourseHeaderActionGroup };
