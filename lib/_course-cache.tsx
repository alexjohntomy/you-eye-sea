import path from "path";
const Papa = require("papaparse");
const fs = require("fs");
const filePath = "prisma/grade_distribution_data/completed/fall_2024.csv";
const fileName = path.basename(filePath).replace(/\.[^/.]+$/, "");

// Updated to remove BOM character
async function parseCSV(): Promise<any> {
  const file = fs.createReadStream(filePath);
  var csvData: any = [];
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: function (header: string) {
        let cleanHeader = header.replace(/^\uFEFF/, "");
        cleanHeader = cleanHeader.replace(/^"|"$/g, "");
        return cleanHeader.replace(/ /g, "_");
      },
      complete: (results: any) => {
        return resolve(results.data);
      },
      error: (error: any) => {
        return reject(error);
      },
    });
  });
}

interface courseObject {
  subject: string;
  number: number;
  title: string;
  professor: string;
}

let courseObjectArray: courseObject[] = [];

async function main() {
  var csvData: any = await parseCSV();
  for (const row of csvData) {
    const temporaryCourseObject: courseObject = {
      subject: row.CRS_SUBJ_CD,
      number: parseInt(row.CRS_NBR),
      title: row.CRS_TITLE,
      professor: row.Primary_Instructor,
    };
    if (
      !courseObjectArray.some(
        (course) =>
          course.subject == row.CRS_SUBJ_CD &&
          course.title == row.CRS_TITLE &&
          course.professor == row.Primary_Instructor
      )
    ) {
      courseObjectArray.push(temporaryCourseObject);
    }
  }
  console.log("Went through all rows...");
  console.log(JSON.stringify(courseObjectArray, null, 2));
}

main();

export default courseObjectArray;

//used to populate array
