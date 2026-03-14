"use client";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { MessageCircleDashed } from "lucide-react";

import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import { postComment } from "@/app/_util/postComment";

interface Comment {
  id: number;
  comment: string;
  courseID: string | null;
  courseNumber: number | null;
  date: Date;
  author: string | null;
}

interface testProps {
  comments: Comment[];
  parsedSlug: string[];
  professorID?: string;
}

import { Filter } from "bad-words";

const filter = new Filter();

function CommentsPane({ comments, parsedSlug, professorID }: testProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= 280) {
      setValue(event.target.value);
    }
  };

  const inputBox = (
    <div className="py-6">
      <InputGroup className="overflow-y rounded-md border border-foreground/10 focus-visible:ring-0 bg-background">
        <InputGroupTextarea
          className="text-xs resize-none border-none shadow-none"
          placeholder="Post a short tip you have for this course..."
          value={value}
          onChange={handleValueChange}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="ml-auto">
            {value.length}/280
          </InputGroupText>
          <InputGroupButton
            variant="outline"
            className="rounded-md w-20 text-foreground border border-secondary/50"
            size="icon-xs"
            onClick={() => {
              if (filter.isProfane(value)) {
                setValue("Don't use profanity please.");
              } else if (value.trim().length > 1) {
                (postComment({
                  comment: value,
                  author: "Anonymous Fireball",
                  courseID: parsedSlug[0],
                  courseNumber: parseInt(parsedSlug[1]),
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
  );

  if (comments.length === 0) {
    return (
      <div className="flex flex-col h-full justify-between">
        <Empty className="border-0 p-4 opacity-55">
          <EmptyHeader className="max-w-full gap-0.5">
            <EmptyMedia variant="icon" className="bg-muted/50 size-12 mb-0">
              <MessageCircleDashed className="text-muted-foreground size-6" />
            </EmptyMedia>
            <EmptyTitle className="text-muted-foreground text-base font-medium">No tips yet</EmptyTitle>
            <EmptyDescription className="text-sm max-w-full">
              Looks like no tips exist for this course yet... Help other students by adding your own!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
        {inputBox}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-35 h-30 bg-transparent md:bg-linear-to-t from-background/90 to-background/0"></div>
      <div className="flex flex-col w-full py-2 overflow-y-scroll gap-3">
        <div className="flex flex-col w-full md:min-h-screen max-h-10/12 gap-3">
          {comments.map((eachComment: Comment) => (
            <Card
              key={eachComment.id}
              className="border-foreground/10 rounded-md gap-1 py-3 px-3 w-full"
            >
              <h3 className="text-sm text-foreground/80 font-black">
                {eachComment.comment}
              </h3>
              <span className="flex flex-row justify-between opacity-60">
                <h4 className="text-xs text-left inline-block text-uic-red-700">
                  {eachComment.author}
                </h4>
                <h4 className="text-xs text-left inline-block text-foreground/40">
                  //
                </h4>
                <h4 className="text-xs text-right inline-block text-foreground">
                  {eachComment.date.toLocaleDateString("en-US")}
                </h4>
              </span>
            </Card>
          ))}
        </div>
      </div>
      {inputBox}
    </div>
  );
}

export { CommentsPane };
