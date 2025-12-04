"use client";

import { calculateGPA } from "@/app/_util/gpaCalculator";
import { useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart with a label";

let animationNeeded = true;

const chartConfig = {
  count: {
    label: "Count",
  },
  A: {
    label: "A",
    color: "var(--chart-1)",
  },
  B: {
    label: "B",
    color: "var(--chart-2)",
  },
  C: {
    label: "C",
    color: "var(--chart-3)",
  },
  D: {
    label: "D",
    color: "var(--chart-4)",
  },
  F: {
    label: "F",
    color: "var(--chart-5)",
  },
  W: {
    label: "W",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig;

interface chartsProp {
  chartData: any;
  professorID: any;
  listOfProfessors: Professor[];
}

interface Professor {
  id: string;
  name: string;
}

function getProfessorNameFromID(
  professorID: string,
  listOfProfessors: Professor[]
) {
  let professorNameFromID: Professor = {
    name: "All Professors",
    id: "all-professors",
  };

  if (professorID == "all-professors" || !professorID) {
    professorNameFromID = { name: "All Professors", id: "all-professors" };
  } else {
    professorNameFromID = listOfProfessors.find(
      (professor: Professor) => professor.id === professorID
    ) ?? { name: "All Professors", id: "all-professors" };
  }
  return professorNameFromID.name;
}

function GradeDistributionChart({
  chartData,
  professorID,
  listOfProfessors,
}: chartsProp) {
  console.log(chartData);
  const calculatedGPA = calculateGPA(chartData);
  console.log(professorID);
  const selectedProfessor = getProfessorNameFromID(
    professorID,
    listOfProfessors
  );
  useEffect(() => {
    console.log("Page loaded...");
    animationNeeded = false;
  }, []);

  const { passes, total, drops, totalWithDrops } = chartData.reduce(
    (accumulator: any, item: any) => {
      if (["A", "B", "C", "D", "F"].includes(item.grade)) {
        accumulator.total += item.count;
        accumulator.totalWithDrops += item.count;
        if (["A", "B", "C", "D"].includes(item.grade)) {
          accumulator.passes += item.count;
        }
      }
      if (["W"].includes(item.grade)) {
        accumulator.drops += item.count;
        accumulator.totalWithDrops += item.count;
      }
      return accumulator;
    },
    { passes: 0, total: 0, drops: 0, totalWithDrops: 0 }
  );

  const passRate = total === 0 ? 0 : ((passes / total) * 100).toFixed(1);
  const dropRate =
    totalWithDrops === 0 ? 0 : ((drops / totalWithDrops) * 100).toFixed(1);

  return (
    <Card className="flex flex-col grow justify-between h-full flex-1 min-h-60 rounded-lg shadow-[inset_0px_-6px_10px_2px_var(--secondary)]/5 border-foreground/10 gap-0">
      <div>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Grade Distribution
            </CardTitle>
            <CardDescription className="text-sm">
              {selectedProfessor} (Spring '22 - '25)
            </CardDescription>
          </div>
          <Card className="flex flex-col px-2 py-1 md:py-2 rounded-md gap-1 shadow-2xs shadow-foreground text-sm">
            <h1>
              <span className="font-semibold">Average GPA: </span>{" "}
              {calculatedGPA}
            </h1>
            <h1>
              <span className="font-semibold">Pass Rate: </span> {passRate}%
            </h1>
            <h1>
              <span className="font-semibold">Drop Rate: </span> {dropRate}%
            </h1>
          </Card>
        </CardHeader>
      </div>
      <CardContent className="flex">
        <div className="w-full h-full min-w-0 min-h-0 overflow-scroll">
          <ChartContainer
            config={chartConfig}
            className="min-w-full max-h-full h-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="horizontal"
              margin={{ top: 28, right: 0, bottom: 0, left: 0 }}
            >
              {/* This includes the labels "A-F" */}
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="grade"
                className="text-xl font-black"
                type="category"
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />

              <YAxis
                dataKey="count"
                type="number"
                tickLine = {{stroke: '#40000000'}}
                domain={[0, "dataMax"]}
                hide
              />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: "transparent", opacity: 0.75 }}
                isAnimationActive={false}
              />
              <Bar
                dataKey="count"
                className="stroke-1 stroke-foreground/10"
                isAnimationActive={animationNeeded}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="label"
                  position="top"
                  offset={5}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export { GradeDistributionChart };
