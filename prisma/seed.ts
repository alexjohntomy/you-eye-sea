// import { PrismaClient } from "../src/generated/prisma/client"
// import path from 'path'
// const prisma = new PrismaClient()
// const Papa = require("papaparse");
// const fs = require('fs')
// const filePath = "prisma/grade_distribution_data/spring_2022.csv"
// const fileName = (path.basename(filePath)).replace(/\.[^/.]+$/, "")

// async function parseCSV(): Promise<unknown[]> {
//     const file = fs.createReadStream(filePath);
//     var csvData: unknown[] = [];
//     return new Promise((resolve, reject) => {
//         Papa.parse(file, {
//             header: true,
//             skipEmptyLines: true,
//             transformHeader: function(header: string) {
//                 let cleanHeader = header.replace(/^\uFEFF/, '');
//                 cleanHeader = cleanHeader.replace(/^"|"$/g, '');
//                 return cleanHeader.replace(/ /g,"_");
//             },
//             complete: (results: { data: unknown[] }) => {
//                 return resolve(results.data);
//             },
//             error: (error: Error) => {
//                 return reject(error);
//             },
//         });
//     });
// }

// //Key: Professor Name, value: ID (from DB)
// let seenProfessors = new Map<string, number>()

// //Set: Department Number
// let seenDepartments = new Set<number>()

// //Set: Appended String (CS-101)
// let seenCourses = new Set<string>()

// interface CourseInstance {
//     courseID: string;
//     courseNumber: number;
//     professorID: number | undefined;
//     A: number;
//     B: number;
//     C: number;
//     D: number;
//     F: number;
//     ADV: number;
//     CR: number;
//     DFR: number;
//     I: number;
//     NG: number;
//     NR: number;
//     O: number;
//     PR: number;
//     S: number;
//     U: number;
//     W: number;
//     total_students: number;
//     semester: string;
// }

// let courseInstanceList : CourseInstance[] = [];

// async function main() {
//     var csvData = await parseCSV() as Record<string, string>[]; 

//     await prisma.courseInstance.deleteMany({
//         where: {
//             semester: fileName
//         }
//     });

//     let currentIndex = 1

//     for (const row of csvData) {
//         const deptCode = parseInt(row.DEPT_CD);
//         const courseNum = parseInt(row.CRS_NBR);

//         if (!row.Primary_Instructor || !row.DEPT_CD || !row.CRS_SUBJ_CD || !row.CRS_NBR || isNaN(deptCode) || isNaN(courseNum)) {
//             console.warn("Skipping row with missing data");
//             continue; 
//         }

//         //If the professor has not yet been seen, then add it to DB, and then add it to seen
//         if (!seenProfessors.has(row.Primary_Instructor)) {
//             let professor = await prisma.professor.upsert({
//                 where: {name: row.Primary_Instructor},
//                 update: {},
//                 create: {
//                     name: row.Primary_Instructor
//                 }
//             })
//             seenProfessors.set(row.Primary_Instructor, professor.id)
//         }

//         //If the department has not yet been seen, then add it to DB, and then add it to seen
//         if (!seenDepartments.has(deptCode)) {
//             let department = await prisma.department.upsert({
//                 where: { code: deptCode},
//                 update: {},
//                 create: {
//                     name: row.DEPT_NAME,
//                     code: deptCode
//                 }
//             })
//             seenDepartments.add(deptCode)
//         }

//         //If the course has not yet been seen, then add it to DB, and then add it to seen
//         if (!seenCourses.has(row.CRS_SUBJ_CD + " " + courseNum)) {
//             let course = await prisma.course.upsert({
//                 where: { 
//                     courseName: {
//                         subject: row.CRS_SUBJ_CD,
//                         number: courseNum
//                     }
//                 },
//                 update: {},
//                 create: {
//                     subject: row.CRS_SUBJ_CD,
//                     number: courseNum,
//                     title: row.CRS_TITLE,
//                     departmentID: deptCode
//                 }
//             })
//             seenCourses.add(row.CRS_SUBJ_CD + " " + courseNum)
//         }

//         const temporaryCourseInstance: CourseInstance = {
//             courseID: row.CRS_SUBJ_CD,
//             courseNumber: courseNum,
//             professorID: seenProfessors.get(row.Primary_Instructor),
//             A: parseInt(row.A) || 0,
//             B: parseInt(row.B) || 0,
//             C: parseInt(row.C) || 0,
//             D: parseInt(row.D) || 0,
//             F: parseInt(row.F) || 0,
//             ADV: parseInt(row.ADV) || 0,
//             CR: parseInt(row.CR) || 0,
//             DFR: parseInt(row.DFR) || 0,
//             I: parseInt(row.I) || 0,
//             NG: parseInt(row.NG) || 0,
//             NR: parseInt(row.NR) || 0,
//             O: parseInt(row.O) || 0,
//             PR: parseInt(row.PR) || 0,
//             S: parseInt(row.S) || 0,
//             U: parseInt(row.U) || 0,
//             W: parseInt(row.W) || 0,
//             total_students: parseInt(row.Grade_Regs) || 0,
//             semester: fileName
//         }
//         currentIndex++
//         console.log(temporaryCourseInstance)
//         console.log("Completed row " + currentIndex)
//         courseInstanceList.push(temporaryCourseInstance)
//         }

//     // Create All Course Instances
//     let courseInstance = await prisma.courseInstance.createMany({
//         data: courseInstanceList
//     })

//     console.log("Went through all rows...")
//     console.log(courseInstanceList.length)
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })