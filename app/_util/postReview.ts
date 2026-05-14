"use server";
import prisma from "@/lib/prisma";
import { Filter } from "bad-words";

const filter = new Filter();

interface Review {
  id?: number;
  review: string;
  courseID: string | null;
  courseNumber: number | null;
  professorID?: number | null;
  date?: string;
  author?: string | null;
  stars?: number | null;
}

export async function postReview(userReview: Review) {
  if (!userReview.review || userReview.review.trim().length < 1 || userReview.review.length > 1500) return;
  if (filter.isProfane(userReview.review)) return;
  await prisma.review.create({
    data: userReview,
  });
}
