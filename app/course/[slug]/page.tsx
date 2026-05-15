import { formatGradeData } from "@/app/_util/formatGradeData";
import { CommentsPaneServer } from "@/components/custom/discussion-pane/comments-pane/comments-pane-server";
import { DiscussionPane } from "@/components/custom/discussion-pane/discussion-pane";
import { GradeDistributionChart } from "@/components/custom/visualization-pane/grade-distribution-chart";
import { ReviewsPaneServer } from "@/components/custom/discussion-pane/reviews-pane/reviews-pane-server";
import { TablePaneServer } from "@/components/custom/breakdown-pane/table-pane-server";
import { CourseHeaderTitle, CourseHeaderDropdownGroup, CourseHeaderActionGroup } from "@/components/custom/visualization-pane/course-header-server";
import { GradeDistributionSkeleton } from "@/components/custom/skeleton/grade-distribution-skeleton";
import { DiscussionSkeleton } from "@/components/custom/skeleton/discussion-skeleton";
import { BreakdownTableSkeleton } from "@/components/custom/skeleton/breakdown-table-skeleton";
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

function DiscussionSection({
  slug,
  filteredParams,
}: {
  slug: string;
  filteredParams: { [key: string]: string | string[] | undefined };
}) {
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
            courseDetailsPromise={getCourseDetails(slug)}
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

  return (
    <div className="bg-background animate-in fade-in flex h-full w-full min-w-87 grow flex-col overflow-hidden duration-150 md:h-[calc(100svh-120px)] md:flex-row">
      <div className="flex h-full w-full flex-col gap-2 overflow-y-auto p-6 md:w-1/2 md:overflow-hidden">
        {/* Title renders instantly from cache — no DB needed */}
        <div className="flex flex-row items-start justify-between">
          <CourseHeaderTitle slug={slug} />
          <Suspense
            fallback={
              <div className="mt-1 flex flex-col gap-2 md:flex-row">
                <div className="shimmer h-10 w-32 rounded-xl" />
                <div className="shimmer h-10 w-32 rounded-xl" />
              </div>
            }
          >
            <CourseHeaderDropdownGroup
              slug={slug}
              filteredParams={filteredParams}
            />
          </Suspense>
        </div>

        {/* Action buttons suspend separately */}
        <Suspense
          fallback={
            <div className="flex min-w-full flex-col gap-2 pt-2 xl:flex-row">
              <div className="flex-1">
                <div className="shimmer h-8.5 w-full rounded-lg" />
              </div>
              <div className="flex-1">
                <div className="shimmer h-8.5 w-full rounded-lg" />
              </div>
            </div>
          }
        >
          <CourseHeaderActionGroup
            slug={slug}
            filteredParams={filteredParams}
          />
        </Suspense>

        <div className="flex min-h-0 flex-1 flex-col pt-2">
          <Suspense fallback={<GradeDistributionSkeleton />}>
            <GradeDistributionSection
              slug={slug}
              filteredParams={filteredParams}
            />
          </Suspense>
        </div>
      </div>

      {/* Middle: Discussion */}
      <section className="border-foreground/10 animate-in fade-in relative flex h-full w-full flex-col border-r border-l px-6 pt-6 pb-8 duration-200 md:w-1/4 md:max-w-1/4">

        <Suspense fallback={<DiscussionSkeleton />}>
          <DiscussionSection
            slug={slug}
            filteredParams={filteredParams}
          />
        </Suspense>
      </section>

      {/* Right: Breakdown Table */}
      <section className="flex h-full w-full flex-col md:w-[23%] md:max-w-[23%]">
        <h1 className="text-foreground relative z-10 mt-2.5 pt-6 pb-3 text-center text-lg font-bold">
          Breakdown
        </h1>
        <Suspense fallback={<BreakdownTableSkeleton />}>
          <div className="animate-in fade-in flex flex-1 flex-col min-h-0 w-full duration-200">
            <TablePaneServer slug={slug} />
          </div>
        </Suspense>
      </section>
    </div>
  );
}
