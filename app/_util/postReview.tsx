"use server"
import prisma from '@/lib/prisma'

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

export async function postReview(userReview : Review) {
    await prisma.review.create({
        data: userReview
    })
}