import { formatGradeData } from "@/app/_util/formatGradeData";
import { CommentsPaneServer } from "@/components/custom/discussion-pane/comments-pane/comments-pane-server";
import { DiscussionPane } from "@/components/custom/discussion-pane/discussion-pane";
import { GradeDistributionChart } from "@/components/custom/visualization-pane/grade-distribution-chart";
import { ReviewsPaneServer } from "@/components/custom/discussion-pane/reviews-pane/reviews-pane-server";
import { TablePaneServer } from "@/components/custom/breakdown-pane/table-pane-server";
import { CourseHeaderServer } from "@/components/custom/visualization-pane/course-header-server";
import { getCourseDetails } from "@/app/_util/getCourseDetails";
import { cacheLife } from "next/cache";
import { cacheTag } from "next/cache";
import prisma, { prismaCacheStrategy } from "@/lib/prisma";
import type { Metadata } from "next";
import { Suspense } from "react";

async function getCourseInstance(
  slug: string,
  professor?: string,
  semester?: string
) {
  'use cache'
  cacheLife('semesterly')
  cacheTag('grade-data')

  const parsedSlug = slug.split("-");
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
    ...prismaCacheStrategy(604800, 86400),
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

async function GradeDistributionSection({
  slug,
  filteredParams,
}: {
  slug: string;
  filteredParams: { [key: string]: string | string[] | undefined };
}) {
  const professorFilter = Array.isArray(filteredParams.professor)
    ? filteredParams.professor[0]
    : filteredParams.professor;
  const semesterFilter = Array.isArray(filteredParams.semester)
    ? filteredParams.semester[0]
    : filteredParams.semester;

  const [courseDetails, GradeDistributionCount] = await Promise.all([
    getCourseDetails(slug),
    getCourseInstance(slug, professorFilter, semesterFilter),
  ]);
  const formattedGradeData = formatGradeData(GradeDistributionCount);
  const averageCourseSize =
    GradeDistributionCount?._avg?.total_students ?? null;

  return (
    <div className="animate-in fade-in flex min-h-0 flex-1 flex-col gap-4 duration-200">
      <GradeDistributionChart
        chartData={formattedGradeData}
        professorID={
          Array.isArray(filteredParams.professor)
            ? filteredParams.professor[0]
            : ((filteredParams.professor as string | undefined) ?? null)
        }
        listOfProfessors={courseDetails.professors}
        averageCourseSize={averageCourseSize}
        selectedSemester={
          Array.isArray(filteredParams.semester)
            ? filteredParams.semester[0]
            : ((filteredParams.semester as string | undefined) ?? null)
        }
      />
      <h5 className="text-foreground/50 text-center text-xs leading-tight">
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
    <DiscussionPane
      commentPaneServerComponent={
        <Suspense
          fallback={<div className="shimmer mt-4 min-h-60 w-full rounded-md" />}
        >
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
        <Suspense
          fallback={<div className="shimmer mt-4 min-h-60 w-full rounded-md" />}
        >
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

export default async function CourseDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filteredParams = await searchParams;
  const { slug } = await params;
  const slugParts = slug.split("-");

  return (
    <div className="bg-background animate-in fade-in flex h-full w-full min-w-87 grow flex-col overflow-hidden duration-150 md:h-[calc(100svh-120px)] md:flex-row">
      <div className="flex h-full w-full flex-col gap-2 overflow-y-auto p-6 md:w-1/2 md:overflow-hidden">
        <Suspense
          fallback={
            <div className="flex flex-row items-start justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-uic-red-600 text-4xl leading-tight font-black">
                  {slugParts[0]} {slugParts[1]}
                </h1>
                <div className="shimmer h-5 w-56 rounded-md" />
              </div>
              <div className="flex flex-row gap-2">
                <div className="shimmer h-8 w-28 rounded-md" />
                <div className="shimmer h-8 w-24 rounded-md" />
              </div>
            </div>
          }
        >
          <CourseHeaderServer
            slug={slug}
            filteredParams={filteredParams}
          />
        </Suspense>

        <div className="flex min-h-0 flex-1 flex-col pt-2">
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
                  <div className="shimmer mx-auto h-3 w-full rounded-md" />
                  <div className="shimmer mx-auto h-3 w-11/12 rounded-md" />
                  <div className="shimmer mx-auto h-3 w-10/12 rounded-md" />
                  <div className="shimmer visible mx-auto h-3 w-10/12 rounded-md md:invisible" />
                </div>
              </div>
            }
          >
            <GradeDistributionSection
              slug={slug}
              filteredParams={filteredParams}
            />
          </Suspense>
        </div>
      </div>

      {/* Middle: Discussion */}
      <section className="border-foreground/10 animate-in fade-in relative flex h-full w-full flex-col border-r border-l px-6 py-8 duration-200 md:w-1/4 md:max-w-1/4">
        <Suspense
          fallback={
            <div className="flex flex-col gap-4 pt-4">
              <div className="shimmer h-10 w-full rounded-lg" />
              <div className="shimmer mt-4 min-h-60 w-full rounded-md" />
            </div>
          }
        >
          <DiscussionSection
            slug={slug}
            filteredParams={filteredParams}
          />
        </Suspense>
      </section>

      {/* Right: Breakdown Table */}
      <section className="flex h-full w-full flex-col md:w-1/4 md:max-w-1/4">
        <h1 className="text-foreground relative z-10 pt-6 pb-3 text-center text-lg font-bold">
          Breakdown
        </h1>
        <Suspense
          fallback={
            <div className="flex flex-col gap-4 px-6">
              <div className="shimmer mb-4 h-35 w-full rounded-2xl" />
              <div className="flex flex-col gap-2">
                <div className="shimmer h-10 w-full rounded-md" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shimmer h-12 w-full rounded-md" />
                ))}
              </div>
              <div className="shimmer mx-auto mt-6 h-4 w-3/4 rounded-md" />
              <div className="shimmer mx-auto h-4 w-1/2 rounded-md" />
            </div>
          }
        >
          <div className="animate-in fade-in flex flex-1 flex-col min-h-0 w-full duration-200">
            <TablePaneServer slug={slug} />
          </div>
        </Suspense>
      </section>
    </div>
  );
}
