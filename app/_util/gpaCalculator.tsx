//Cohort GPA calculation function

import type { GradeData } from "@/app/_util/formatGradeData";

export const calculateGPA = (chartData: GradeData[]): string => {
  let gpa = 0;
  let totalCount = 0;
  chartData.forEach((element: GradeData) => {
    if (element.count > 0) {
      switch (element.grade) {
        case "A":
          gpa += 4 * element.count;
          totalCount += element.count;
          break;
        case "B":
          gpa += 3 * element.count;
          totalCount += element.count;
          break;
        case "C":
          gpa += 2 * element.count;
          totalCount += element.count;
          break;
        case "D":
          gpa += 1 * element.count;
          totalCount += element.count;
          break;
        case "F":
          gpa += 0;
          totalCount += element.count;
          break;
        default:
          break;
      }
    }
  });
  if (totalCount === 0) return "N/A";
  return (gpa / totalCount).toFixed(2);
};
