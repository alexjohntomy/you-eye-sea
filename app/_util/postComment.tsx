"use server";
import prisma from "@/lib/prisma";

//have not yet created this table in prisma. may just manually create in GUI

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
  await prisma.comment.create({
    data: userComment,
  });
}
