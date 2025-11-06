import { GradeDistributionChart } from '@/components/custom/grade-distribution-chart';
import prisma from '@/lib/prisma'
import { Badge } from "@/components/ui/badge"
import { CommentsPaneServer } from '@/components/custom/comments-pane-server'
import { TablePaneServer } from '@/components/custom/table-pane-server'
import { formatGradeData } from '@/app/_util/formatGradeData'

// NEED TO TURN THESE INTO FUNCTIONAL COMPONENTS LATER
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

async function getCourseDetails(slug: string) {
  const parsedSlug = slug.split("-")
  console.log(parsedSlug[0])
  console.log(parsedSlug[1])
  const course = await prisma.course.findUnique({
  where: { 
      courseName: {
          subject: parsedSlug[0],
          number: parseInt(parsedSlug[1]),
      }
    }
  });

  const name = parsedSlug[0]
  const number = parsedSlug[1]
  const title = course?.title

  return {name: name, number: number, title: title}
}

async function getCourseInstance(slug: string) {
  const parsedSlug = slug.split("-")

  const courseInstanceAggregation = await prisma.courseInstance.aggregate({
  _sum: {
    A: true,
    B: true,
    C: true,
    D: true,
    F: true,
  },
  where: { 
    courseID: parsedSlug[0],
    courseNumber: parseInt(parsedSlug[1]),
  },
  });

  return formatGradeData(courseInstanceAggregation)
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const courseDetails = await getCourseDetails(slug)
  const GradeDistributionCount = await getCourseInstance(slug)
  
  return (
    <div className="flex flex-col md:flex-row grow bg-background w-full h-full md:h-[calc(100svh-120px)]">

      {/* Stats */}
      <div className="w-full md:w-6/12 p-8 h-full">
        <div className='flex-col w-full'>
          <br></br>
          <h1 className="text-uic-red-600 font-black text-4xl">{courseDetails.name} {courseDetails.number}</h1>
          <p className="text-foreground/70 font-medium text-lg">{courseDetails.title}</p>
          <br></br>
            <div className="">
                <GradeDistributionChart chartData={GradeDistributionCount}></GradeDistributionChart>
            </div>
            <h1 className='py-2 text-xs text-center text-foreground/50'>Disclaimer: Data is sourced from official UIC grade distributions but statistics is not my strong suit so could be wrong. Use for quick reference only.</h1>
        </div>
      </div>
      
      {/* Comments */}
        <section className='w-full md:w-3/12 h-full relative border-r border-l border-foreground/10'>
              <CommentsPaneServer slug={slug}/>
        </section>

        <section className="w-full md:w-3/12 h-full">
          <TablePaneServer slug={slug}/>
        </section>
      </div>
)
}
