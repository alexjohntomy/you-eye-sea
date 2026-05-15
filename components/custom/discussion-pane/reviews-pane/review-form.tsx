"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rating as ReactRating, ThinRoundedStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { postReview } from "@/app/_util/postReview";
import { Filter } from "bad-words";

const filter = new Filter();

const customStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: "var(--color-uic-navy-600)",
  inactiveFillColor:
    "color-mix(in srgb, var(--color-uic-navy-600) 20%, transparent)",
};

interface ReviewFormProps {
  parsedSlug: string[];
  professorID: string | null;
}

export function ReviewForm({ parsedSlug, professorID }: ReviewFormProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [rating, setRating] = useState(0);

  const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= 1500) {
      setValue(event.target.value);
    }
  };

  const handleSubmit = () => {
    if (filter.isProfane(value)) {
      setValue("Don't use profanity please.");
    } else if (value.trim().length > 1) {
      const reviewData = {
        review: value,
        courseID: parsedSlug[0],
        courseNumber: parseInt(parsedSlug[1]),
        professorID: professorID ? parseInt(professorID) : null,
        author: "Anonymous Fireball",
        stars: rating,
      };
      
      postReview(reviewData).then(() => {
        setValue("");
        setRating(0);
        router.refresh();
      });
    }
  };

  return (
    <div className="py-6">
      <InputGroup className="overflow-y border-foreground/10 bg-background has-[[data-slot=input-group-control]:focus-visible]:border-foreground/10 bottom-3 rounded-xl border shadow-none focus-visible:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0">
        <ReactRating
          className="relative top-2 max-w-44 md:max-w-30 lg:max-w-37.5 px-3 max-sm:mb-1.5"
          itemStyles={customStyles}
          value={rating}
          onChange={setRating}
        />
        <InputGroupTextarea
          className="resize-none border-none text-xs max-sm:text-sm tracking-wide placeholder:italic shadow-none"
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
            className="bg-secondary text-background dark:text-foreground dark:hover:text-foreground border-secondary/50 shadow-none px-3 rounded-lg border"
            size="xs"
            onClick={handleSubmit}
          >
            Submit
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
