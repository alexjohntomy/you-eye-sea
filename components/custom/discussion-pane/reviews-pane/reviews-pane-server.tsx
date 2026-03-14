import { ReviewsPane } from "@/components/custom/discussion-pane/reviews-pane/reviews-pane";
import prisma from "@/lib/prisma";

async function getReviewsFromDB(courseName: string[], professorID: string | null) {
  if (
    !professorID ||
    professorID == null ||
    professorID == "" ||
    professorID == "all-professors"
  ) {
    const reviewsFromDB = await prisma.review.findMany({
      where: {
        courseID: courseName[0],
        courseNumber: parseInt(courseName[1]),
      },
    });
    return reviewsFromDB;
  } else {
    const reviewsFromDB = await prisma.review.findMany({
      where: {
        courseID: courseName[0],
        courseNumber: parseInt(courseName[1]),
        professorID: parseInt(professorID),
      },
    });
    return reviewsFromDB;
  }
}

interface Professor {
  id: string;
  name: string;
}

interface ReviewsPaneServerProps {
  slug: string;
  professorID: string | null;
  listOfProfessors: Professor[];
}

async function ReviewsPaneServer({
  slug,
  professorID,
  listOfProfessors,
}: ReviewsPaneServerProps) {
  const parsedCourseName = slug.split("-") ?? ["test", "test"];
  const reviewsFromDB = await getReviewsFromDB(parsedCourseName, professorID);
  return (
    <ReviewsPane
      reviews={reviewsFromDB}
      parsedSlug={parsedCourseName}
      professorID={professorID}
      listOfProfessors={listOfProfessors}
    />
  );
}

export { ReviewsPaneServer };
