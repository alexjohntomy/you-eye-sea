import { getProfessorNameFromList } from "@/app/_util/getProfessorNameFromID";
import { Rating as ReactRating, ThinRoundedStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Star } from "lucide-react";

const customStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: "var(--color-uic-navy-600)",
  inactiveFillColor:
    "color-mix(in srgb, var(--color-uic-navy-600) 20%, transparent)",
};

interface Review {
  id: number;
  review: string;
  courseID: string | null;
  courseNumber: number | null;
  professorID: number | null;
  date: Date;
  author: string | null;
  stars: number | null;
}

interface Professor {
  id: string;
  name: string;
}

async function getReviewsFromDB(courseName: string[], professorID: string | null) {
  const isAllProfessors = !professorID || professorID === "all-professors";
  const reviewsFromDB = await prisma.review.findMany({
    cacheStrategy: { ttl: 60, swr: 30 },
    where: {
      courseID: courseName[0],
      courseNumber: parseInt(courseName[1]),
      professorID: isAllProfessors ? undefined : parseInt(professorID),
    },
    orderBy: { date: 'desc' }
  });
  return reviewsFromDB;
}

function calculateAverageRating(ratings: Review[]) {
  if (ratings.length === 0) return "0.00";
  const totalStars = ratings.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.stars ?? 0),
    0
  );
  return (totalStars / ratings.length).toFixed(2);
}

export async function ReviewsListServer({
  parsedSlug,
  professorID,
  listOfProfessors,
}: {
  parsedSlug: string[];
  professorID: string | null;
  listOfProfessors: Professor[];
}) {
  const reviews = await getReviewsFromDB(parsedSlug, professorID);
  const professorName = getProfessorNameFromList(professorID, listOfProfessors, "General Rating");
  const commentPaneText = professorName === "General Rating" ? "this course" : professorName;
  const avgRating = calculateAverageRating(reviews);

  if (reviews.length === 0) {
    return (
      <div className="flex w-full flex-col p-4 opacity-55 animate-in fade-in duration-500">
        <Empty className="w-full border-0">
          <EmptyHeader className="gap-0.5 md:w-50">
            <EmptyMedia variant="icon" className="bg-muted/50 mb-0 size-12">
              <Star className="text-muted-foreground size-6" />
            </EmptyMedia>
            <EmptyTitle className="text-muted-foreground text-base font-medium">
              No ratings yet
            </EmptyTitle>
            <EmptyDescription className="text-sm">
              Looks like no ratings exist for {commentPaneText} yet... Help
              other students by adding your own!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 py-2 animate-in fade-in duration-500">
      <div className="flex max-h-11/12 w-full flex-col gap-3 pt-2 pr-2 pb-8 pl-2">
        <h1 className="relative text-center text-sm font-medium">
          Average Rating:{" "}
          <span className="text-lg font-black">{avgRating}</span>
        </h1>
        {reviews.map((eachReview: Review) => (
          <Card
            key={eachReview.id}
            className="border-foreground/10 w-full gap-1 rounded-xl px-3 py-3 shadow-none overflow-hidden"
          >
            <ReactRating
              style={{ maxWidth: 80 }}
              value={eachReview.stars ?? 0}
              readOnly
              itemStyles={customStyles}
            />
            <h3 className="text-foreground/50 truncate border-b py-1 text-sm font-black">
              {getProfessorNameFromList(String(eachReview.professorID), listOfProfessors, "General Rating")}
            </h3>
            <h3 className="text-foreground/80 text-sm font-black whitespace-pre-wrap mt-1 leading-tight">
              {eachReview.review}
            </h3>
            <span className="flex flex-row justify-between opacity-50 mt-2">
              <h4 className="text-uic-red-700 inline-block text-left text-[10px] font-bold">
                {eachReview.author}
              </h4>
              <h4 className="text-foreground inline-block text-right text-[10px] font-medium">
                {eachReview.date.toLocaleDateString("en-US")}
              </h4>
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
