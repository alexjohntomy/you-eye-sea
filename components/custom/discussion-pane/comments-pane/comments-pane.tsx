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

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PeelWrapper,
  PeelTop,
  PeelBack,
  PeelBottom,
  usePeel,
} from "react-peel";

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

const postItColors = [
  { main: "bg-postit-yellow", back: "bg-postit-yellow-back" }, // Yellow
  { main: "bg-postit-blue", back: "bg-postit-blue-back" }, // Blue
  { main: "bg-postit-pink", back: "bg-postit-pink-back" }, // Pink
  { main: "bg-postit-green", back: "bg-postit-green-back" }, // Green
];

function StickyNoteComment({
  comment,
  index,
  isNew,
  delay = 500,
}: {
  comment: Comment;
  index: number;
  isNew: boolean;
  delay?: number;
}) {
  const { peelRef, animate, reset, setPosition } = usePeel();
  const color = postItColors[comment.id % postItColors.length];
  const [shouldAnimate, setShouldAnimate] = useState(isNew);
  const [isVisible, setIsVisible] = useState(!isNew);
  const [activeDelay] = useState(delay);

  useEffect(() => {
    if (shouldAnimate) {
      const stickDown = async () => {
        if (!peelRef.current) return;
        const width = peelRef.current.width || 300;
        const height = peelRef.current.height || 120;

        // Start fully curled/invisible immediately before we become CSS visible
        setPosition(-width, -height);
        setIsVisible(true);

        // Sleep 50ms so the CSS fade-in can start and the canvas can draw the curled state
        await new Promise((resolve) => setTimeout(resolve, 50));

        try {
          // Bottom-Right corner: x=width, y=height is flat.
          // x=-width, y=-height is fully curled/pulled all the way top-left.
          await animate({
            from: { x: -width, y: -height },
            to: { x: width, y: height },
            duration: 500,
            easing: "easeOut",
          });
        } finally {
          reset();
          setShouldAnimate(false);
        }
      };

      // Delay to allow DOM sizing to settle, plus any staggered entry delay
      const timeout = setTimeout(stickDown, activeDelay + 50);
      return () => clearTimeout(timeout);
    }
  }, [shouldAnimate, animate, reset, peelRef, setPosition, activeDelay]);

  const content = (
    <div
      className={`flex h-full w-full flex-col justify-between gap-2 p-4 pt-5 shadow-sm ${color.main}`}
    >
      <h3 className="text-foreground/80 text-sm leading-snug font-medium whitespace-pre-wrap">
        {comment.comment}
      </h3>
      <div className="mt-4 flex flex-row justify-between opacity-60">
        <h4 className="text-foreground inline-block text-left text-xs font-semibold">
          {comment.author}
        </h4>
        <h4 className="text-foreground/50 inline-block text-left text-xs">
          //
        </h4>
        <h4 className="text-foreground inline-block text-right text-xs font-semibold">
          {comment.date.toLocaleDateString("en-US")}
        </h4>
      </div>
    </div>
  );

  return (
    <motion.div
      layout
      transition={{ duration: 0.8, type: "spring", bounce: 0.25 }}
      className={`relative mb-2 min-h-30 w-full transition-opacity duration-150 ${!isVisible ? "opacity-0" : "opacity-100"}`}
    >
      {/* Invisible layout driver so PeelWrapper knows its size */}
      <div className="invisible">{content}</div>
      <div className="drop-shadow-foreground/5 absolute inset-0 z-10 drop-shadow-xl/3 transition-transform duration-150 hover:-translate-y-0.5">
        <PeelWrapper
          preset="stickyNote"
          ref={peelRef}
          width="100%"
          height="100%"
          fadeThreshold={0.8}
          constraints={[]}
          drag
          options={{
            topShadowAlpha: 0.1,
            topShadowBlur: 5,
            backReflection: true,
            backReflectionAlpha: 0.05,
            backShadowAlpha: 0.03,
            bottomShadowDarkAlpha: 0.05,
            bottomShadowLightAlpha: 0.02,
          }}
        >
          <PeelTop className="h-full w-full">{content}</PeelTop>
          <PeelBack className={color.back} />
          <PeelBottom style={{ backgroundColor: "transparent" }} />
        </PeelWrapper>
      </div>
    </motion.div>
  );
}

function CommentsPane({ comments, parsedSlug, professorID }: testProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  // By initializing empty, the first render treats all comments as "new"
  const [prevCommentIds, setPrevCommentIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setPrevCommentIds(new Set(comments.map((comment) => comment.id)));
  }, [comments]);

  const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= 280) {
      setValue(event.target.value);
    }
  };

  const inputBox = (
    <div className="py-6">
      <InputGroup className="overflow-y border-foreground/10 shadow-none bg-background bottom-3 rounded-xl border focus-visible:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-foreground/10">
        <InputGroupTextarea
          className="resize-none border-none text-xs shadow-none"
          placeholder="Leave a short note about this course..."
          value={value}
          onChange={handleValueChange}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="ml-auto">
            {value.length}/280
          </InputGroupText>
          <InputGroupButton
            variant="outline"
            className="bg-secondary text-background dark:text-foreground border-secondary/50 shadow-none px-3 rounded-lg border"
            size="xs"
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
      <div className="flex h-full w-full flex-col justify-between">
        <Empty className="w-full border-0 p-4 opacity-55">
          <EmptyHeader className="gap-0.5 md:w-40">
            <EmptyMedia variant="icon" className="bg-muted/50 mb-0 size-12">
              <MessageCircleDashed className="text-muted-foreground size-6" />
            </EmptyMedia>
            <EmptyTitle className="text-muted-foreground text-base font-medium">
              No notes yet
            </EmptyTitle>
            <EmptyDescription className="text-sm">
              Looks like no notes exist for this course yet... Help other
              students by leaving your own!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
        {inputBox}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full flex-col gap-3 overflow-y-scroll mask-b-from-90% py-2">
        <div className="flex max-h-10/12 w-full flex-col gap-3 pt-2 pr-2 pb-16 pl-1 md:min-h-screen">
          <AnimatePresence mode="popLayout">
            {comments.map((eachComment: Comment, index: number) => {
              const isInitialRender = prevCommentIds.size === 0;
              const isNewComment =
                isInitialRender || !prevCommentIds.has(eachComment.id);
              // Stagger each
              const currentDelay = isInitialRender
                ? index * 500
                : isNewComment
                  ? 500
                  : 0;

              return (
                <StickyNoteComment
                  key={eachComment.id}
                  comment={eachComment}
                  index={index}
                  isNew={isNewComment}
                  delay={currentDelay}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      {inputBox}
    </div>
  );
}

export { CommentsPane };
