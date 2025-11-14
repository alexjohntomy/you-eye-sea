import { formatGradeData } from "@/app/_util/formatGradeData";
import { CommentsPaneServer } from "@/components/custom/comments-pane-server";
import { DiscussionPane } from "@/components/custom/discussion-pane";
import { GradeDistributionChart } from "@/components/custom/grade-distribution-chart";
import { ProfessorDropdown } from "@/components/custom/professor-dropdown";
import { ReviewsPaneServer } from "@/components/custom/reviews-pane-server";
import { TablePaneServer } from "@/components/custom/table-pane-server";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Course Details",
};

async function getCourseDetails(slug: string) {
  const parsedSlug = slug.split("-");
  console.log(parsedSlug[0]);
  console.log(parsedSlug[1]);
  const courses = await prisma.courseInstance.findMany({
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
  courses.forEach((course) => {
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
      _sum: {
        A: true,
        B: true,
        C: true,
        D: true,
        F: true,
        W: true,
      },
      where: {
        courseID: parsedSlug[0],
        courseNumber: parseInt(parsedSlug[1]),
      },
    });
  } else {
    return await prisma.courseInstance.aggregate({
      _sum: {
        A: true,
        B: true,
        C: true,
        D: true,
        F: true,
        W: true,
      },
      where: {
        courseID: parsedSlug[0],
        courseNumber: parseInt(parsedSlug[1]),
        professorID: parseInt(professor),
      },
    });
  }
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
  const parsedSlug = slug.split("-");
  const courseDetails = await getCourseDetails(slug);
  const GradeDistributionCount = await getCourseInstance(slug, filteredParams);
  const formattedGradeData = formatGradeData(GradeDistributionCount);
  const encodedURL =
    "https://catalog.uic.edu/ucat/course-descriptions/" +
    parsedSlug[0].toLowerCase() +
    "/#:~:text=" +
    encodeURIComponent(`${courseDetails.name} ${courseDetails.number}`);

  return (
    <div className="flex flex-col md:flex-row grow bg-background w-full h-full md:h-[calc(100svh-120px)] overflow-hidden">
      {/* Stats */}
      <div className="flex flex-col w-full md:w-1/2 p-8 h-full gap-2 overflow-scroll">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <h1 className="text-uic-red-600 font-black text-4xl">
              {courseDetails.name} {courseDetails.number}
            </h1>
            <p className="text-foreground/70 font-medium text-lg">
              {courseDetails.title}
            </p>
          </div>
          <ProfessorDropdown
            listOfProfessors={courseDetails.professors}
          ></ProfessorDropdown>
        </div>
        <Link href={encodedURL} className="w-fit">
          <Badge
            variant="outline"
            className="flex-row gap-2 relative bottom-1 rounded-md text-xs font-semibold px-3 py-2 bg-badge-bg/90 text-badge-text border-badge-border/20 shadow-[inset_0px_-6px_10px_2px_var(--badge-shadow-base)]/40 hover:bg-badge-bg "
          >
            View in Course Catalog
            <ExternalLink className="opacity-70 relative" />
          </Badge>
        </Link>
        <div className="">
          <GradeDistributionChart
            chartData={formattedGradeData}
            professorID={filteredParams.professor}
            listOfProfessors={courseDetails.professors}
          ></GradeDistributionChart>
        </div>
        <h5 className="py-2 text-xs text-center text-foreground/50">
          Data is sourced from official UIC grade distributions but many of the
          stats are calculated in the backend, so it may contain errors. The
          pass rate denominator includes only A-F. The drop rate denominator
          includes W.
        </h5>
      </div>

      {/* Comments */}
      <section className="w-full md:max-w-1/4 md:w-1/4 h-full p-8 relative border-r border-l border-foreground/10">
        <DiscussionPane
          commentPaneServerComponent={
            <CommentsPaneServer
              slug={slug}
              professorID={filteredParams.professor}
            ></CommentsPaneServer>
          }
          reviewPaneServerComponent={
            <ReviewsPaneServer
              slug={slug}
              professorID={filteredParams.professor}
              listOfProfessors={courseDetails.professors}
            ></ReviewsPaneServer>
          }
        ></DiscussionPane>
      </section>

      <section className="w-full md:max-w-1/4 md:w-1/4 h-full">
        <TablePaneServer slug={slug} />
      </section>
    </div>
  );
}
