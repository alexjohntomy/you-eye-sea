import { getCourseDetails } from "@/app/_util/getCourseDetails";
import { CourseActionButtons } from "@/components/custom/visualization-pane/course-action-buttons";
import { ProfessorDropdown } from "@/components/custom/visualization-pane/professor-dropdown";
import { SemesterDropdown } from "@/components/custom/visualization-pane/semester-dropdown";

async function CourseHeaderServer({
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
    <>
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-uic-red-600 text-4xl leading-tight font-black">
            {courseDetails.name} {courseDetails.number}
          </h1>
          <p className="text-foreground/70 pb-1 text-lg leading-tight font-medium">
            {courseDetails.title}
          </p>
        </div>
        <div className="mt-1 flex flex-col gap-2 md:flex-row">
          <SemesterDropdown semesters={courseDetails.semesters} />
          <ProfessorDropdown listOfProfessors={courseDetails.professors} />
        </div>
      </div>
      <CourseActionButtons
        courseName={courseDetails.name}
        courseNumber={courseDetails.number}
        selectedProfessorName={selectedProfessorName}
      />
    </>
  );
}

export { CourseHeaderServer };
