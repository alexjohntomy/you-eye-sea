"use client";
import { useRouter } from "next/navigation";
import { Rating as ReactRating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const customStyles = {
  itemShapes: ThinStar,
  activeFillColor: "#D50032",
  inactiveFillColor: "#D5003220",
};

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
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
  return totalStars / ratings.length;
}

function ReviewsPane({
  reviews,
  parsedSlug,
  professorID,
  listOfProfessors,
}: ReviewProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const handleValueChange: any = (event: any) => {
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
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col items-center align-middle justify-center p-4 h-full w-full">
          <h1 className="flex text-center italic text-foreground opacity-60">
            Looks like no ratings exist for {commentPaneText} yet... Help other
            students by adding your own!
          </h1>
        </div>
        <div className="py-6">
          <InputGroup className="overflow-y rounded-sm border-2 border-uic-navy-800/40 focus-visible:ring-0 bg-background">
            <ReactRating
              className="relative top-2 bottom-2"
              style={{ maxWidth: 150 }}
              itemStyles={customStyles}
              value={rating}
              onChange={setRating}
            />
            <InputGroupTextarea
              className="text-xs resize-none border-none shadow-none"
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
                className="rounded-md w-20 text-foreground border border-secondary/50"
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
  } else
    return (
      <div className="w-full h-full flex flex-col">
        {/* gradient overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-35 h-30 bg-transparent md:bg-linear-to-t from-background/90 to-background/0"></div>
        <div className="flex flex-col w-full py-1 overflow-y-scroll gap-0">
          <div className="flex flex-col w-full md:min-h-screen max-h-10/12 gap-3">
            <h1 className="relative text-center text-sm font-medium">
              Average Rating: <span className="font-black">{avgRating}</span>
            </h1>
            {reviews.map((eachReview: any) => (
              <Card
                key={eachReview.id}
                className="border-foreground/20 rounded-md gap-1 py-3 px-3 w-full"
              >
                <ReactRating
                  style={{ maxWidth: 100 }}
                  value={eachReview.stars}
                  readOnly
                  itemStyles={customStyles}
                />
                <h3 className="text-sm text-foreground/50 font-black border-b py-1">
                  {getProfessorNameFromID(
                    String(eachReview.professorID),
                    listOfProfessors
                  )}
                </h3>
                <h3 className="text-sm text-foreground/80 font-black">
                  {eachReview.review}
                </h3>
                <span className="flex flex-row justify-between opacity-60">
                  <h4 className="text-xs text-left inline-block text-uic-red-700">
                    {eachReview.author}
                  </h4>
                  <h4 className="text-xs text-left inline-block text-foreground/40">
                    //
                  </h4>
                  <h4 className="text-xs text-right inline-block text-foreground">
                    {eachReview.date.toLocaleDateString("en-US")}
                  </h4>
                </span>
              </Card>
            ))}
          </div>
        </div>

        <div className="py-6">
          <InputGroup className="overflow-y rounded-sm border-2 border-uic-navy-800/40 focus-visible:ring-0 bg-background">
            <ReactRating
              className="relative top-2 bottom-2"
              style={{ maxWidth: 150 }}
              itemStyles={customStyles}
              value={rating}
              onChange={setRating}
            />
            <InputGroupTextarea
              className="text-xs resize-none border-none shadow-none"
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
                className="rounded-md w-20 text-foreground border border-secondary/50"
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
