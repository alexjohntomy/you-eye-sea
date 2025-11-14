import { FilteredDataTable } from "@/components/custom/filtered-data-table";
import { columns, Payment } from "@/app/explore/columns"
import prisma from "@/lib/prisma";

interface TablePaneServerProps {
  slug: string;
}

import {
  ColumnDef,
} from "@tanstack/react-table"

interface courseSumsType {
    courseID: string;
    courseNumber: number
    professorID: number
    _sum: {
        A: number | null;
        B: number | null;
        C: number | null;
        D: number | null;
        F: number | null;
        W: number | null;
    };
}

interface courseNameType {
  [index: number]: string;
}

interface rowDetails {
  course : string;
  professor : string;
  gpa : number;
  passRate : number;
  dropRate : number;
}

async function getCourseSums(courseName: courseNameType) : Promise<courseSumsType[]> {
  const courseInstanceAggregation = await prisma.courseInstance.groupBy({
    by: ["courseID", "courseNumber", "professorID"],
    _sum: {
      A: true,
      B: true,
      C: true,
      D: true,
      F: true,
      W: true,
    },
    // maybe dont need a where thing here actually. will remove it soon just have it for testing rn
    where: {
      courseID: courseName[0],
      courseNumber: parseInt(courseName[1]),
    },
  });
  return courseInstanceAggregation;
}

async function getData() {
  //soon this will not actually be a parameter like this slug here cuz the filter options are really more like subject
  //or level
  const courseSums : courseSumsType[] = await getCourseSums("CS-211".split("-"))
  const allRows = courseSums.map(item => 
  {
    let totalGradeCount = (item._sum.A! + item._sum.B! + item._sum.C! + item._sum.D! + item._sum.F!)
    let totalGradeCountIncludingDrops = ((item._sum.A! + item._sum.B! + item._sum.C! + item._sum.D! + item._sum.F! + item._sum.W!))
    let numbers = ((item._sum.A ?? 0) * 4) + ((item._sum.B ?? 0) * 3) + ((item._sum.C ?? 0) * 2) + ((item._sum.D ?? 0) * 1)
    let gpa = (numbers/(item._sum.A! + item._sum.B! + item._sum.C! + item._sum.D! + item._sum.F!))
    let name = `${item.courseID} ${item.courseNumber}`
    
    let professor = item.professorID
    let passRate = (item._sum.A! + item._sum.B! + item._sum.C! + item._sum.D!)/totalGradeCount
    let dropRate = item._sum.W!/totalGradeCountIncludingDrops

    const rowDetailsObject = {
      course: name,
      professor: professor,
      gpa: gpa,
      passRate: passRate,
      dropRate: dropRate
    }

    return rowDetailsObject
  })

  return allRows
}

//pls ignore this function havent really done anything
async function FilteredDataTableServer(){
  const data = await getData()
  return (
    <FilteredDataTable columns={columns} data={data}/>
  );
}

export { FilteredDataTableServer };
