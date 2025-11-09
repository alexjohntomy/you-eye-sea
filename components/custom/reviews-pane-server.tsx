import { ReviewsPane } from '@/components/custom/reviews-pane'
import prisma from '@/lib/prisma'


async function getReviewsFromDB(courseName : any, professorID: any) {
    if (!professorID || null || "" || "all-professors") {
        const reviewsFromDB = await prisma.review.findMany({
            where: {
                courseID: courseName[0],
                courseNumber: parseInt(courseName[1])
            }
        })
        return reviewsFromDB
    }
    else {
        const reviewsFromDB = await prisma.review.findMany({
            where: {
                courseID: courseName[0],
                courseNumber: parseInt(courseName[1]),
                professorID: parseInt(professorID)
            }
        })
        return reviewsFromDB
    }
}

interface ReviewsPaneServerProps {
  slug: string
  professorID: any
  listOfProfessors: any
}

async function ReviewsPaneServer({slug, professorID, listOfProfessors} : ReviewsPaneServerProps) { 
    const parsedCourseName = slug.split("-") ?? ["test", "test"]
    const reviewsFromDB = await getReviewsFromDB(parsedCourseName, professorID)
    return (
        <ReviewsPane reviews={reviewsFromDB} parsedSlug={parsedCourseName} professorID={professorID} listOfProfessors={listOfProfessors}/>
    )
}

export { ReviewsPaneServer }