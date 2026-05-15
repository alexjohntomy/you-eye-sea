import { ReviewsPane } from "@/components/custom/discussion-pane/reviews-pane/reviews-pane";
import { ReviewsListServer } from "./reviews-list-server";
import { Suspense } from "react";
import type { CourseDetails } from "@/app/_util/getCourseDetails";

interface ReviewsPaneServerProps {
  slug: string;
  professorID: string | null;
  courseDetailsPromise: Promise<CourseDetails>;
}

function ReviewsPaneServer({
  slug,
  professorID,
  courseDetailsPromise,
}: ReviewsPaneServerProps) {
  const parsedCourseName = slug.split("-") ?? ["test", "test"];

  return (
    <ReviewsPane
      parsedSlug={parsedCourseName}
      professorID={professorID}
    >
      <Suspense
        fallback={
          <div className="flex flex-col gap-4 py-4 mt-2">
            <div className="shimmer h-8 w-32 rounded-md mx-auto" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="shimmer h-32 w-full rounded-xl" />
            ))}
          </div>
        }
      >
        <ReviewsListServer
          parsedSlug={parsedCourseName}
          professorID={professorID}
          courseDetailsPromise={courseDetailsPromise}
        />
      </Suspense>
    </ReviewsPane>
  );
}

export { ReviewsPaneServer };
