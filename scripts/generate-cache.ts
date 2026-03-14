import 'dotenv/config';
import { PrismaClient } from "../src/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import fs from 'fs';
import path from 'path';

export const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!
}).$extends(withAccelerate());

async function main() {
  console.log("Generating courseList.tsx...");
  
  const courseInstances = await prisma.courseInstance.findMany({
    select: {
      courseID: true,
      courseNumber: true,
      professor: {
        select: {
          name: true
        }
      },
      course: {
        select: {
          title: true
        }
      }
    },
    distinct: ['courseID', 'courseNumber', 'professorID']
  }) as any;

  const courseObjects = courseInstances.map((ci: any) => ({
    subject: ci.courseID,
    number: ci.courseNumber,
    title: ci.course?.title || "",
    professor: ci.professor?.name || ""
  }));

  const courseListContent = `//This file serves to create a cache array of course objects for quick search,\n//to reduce calls to the Prisma DB.\n\ninterface courseObject {\n  subject: string;\n  number: number;\n  title: string;\n  professor: string;\n}\n\nconst courseList: courseObject[] = ${JSON.stringify(courseObjects, null, 2)};\n\nexport default courseList;\n`;
  fs.writeFileSync(path.join(process.cwd(), 'courseList.tsx'), courseListContent);

  console.log("Generating professorList.tsx...");
  const professors = await prisma.professor.findMany();
  let profMapStr = `//This file serves to create a cache map of professor:id pairs for quick search,\n//to reduce calls to the Prisma DB.\n\nconst professorsList = new Map([\n`;
  const profEntries = professors.map(p => `  [\n    ${p.id},\n    ${JSON.stringify(p.name)}\n  ]`).join(',\n');
  profMapStr += profEntries + `\n]);\n\nexport default professorsList;\n`;
  fs.writeFileSync(path.join(process.cwd(), 'professorList.tsx'), profMapStr);

  console.log("Generating subjectList.tsx...");
  const distinctCourses = await prisma.course.findMany({
    select: { subject: true },
    distinct: ['subject']
  });
  const subjectList = distinctCourses.map(c => c.subject);
  const subjectListContent = `//This file serves to create a cache array of subjects for quick search,\n//to reduce calls to the Prisma DB.\n\nconst subjectList: string[] = ${JSON.stringify(subjectList, null, 2)};\n\nexport default subjectList;\n`;
  fs.writeFileSync(path.join(process.cwd(), 'subjectList.tsx'), subjectListContent);

  console.log("Done generating all cache files.");
}

main().catch(console.error);
