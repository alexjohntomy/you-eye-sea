"use server";
import prisma from "@/lib/prisma";
import { Filter } from "bad-words";

const filter = new Filter();

interface Comment {
  id?: number;
  comment: string;
  date?: string;
  author?: string;
  courseInstanceID?: number;
  courseID: string;
  courseNumber: number;
}

export async function postComment(userComment: Comment) {
  if (!userComment.comment || userComment.comment.trim().length < 1 || userComment.comment.length > 1500) return;
  if (filter.isProfane(userComment.comment)) return;
  await prisma.comment.create({
    data: userComment,
  });
}
