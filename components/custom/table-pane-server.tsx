import { TablePane } from '@/components/custom/table-pane'
import prisma from '@/lib/prisma'

async function getCourseInstanceSums(courseName : any) {
  const courseInstanceAggregation = await prisma.courseInstance.groupBy({
  by: ['courseInstanceID'],
  _sum: {
    A: true,
    B: true,
    C: true,
    D: true,
    F: true,
  },
  where: { 
    courseID: courseName[0],
    courseNumber: parseInt(courseName[1]),
  },
  });

  return courseInstanceAggregation
}

async function getStatsFromDB(courseName : any) {
    const statsFromDB = await prisma.courseInstance.findMany({
        orderBy: {
            semester: 'asc'
        },
        where: {
            courseID: courseName[0],
            courseNumber: parseInt(courseName[1])
        },
        select : {
            A: true,
            total_students: true,
            professor: {
                select: {
                    name: true,
                    id: true,
                },
            },
            courseInstanceID: true,
            semester: true
        }
    })
    return statsFromDB
}

interface TablePaneServerProps {
  slug: string
}

async function TablePaneServer({slug} : TablePaneServerProps) { 
    const parsedCourseName = slug.split("-") ?? ["test", "test"]
    const statsFromDB = await getStatsFromDB(parsedCourseName)
    const courseInstanceAggregation = await getCourseInstanceSums(parsedCourseName)
    return (
        <TablePane statsFromDB={statsFromDB} courseInstanceAggregation={courseInstanceAggregation}/>
    )
}

export { TablePaneServer }