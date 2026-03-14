"use client";

import { calculateGPA } from "@/app/_util/gpaCalculator";
import { useState, useEffect } from "react";
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

interface GradeData {
  grade: string;
  count: number;
  fill: string;
  label: string;
}

interface chartsProp {
  chartData: GradeData[];
  professorID: string | null;
  listOfProfessors: Professor[];
}

interface Professor {
  id: string;
  name: string;
}

function getProfessorNameFromID(
  professorID: string | null,
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

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { passes, total, drops, totalWithDrops } = chartData.reduce(
    (
      accumulator: {
        passes: number;
        total: number;
        drops: number;
        totalWithDrops: number;
      },
      item: GradeData
    ) => {
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
    <Card className="border-uic-navy-300/40 dark:border-foreground/10 shadow-uic-navy-300 flex h-full min-h-60 flex-1 grow flex-col justify-between gap-0 rounded-lg shadow-[inset_0px_-6px_10px_2px_var(--secondary)]/5">
      <div>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Grade Distribution
            </CardTitle>
            <CardDescription className="text-sm">
              {selectedProfessor} (Spring &apos;22 - &apos;25)
            </CardDescription>
          </div>
          <Card className="shadow-foreground flex flex-col gap-1 rounded-md px-2 py-1 text-sm shadow-xs md:py-2">
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
        <div className="h-full w-full overflow-scroll">
          <ChartContainer
            config={chartConfig}
            className="h-full max-h-full min-w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="horizontal"
              margin={{ top: 40, right: 0, bottom: 0, left: 0 }}
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
                tickLine={{ stroke: "#40000000" }}
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
                className="stroke-foreground/10 stroke-1"
                isAnimationActive={isMounted}
                animationDuration={500}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="label"
                  position="top"
                  className="animate-in fade-in fill-mode-both duration-750"
                  content={(props: any) => {
                    const { x, y, width, value } = props;
                    const valueStr = String(value);
                    const hasPercent = valueStr.includes(" (");
                    const [countText, percentText] = hasPercent
                      ? valueStr.split(" (")
                      : [valueStr, null];

                    return (
                      <text
                        x={x + width / 2}
                        y={y - 18}
                        fill="currentColor"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-foreground animate-in fade-in fill-mode-both duration-750"
                      >
                        <tspan
                          x={x + width / 2}
                          dy={hasPercent ? "-0.5em" : "0"}
                          className="font-condensed font-medi"
                          style={{
                            fontFamily: "var(--font-condensed)",
                            fontSize: "14px",
                          }}
                        >
                          {countText}
                        </tspan>
                        {hasPercent && (
                          <tspan
                            x={x + width / 2}
                            dy="1.2em"
                            className="font-condensed font-normal opacity-75"
                            style={{
                              fontFamily: "var(--font-condensed)",
                              fontSize: "12px",
                            }}
                          >
                            ({percentText}
                          </tspan>
                        )}
                      </text>
                    );
                  }}
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
