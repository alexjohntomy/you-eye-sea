"use client";

import { ReviewForm } from "./review-form";

interface ReviewProps {
  children: React.ReactNode;
  parsedSlug: string[];
  professorID: string | null;
}

function ReviewsPane({
  children,
  parsedSlug,
  professorID,
}: ReviewProps) {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="flex-1 overflow-y-scroll mask-b-from-90%">
        {children}
      </div>
      <ReviewForm parsedSlug={parsedSlug} professorID={professorID} />
    </div>
  );
}

export { ReviewsPane };
