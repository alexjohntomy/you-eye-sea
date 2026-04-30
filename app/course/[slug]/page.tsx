import { formatGradeData } from "@/app/_util/formatGradeData";
import { CommentsPaneServer } from "@/components/custom/discussion-pane/comments-pane/comments-pane-server";
import { DiscussionPane } from "@/components/custom/discussion-pane/discussion-pane";
import { GradeDistributionChart } from "@/components/custom/visualization-pane/grade-distribution-chart";
import { ProfessorDropdown } from "@/components/custom/visualization-pane/professor-dropdown";
import { SemesterDropdown } from "@/components/custom/visualization-pane/semester-dropdown";
import { ReviewsPaneServer } from "@/components/custom/discussion-pane/reviews-pane/reviews-pane-server";
import { TablePaneServer } from "@/components/custom/breakdown-pane/table-pane-server";
import prisma from "@/lib/prisma";
import { CourseActionButtons } from "@/components/custom/visualization-pane/course-action-buttons";
import type { Metadata } from "next";
import { cache, Suspense } from "react";

const getCourseDetails = cache(async function getCourseDetails(slug: string) {
  const parsedSlug = slug.split("-");
  const courses = await prisma.courseInstance.findMany({
    cacheStrategy: { ttl: 604800, swr: 86400 },
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

  interface Professor {
    id: string;
    name: string;
  }

  const seen = new Set<number>();
  const professors: Professor[] = [];
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
  const semesters = Array.from(semesterSet).sort();

  return { name: name, number: number, title: title, professors: professors, semesters: semesters };
});

async function getCourseInstance(slug: string, queryParams: { [key: string]: string | string[] | undefined }) {
  const parsedSlug = slug.split("-");
  const professor = Array.isArray(queryParams.professor) ? queryParams.professor[0] : queryParams.professor;
  const semester = Array.isArray(queryParams.semester) ? queryParams.semester[0] : queryParams.semester;

  const where: Record<string, unknown> = {
    courseID: parsedSlug[0],
    courseNumber: parseInt(parsedSlug[1]),
  };
  if (professor && professor !== "all-professors") {
    where.professorID = parseInt(professor);
  }
  if (semester && semester !== "all-semesters") {
    where.semester = semester;
  }

  return await prisma.courseInstance.aggregate({
    cacheStrategy: { ttl: 604800, swr: 86400 },
    _sum: { A: true, B: true, C: true, D: true, F: true, W: true },
    _avg: { total_students: true },
    where,
  });
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const filteredParams = await searchParams;
  const courseIDSlug = slug.replace("-", " ").toUpperCase();
  const professorQuery = filteredParams.professor
    ? `&professor=${encodeURIComponent(String(filteredParams.professor))}`
    : "";

  return {
    title: courseIDSlug + " | UIC Grade Distribution",
    description: `Grade distribution dashboard for ${courseIDSlug} at University of Illinois at Chicago (UIC).`,
    openGraph: {
      images: [
        {
          url: `/api/og?course=${slug}${professorQuery}`,
          width: 1200,
          height: 630,
          alt: `${courseIDSlug} Grade Distribution`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: courseIDSlug + " | UIC Grade Distribution",
      description: `Grade distribution dashboard for ${courseIDSlug} at University of Illinois at Chicago (UIC).`,
      images: [`/api/og?course=${slug}${professorQuery}`],
    },
  };
}

export default async function CourseDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filteredParams = await searchParams;
  const { slug } = await params;

  const courseDetails = await getCourseDetails(slug);
  const selectedProfessorName =
    courseDetails.professors.find(
      (p: { id: string; name: string }) =>
        p.id === String(filteredParams.professor)
    )?.name ?? "";

  return (
    <div className="bg-background animate-in fade-in flex h-full w-full min-w-87 grow flex-col overflow-hidden duration-150 md:h-[calc(100svh-120px)] md:flex-row">
      <div className="flex h-full w-full flex-col gap-2 overflow-y-auto md:overflow-hidden p-6 md:w-1/2">
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col">
            <h1 className="text-uic-red-600 text-4xl font-black leading-tight">
              {courseDetails.name} {courseDetails.number}
            </h1>
            <p className="text-foreground/70 text-lg font-medium leading-tight pb-1">
              {courseDetails.title}
            </p>
          </div>
          <div className="mt-1 flex flex-row gap-2">
            <SemesterDropdown semesters={courseDetails.semesters} />
            <ProfessorDropdown listOfProfessors={courseDetails.professors} />
          </div>
        </div>
        <CourseActionButtons
          courseName={courseDetails.name}
          courseNumber={courseDetails.number}
          selectedProfessorName={selectedProfessorName}
        />

        <div className="pt-2 flex-1 min-h-0 flex flex-col">
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                <div className="border-uic-navy-300/10 dark:border-foreground/5 flex flex-col justify-between gap-0 rounded-xl border py-8 shadow-none">
                  <div className="flex flex-row justify-between px-6 pb-2">
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="shimmer h-5 w-40 rounded-md xl:h-6" />
                      <div className="shimmer h-4 w-32 rounded-md" />
                    </div>
                    <div className="shimmer h-20 w-28 rounded-xl md:w-32" />
                  </div>
                  <div className="px-6">
                    <div className="shimmer aspect-video w-full rounded-lg" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 py-1">
                  <div className="shimmer h-3 w-full mx-auto rounded-md" />
                  <div className="shimmer h-3 w-11/12 mx-auto rounded-md" />
                  <div className="shimmer h-3 w-10/12 mx-auto rounded-md" />
                  <div className="md:invisible visible shimmer h-3 w-10/12 mx-auto rounded-md" />
                </div>
              </div>
            }
          >
            <GradeDistributionSection
              slug={slug}
              filteredParams={filteredParams}
              courseDetails={courseDetails}
            />
          </Suspense>
        </div>
      </div>

      {/* Middle: Discussion */}
      <section className="border-foreground/10 animate-in fade-in relative flex h-full w-full flex-col border-r border-l px-6 py-8 duration-350 md:w-1/4 md:max-w-1/4">
        <DiscussionSection
          slug={slug}
          filteredParams={filteredParams}
          courseDetails={courseDetails}
        />
      </section>

      {/* Right: Breakdown Table */}
      <section className="flex h-full w-full flex-col md:w-1/4 md:max-w-1/4">
        <h1 className="text-foreground pt-6 pb-3 text-center text-lg font-bold relative z-10">
          Breakdown
        </h1>
        <Suspense
          fallback={
            <div className="flex flex-col gap-4 px-6">
              <div className="shimmer h-35 w-full rounded-2xl mb-4" />
              <div className="flex flex-col gap-2">
                <div className="shimmer h-10 w-full rounded-md" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shimmer h-12 w-full rounded-md" />
                ))}
              </div>
              <div className="shimmer h-4 w-3/4 rounded-md mx-auto mt-6" />
              <div className="shimmer h-4 w-1/2 rounded-md mx-auto" />
            </div>
          }
        >
          <div className="animate-in fade-in h-full w-full duration-350">
            <TablePaneServer slug={slug} />
          </div>
        </Suspense>
      </section>
    </div>
  );
}

