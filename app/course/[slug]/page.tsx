import { formatGradeData } from "@/app/_util/formatGradeData";
import { CommentsPaneServer } from "@/components/custom/discussion-pane/comments-pane/comments-pane-server";
import { DiscussionPane } from "@/components/custom/discussion-pane/discussion-pane";
import { GradeDistributionChart } from "@/components/custom/visualization-pane/grade-distribution-chart";
import { ProfessorDropdown } from "@/components/custom/visualization-pane/professor-dropdown";
import { ReviewsPaneServer } from "@/components/custom/discussion-pane/reviews-pane/reviews-pane-server";
import { TablePaneServer } from "@/components/custom/breakdown-pane/table-pane-server";
import prisma from "@/lib/prisma";
import { CourseActionButtons } from "@/components/custom/visualization-pane/course-action-buttons";
import type { Metadata } from "next";
import { Suspense } from "react";

async function getCourseDetails(slug: string) {
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
  courses.forEach((course: any) => {
    if (!seen.has(course.professor.id)) {
      professors.push({
        id: String(course.professor.id),
        name: course.professor.name,
      });
      seen.add(course.professor.id);
    }
  });

  return { name: name, number: number, title: title, professors: professors };
}

async function getCourseInstance(slug: string, queryParams: any) {
  const parsedSlug = slug.split("-");
  const professor = queryParams.professor;
  if (professor == "all-professors" || !professor) {
    return await prisma.courseInstance.aggregate({
      cacheStrategy: { ttl: 604800, swr: 86400 },
      _sum: {
        A: true,
        B: true,
        C: true,
        D: true,
        F: true,
        W: true,
      },
      _avg: {
        total_students: true,
      },
      where: {
        courseID: parsedSlug[0],
        courseNumber: parseInt(parsedSlug[1]),
      },
    });
  } else {
    return await prisma.courseInstance.aggregate({
      cacheStrategy: { ttl: 604800, swr: 86400 },
      _sum: {
        A: true,
        B: true,
        C: true,
        D: true,
        F: true,
        W: true,
      },
      _avg: {
        total_students: true,
      },
      where: {
        courseID: parsedSlug[0],
        courseNumber: parseInt(parsedSlug[1]),
        professorID: parseInt(professor),
      },
    });
  }
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
    ? `&professor=${filteredParams.professor}`
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

async function StatsSection({
  slug,
  filteredParams,
}: {
  slug: string;
  filteredParams: { [key: string]: string | string[] | undefined };
}) {
  const [courseDetails, GradeDistributionCount] = await Promise.all([
    getCourseDetails(slug),
    getCourseInstance(slug, filteredParams),
  ]);
  const formattedGradeData = formatGradeData(GradeDistributionCount);
  const selectedProfessorName =
    courseDetails.professors.find(
      (p: { id: string; name: string }) =>
        p.id === String(filteredParams.professor)
    )?.name ?? "";

  const averageCourseSize =
    GradeDistributionCount?._avg?.total_students ?? null;

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-scroll p-6 md:w-1/2">
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-uic-red-600 text-4xl font-black">
            {courseDetails.name} {courseDetails.number}
          </h1>
          <p className="text-foreground/70 text-lg font-medium">
            {courseDetails.title}
          </p>
        </div>
        <div className="mt-1">
          <ProfessorDropdown
            listOfProfessors={courseDetails.professors}
          ></ProfessorDropdown>
        </div>
      </div>
      <CourseActionButtons
        courseName={courseDetails.name}
        courseNumber={courseDetails.number}
        selectedProfessorName={selectedProfessorName}
      />
      <div className="pt-2">
        <GradeDistributionChart
          chartData={formattedGradeData}
          professorID={
            Array.isArray(filteredParams.professor)
              ? filteredParams.professor[0]
              : ((filteredParams.professor as string | undefined) ?? null)
          }
          listOfProfessors={courseDetails.professors}
          averageCourseSize={averageCourseSize}
        ></GradeDistributionChart>
      </div>
      <h5 className="text-foreground/50 py-2 text-center text-xs">
        Data is sourced from official UIC grade distributions but stats are
        calculated in the backend, so it may contain errors. The pass rate
        denominator includes only A-F. Drop rate denominator includes W.
      </h5>
    </div>
  );
}

async function DiscussionSection({
  slug,
  filteredParams,
}: {
  slug: string;
  filteredParams: { [key: string]: string | string[] | undefined };
}) {
  const courseDetails = await getCourseDetails(slug);
  return (
    <section className="border-foreground/10 animate-in fade-in relative h-full w-full border-r border-l px-6 py-8 duration-500 md:w-1/4 md:max-w-1/4">
      <DiscussionPane
        commentPaneServerComponent={
          <CommentsPaneServer
            slug={slug}
            professorID={
              Array.isArray(filteredParams.professor)
                ? filteredParams.professor[0]
                : (filteredParams.professor as string | undefined)
            }
          ></CommentsPaneServer>
        }
        reviewPaneServerComponent={
          <ReviewsPaneServer
            slug={slug}
            professorID={
              Array.isArray(filteredParams.professor)
                ? filteredParams.professor[0]
                : ((filteredParams.professor as string | undefined) ?? null)
            }
            listOfProfessors={courseDetails.professors}
          ></ReviewsPaneServer>
        }
      ></DiscussionPane>
    </section>
  );
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

  return (
    <div className="bg-background animate-in fade-in flex h-full w-full min-w-87 grow flex-col overflow-hidden duration-150 md:h-[calc(100svh-120px)] md:flex-row">
      {/* Stats */}
      <Suspense
        fallback={
          <div className="flex h-full w-full flex-col gap-2 overflow-scroll p-6 md:w-1/2">
            <div className="shimmer h-10 w-48 rounded-md"></div>
            <div className="shimmer h-6 w-64 rounded-md"></div>
            <div className="shimmer mt-4 h-64 w-full rounded-md"></div>
          </div>
        }
      >
        <StatsSection slug={slug} filteredParams={filteredParams} />
      </Suspense>

      {/* Comments */}
      <Suspense
        fallback={
          <section className="border-foreground/5 relative h-full w-full border-r border-l p-8 md:w-1/4 md:max-w-1/4">
            <div className="flex h-full flex-col gap-4">
              <div className="shimmer h-10/12 rounded-md"></div>
              <div className="shimmer h-2/12 rounded-md"></div>
            </div>
          </section>
        }
      >
        <DiscussionSection slug={slug} filteredParams={filteredParams} />
      </Suspense>

      <Suspense
        fallback={
          <section className="h-full w-full p-8 md:w-1/4 md:max-w-1/4">
            <div className="flex h-full flex-col gap-5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="shimmer h-full w-full rounded-md"></div>
              ))}
            </div>
          </section>
        }
      >
        <section className="animate-in fade-in h-full w-full duration-500 md:w-1/4 md:max-w-1/4">
          <TablePaneServer slug={slug} />
        </section>
      </Suspense>
    </div>
  );
}
