import { CourseHeaderSkeleton } from "@/components/custom/skeleton/course-header-skeleton";
import { GradeDistributionSkeleton } from "@/components/custom/skeleton/grade-distribution-skeleton";
import { DiscussionSkeleton } from "@/components/custom/skeleton/discussion-skeleton";
import { BreakdownTableSkeleton } from "@/components/custom/skeleton/breakdown-table-skeleton";

export default function Loading() {
  return (
    <div className="bg-background flex h-full w-full flex-col overflow-scroll md:h-[calc(100svh-120px)] md:flex-row">
      {/* Left: header + chart */}
      <div className="flex h-full w-full flex-col gap-2 p-6 md:w-1/2">
        <CourseHeaderSkeleton />
        <div className="flex min-h-0 flex-1 flex-col pt-2">
          <GradeDistributionSkeleton />
        </div>
      </div>

      {/* Middle: discussion */}
      <section className="border-foreground/5 relative flex min-h-60 w-full flex-col gap-4 border-r border-l px-6 pt-6 pb-4 md:h-full md:w-1/4 md:max-w-1/4">
        <DiscussionSkeleton />
      </section>

      {/* Right: breakdown table */}
      <section className="flex min-h-60 w-full flex-col md:h-full md:w-1/4 md:max-w-1/4">
        <h1 className="text-foreground relative z-10 pt-6 pb-3 text-center text-lg font-bold">
          Breakdown
        </h1>
        <BreakdownTableSkeleton />
      </section>
    </div>
  );
}
