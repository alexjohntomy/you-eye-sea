//Cohort GPA calculation function

export const calculateGPA = (chartData: any): string => {
  let gpa = 0;
  let totalCount = 0;
  chartData.forEach((element: any) => {
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
  return (gpa / totalCount).toFixed(2);
};