async function DiscussionSection({
  slug,
  filteredParams,
  courseDetails,
}: {
  slug: string;
  filteredParams: { [key: string]: string | string[] | undefined };
  courseDetails: any;
}) {
  return (
    <DiscussionPane
      commentPaneServerComponent={
        <Suspense fallback={<div className="shimmer min-h-60 w-full rounded-md mt-4" />}>
          <CommentsPaneServer
            slug={slug}
            professorID={
              Array.isArray(filteredParams.professor)
                ? filteredParams.professor[0]
                : (filteredParams.professor as string | undefined)
            }
          />
        </Suspense>
      }
      reviewPaneServerComponent={
        <Suspense fallback={<div className="shimmer min-h-60 w-full rounded-md mt-4" />}>
          <ReviewsPaneServer
            slug={slug}
            professorID={
              Array.isArray(filteredParams.professor)
                ? filteredParams.professor[0]
                : ((filteredParams.professor as string | undefined) ?? null)
            }
            listOfProfessors={courseDetails.professors}
          />
        </Suspense>
      }
    />
  );
}

async function GradeDistributionSection({
  slug,
  filteredParams,
  courseDetails,
}: {
  slug: string;
  filteredParams: { [key: string]: string | string[] | undefined };
  courseDetails: any;
}) {
  const GradeDistributionCount = await getCourseInstance(slug, filteredParams);
  const formattedGradeData = formatGradeData(GradeDistributionCount);
  const averageCourseSize =
    GradeDistributionCount?._avg?.total_students ?? null;

  return (
    <div className="animate-in fade-in flex flex-col gap-4 duration-350 flex-1 min-h-0">
      <GradeDistributionChart
        chartData={formattedGradeData}
        professorID={
          Array.isArray(filteredParams.professor)
            ? filteredParams.professor[0]
            : ((filteredParams.professor as string | undefined) ?? null)
        }
        listOfProfessors={courseDetails.professors}
        averageCourseSize={averageCourseSize}
      />
      <h5 className="text-foreground/50 text-center text-xs leading-tight">
        Data is sourced from official UIC grade distributions but stats are
        calculated in the backend, so it may contain errors. The pass rate
        denominator includes only A-F. Drop rate denominator includes W.
      </h5>
    </div>
  );
}
