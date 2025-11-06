  interface GradeData {
    grade: string;
    count: number;
    fill: string;
  }

  export const formatGradeData = (courseInstanceAggregation : any): GradeData[] => {
    let totalCountA = courseInstanceAggregation._sum.A ?? 0;
    let totalCountB = courseInstanceAggregation._sum.B ?? 0;
    let totalCountC = courseInstanceAggregation._sum.C ?? 0;
    let totalCountD = courseInstanceAggregation._sum.D ?? 0;
    let totalCountF = courseInstanceAggregation._sum.F ?? 0;

    let A: GradeData = {
        grade: "A",
        count: totalCountA,
        fill: "var(--chart-1)"
    }
    let B: GradeData = {
        grade: "B",
        count: totalCountB,
        fill: "var(--chart-2)"
    }
    let C: GradeData = {
        grade: "C",
        count: totalCountC,
        fill: "var(--chart-3)"
    }
    let D: GradeData = {
        grade: "D",
        count: totalCountD,
        fill: "var(--chart-4)"
    }
    let F: GradeData = {
        grade: "F",
        count: totalCountF,
        fill: "var(--chart-5)"
    }

    const gradeDataArray : GradeData[] = [
        A,
        B,
        C,
        D,
        F,
    ];

    return gradeDataArray
}