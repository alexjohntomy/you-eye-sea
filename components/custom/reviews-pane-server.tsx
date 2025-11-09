import { ReviewsPane } from '@/components/custom/reviews-pane'
import prisma from '@/lib/prisma'


async function getReviewsFromDB(courseName : any) {
    const reviewsFromDB = await prisma.review.findMany({
        where: {
            courseID: courseName[0],
            courseNumber: parseInt(courseName[1])
        }
    })
    return reviewsFromDB
}

interface ReviewsPaneServerProps {
  slug: string
  professorID: any
}

async function ReviewsPaneServer({slug, professorID} : ReviewsPaneServerProps) { 
    const parsedCourseName = slug.split("-") ?? ["test", "test"]
    const reviewsFromDB = await getReviewsFromDB(parsedCourseName)
    return (
        <ReviewsPane reviews={reviewsFromDB} parsedSlug={parsedCourseName} professorID={professorID}/>
    )
}

export { ReviewsPaneServer }