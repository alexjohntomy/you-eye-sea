"use client";
import { Rating as ReactRating, ThinRoundedStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useRouter } from "next/navigation";
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
  inactiveFillColor: "color-mix(in srgb, var(--color-uic-navy-600) 20%, transparent)",
};

import { Card } from "@/components/ui/card";

import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import { postReview } from "@/app/_util/postReview";

interface testProps {
  comments: any;
  parsedSlug: string[];
}

import { Filter } from "bad-words";
const filter = new Filter();

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

interface ReviewProps {
  reviews: Review[];
  parsedSlug: string[];
  professorID: any;
  listOfProfessors: any;
}

interface Professor {
  id: string;
  name: string;
}

function getProfessorNameFromID(
  professorID: string,
  listOfProfessors: Professor[]
) {
  let professorNameFromID: Professor = {
    name: "General Rating",
    id: "all-professors",
  };

  if (professorID == "all-professors" || !professorID) {
    professorNameFromID = { name: "General Rating", id: "all-professors" };
  } else {
    professorNameFromID = listOfProfessors.find(
      (professor: Professor) => professor.id === professorID
    ) ?? { name: "General Rating", id: "all-professors" };
  }
  return professorNameFromID.name;
}

function calculateAverageRating(ratings: Review[]) {
  const totalStars = ratings.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.stars ?? 0),
    0
  );
  return (totalStars / ratings.length).toFixed(2);
}

function ReviewsPane({
  reviews,
  parsedSlug,
  professorID,
  listOfProfessors,
}: ReviewProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= 1500) {
      setValue(event.target.value);
    }
  };
  const [rating, setRating] = useState(0);
  const commentPaneText =
    getProfessorNameFromID(professorID, listOfProfessors) === "General Rating"
      ? "this course"
      : getProfessorNameFromID(professorID, listOfProfessors);
  const avgRating = calculateAverageRating(reviews);
  if (reviews.length == 0) {
    return (
      <div className="flex h-full w-full flex-col justify-between">
        <Empty className="w-full border-0 p-4 opacity-55">
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
        <div className="py-6">
          <InputGroup className="overflow-y border-foreground/10 shadow-none bg-background bottom-3 rounded-xl border focus-visible:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-foreground/10">
            <ReactRating
              className="relative left-2 top-2 max-w-[110px] md:max-w-[120px] lg:max-w-[150px]"
              itemStyles={customStyles}
              value={rating}
              onChange={setRating}
            />
            <InputGroupTextarea
              className="resize-none border-none text-xs shadow-none"
              placeholder="How was your experience in this class? Let others know..."
              value={value}
              onChange={handleValueChange}
            />
            <InputGroupAddon align="block-end">
              <InputGroupText className="ml-auto">
                {value.length}/1500
              </InputGroupText>
              <InputGroupButton
                variant="outline"
                className="bg-secondary text-background dark:text-foreground border-secondary/50 shadow-none w-20 rounded-lg border"
                size="icon-xs"
                onClick={() => {
                  if (filter.isProfane(value)) {
                    setValue("Don't use profanity please.");
                  } else if (value.trim().length > 1 && professorID != null) {
                    (postReview(
                      // Defining review object
                      {
                        review: value,
                        courseID: parsedSlug[0],
                        courseNumber: parseInt(parsedSlug[1]),
                        professorID: parseInt(professorID),
                        author: "Anonymous Fireball",
                        stars: rating,
                      }
                    ),
                      setValue(""),
                      router.refresh());
                  } else if (value.trim().length > 1) {
                    (postReview({
                      review: value,
                      courseID: parsedSlug[0],
                      courseNumber: parseInt(parsedSlug[1]),
                      author: "Anonymous Fireball",
                      stars: rating,
                    }),
                      setValue(""),
                      router.refresh());
                  }
                }}
              >
                Submit
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    );
  } else
    return (
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full flex-col gap-3 overflow-y-scroll mask-b-from-90% py-2">
          <div className="flex max-h-10/12 w-full flex-col gap-3 pt-2 pr-2 pb-16 pl-1 md:min-h-screen">
            <h1 className="relative text-center text-sm font-medium">
              Average Rating:{" "}
              <span className="text-lg font-black">{avgRating}</span>
            </h1>
            {reviews.map((eachReview: Review) => (
              <Card
                key={eachReview.id}
                className="border-foreground/10 w-full gap-1 rounded-xl shadow-none px-3 py-3"
              >
                <ReactRating
                  style={{ maxWidth: 100 }}
                  value={eachReview.stars ?? 0}
                  readOnly
                  itemStyles={customStyles}
                />
                <h3 className="text-foreground/50 border-b py-1 text-sm font-black truncate">
                  {getProfessorNameFromID(
                    String(eachReview.professorID),
                    listOfProfessors
                  )}
                </h3>
                <h3 className="text-foreground/80 text-sm font-black whitespace-pre-wrap">
                  {eachReview.review}
                </h3>
                <span className="flex flex-row justify-between opacity-60">
                  <h4 className="text-uic-red-700 inline-block text-left text-xs">
                    {eachReview.author}
                  </h4>
                  <h4 className="text-foreground/40 inline-block text-left text-xs">
                    //
                  </h4>
                  <h4 className="text-foreground inline-block text-right text-xs">
                    {eachReview.date.toLocaleDateString("en-US")}
                  </h4>
                </span>
              </Card>
            ))}
          </div>
        </div>

        <div className="py-6">
          <InputGroup className="overflow-y border-foreground/10 shadow-none bg-background bottom-3 rounded-xl border focus-visible:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-foreground/10">
            <ReactRating
              className="relative top-2 max-w-[110px] md:max-w-[120px] lg:max-w-[150px]"
              itemStyles={customStyles}
              value={rating}
              onChange={setRating}
            />
            <InputGroupTextarea
              className="resize-none border-none text-xs shadow-none"
              placeholder="How was your experience in this class? Let others know..."
              value={value}
              onChange={handleValueChange}
            />
            <InputGroupAddon align="block-end">
              <InputGroupText className="ml-auto">
                {value.length}/1500
              </InputGroupText>
              <InputGroupButton
                variant="outline"
                className="bg-secondary text-background dark:text-foreground shadow-none border-secondary/50 w-20 rounded-lg border"
                size="icon-xs"
                onClick={() => {
                  if (filter.isProfane(value)) {
                    setValue("Don't use profanity please.");
                  } else if (value.trim().length > 1 && professorID != null) {
                    (postReview(
                      // Defining review object
                      {
                        review: value,
                        courseID: parsedSlug[0],
                        courseNumber: parseInt(parsedSlug[1]),
                        professorID: parseInt(professorID),
                        author: "Anonymous Fireball",
                        stars: rating,
                      }
                    ),
                      setValue(""),
                      router.refresh());
                  } else {
                    (postReview({
                      review: value,
                      courseID: parsedSlug[0],
                      courseNumber: parseInt(parsedSlug[1]),
                      author: "Anonymous Fireball",
                      stars: rating,
                    }),
                      setValue(""),
                      router.refresh());
                  }
                }}
              >
                Submit
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    );
}

export { ReviewsPane };
