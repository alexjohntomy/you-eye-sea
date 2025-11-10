interface GradeData {
  grade: string;
  count: number;
  fill: string;
  label: string;
}

export const formatGradeData = (
  courseInstanceAggregation: any
): GradeData[] => {
  let totalCountA = courseInstanceAggregation._sum.A ?? 0;
  let totalCountB = courseInstanceAggregation._sum.B ?? 0;
  let totalCountC = courseInstanceAggregation._sum.C ?? 0;
  let totalCountD = courseInstanceAggregation._sum.D ?? 0;
  let totalCountF = courseInstanceAggregation._sum.F ?? 0;
  let totalCountW = courseInstanceAggregation._sum.W ?? 0;
  let totalCountAll =
    totalCountA + totalCountB + totalCountC + totalCountD + totalCountF;

  let A: GradeData = {
    grade: "A",
    count: totalCountA,
    fill: "var(--chart-1)",
    label: `${totalCountA} (${((totalCountA / totalCountAll) * 100).toFixed(1)}%)`,
  };
  let B: GradeData = {
    grade: "B",
    count: totalCountB,
    fill: "var(--chart-2)",
    label: `${totalCountB} (${((totalCountB / totalCountAll) * 100).toFixed(1)}%)`,
  };
  let C: GradeData = {
    grade: "C",
    count: totalCountC,
    fill: "var(--chart-3)",
    label: `${totalCountC} (${((totalCountC / totalCountAll) * 100).toFixed(1)}%)`,
  };
  let D: GradeData = {
    grade: "D",
    count: totalCountD,
    fill: "var(--chart-4)",
    label: `${totalCountD} (${((totalCountD / totalCountAll) * 100).toFixed(1)}%)`,
  };
  let F: GradeData = {
    grade: "F",
    count: totalCountF,
    fill: "var(--chart-5)",
    label: `${totalCountF} (${((totalCountF / totalCountAll) * 100).toFixed(1)}%)`,
  };
  let W: GradeData = {
    grade: "W",
    count: totalCountW,
    fill: "var(--chart-6)",
    label: `${totalCountW}`,
  };

  const gradeDataArray: GradeData[] = [A, B, C, D, F, W];

  return gradeDataArray;
};
