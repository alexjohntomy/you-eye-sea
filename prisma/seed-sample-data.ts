import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
    }),
});
const Papa = require("papaparse");
const fs = require('fs')
async function parseCSV(filePath: string): Promise<unknown[]> {
    const file = fs.createReadStream(filePath);
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: function(header: string) {
                let cleanHeader = header.replace(/^\uFEFF/, '');
                cleanHeader = cleanHeader.replace(/^"|"$/g, '');
                return cleanHeader.replace(/ /g, "_");
            },
            complete: (results: { data: unknown[] }) => {
                return resolve(results.data);
            },
            error: (error: Error) => {
                return reject(error);
            },
        });
    });
}

async function seedFile(filePath: string, fileName: string) {
    var csvData = await parseCSV(filePath) as Record<string, string>[];

    await prisma.courseInstance.deleteMany({
        where: { semester: fileName }
    });

    let count = 0;

    for (const row of csvData) {
        const deptCode = parseInt(row.DEPT_CD);
        const courseNum = parseInt(row.CRS_NBR);

        if (!row.Primary_Instructor || !row.DEPT_CD || !row.CRS_SUBJ_CD || !row.CRS_NBR || isNaN(deptCode) || isNaN(courseNum)) {
            console.warn("Skipping row with missing data:", row);
            continue;
        }

        const professor = await prisma.professor.upsert({
            where: { name: row.Primary_Instructor },
            update: {},
            create: { name: row.Primary_Instructor }
        })

        await prisma.department.upsert({
            where: { code: deptCode },
            update: {},
            create: {
                name: row.DEPT_NAME,
                code: deptCode
            }
        })

        await prisma.course.upsert({
            where: {
                courseName: {
                    subject: row.CRS_SUBJ_CD,
                    number: courseNum
                }
            },
            update: {},
            create: {
                subject: row.CRS_SUBJ_CD,
                number: courseNum,
                title: row.CRS_TITLE,
                departmentID: deptCode
            }
        })

        await prisma.courseInstance.create({
            data: {
                courseID: row.CRS_SUBJ_CD,
                courseNumber: courseNum,
                professorID: professor.id,
                A: parseInt(row.A) || 0,
                B: parseInt(row.B) || 0,
                C: parseInt(row.C) || 0,
                D: parseInt(row.D) || 0,
                F: parseInt(row.F) || 0,
                ADV: parseInt(row.ADV) || 0,
                CR: parseInt(row.CR) || 0,
                DFR: parseInt(row.DFR) || 0,
                I: parseInt(row.I) || 0,
                NG: parseInt(row.NG) || 0,
                NR: parseInt(row.NR) || 0,
                O: parseInt(row.O) || 0,
                PR: parseInt(row.PR) || 0,
                S: parseInt(row.S) || 0,
                U: parseInt(row.U) || 0,
                W: parseInt(row.W) || 0,
                total_students: parseInt(row.Grade_Regs) || 0,
                semester: fileName
            }
        })

        count++;
        if (count % 100 === 0) {
            console.log(`Processed ${count} rows...`)
        }
    }

    console.log(`Done! Inserted ${count} course instances for semester: ${fileName}`)
}

async function main() {
    const dir = 'prisma/sample_grade_distribution_data';
    await seedFile(`${dir}/sample-fall-2025.csv`, 'sample-fall-2025');
    await seedFile(`${dir}/sample-spring-2025.csv`, 'sample-spring-2025');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
