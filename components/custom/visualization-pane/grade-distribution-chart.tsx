"use client";

import { calculateGPA } from "@/app/_util/gpaCalculator";
import { useState, useEffect, useRef } from "react";
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
  averageCourseSize: number | null;
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
  averageCourseSize,
}: chartsProp) {
  console.log(chartData);
  const calculatedGPA = calculateGPA(chartData);
  console.log(professorID);
  const selectedProfessor = getProfessorNameFromID(
    professorID,
    listOfProfessors
  );

  const [shouldAnimate, setShouldAnimate] = useState(true);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the first run (initial mount already has shouldAnimate = true)
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // chartData changed (professor switch) — re-enable animation
      setShouldAnimate(true);
    }

    // Turn off animation after it completes so resizes don't re-trigger it
    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 450); // slightly longer than the 400ms animationDuration

    return () => clearTimeout(timer);
  }, [chartData]);

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

  const gpaValue = parseFloat(calculatedGPA);
  let gpaColorClass = "bg-gray-400";
  if (!isNaN(gpaValue)) {
    if (gpaValue >= 3.5) {
      gpaColorClass = "bg-green-500";
    } else if (gpaValue >= 3.0) {
      gpaColorClass = "bg-emerald-400";
    } else if (gpaValue >= 2.5) {
      gpaColorClass = "bg-yellow-400";
    } else if (gpaValue >= 2.0) {
      gpaColorClass = "bg-orange-400";
    } else {
      gpaColorClass = "bg-red-500";
    }
  }

  return (
    <Card className="border-uic-navy-300/40 dark:border-foreground/10 shadow-uic-navy-300 flex h-full min-h-60 flex-1 grow flex-col justify-between gap-0 rounded-xl shadow-[inset_0px_-6px_10px_2px_var(--secondary)]/5">
      <div>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle className="text:lg font-black xl:text-xl ">
              Grade Distribution
            </CardTitle>
            <CardDescription className="flex flex-col gap-0 pt-1 text-xs opacity-60 xl:flex-row md:gap-1 lg:text-sm">
              <span className="text-foreground/80 font-bold tracking-wide">
                {selectedProfessor}
              </span>{" "}
              <span className="font-medium tracking-wide text-nowrap">
                (Spring &apos;22 - Fall &apos;25)
              </span>
            </CardDescription>
          </div>
          <Card className="border-foreground/10 flex flex-col items-end gap-1 rounded-xl px-2.5 py-2.5 text-sm shadow-none md:px-3 md:py-3">
            <h1 className="-mt-1 -mb-1 flex items-center gap-2">
              <div
                className={`border-foreground/20 aspect-square size-2 rounded-full border opacity-80 md:size-2.25 ${gpaColorClass}`}
              ></div>
              <span className="text-base font-bold text-nowrap md:text-xl">
                GPA: <span className="font-bold">{calculatedGPA}</span>
              </span>
            </h1>
            <h1 className="text-xs text-nowrap md:text-sm">
              <span className="font-semibold">Pass Rate: </span> {passRate}%
            </h1>
            <h1 className="text-xs text-nowrap md:text-sm">
              <span className="font-semibold">Drop Rate: </span> {dropRate}%
            </h1>
            {averageCourseSize !== null && (
              <h1 className="text-xs text-nowrap md:text-sm">
                <span className="font-semibold">Avg Class Size: </span> {Math.round(averageCourseSize)}
              </h1>
            )}
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
                tick={{ fontSize: 14, fontWeight: 500 }}
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
                isAnimationActive={shouldAnimate}
                animationEasing="ease-out"
                animationDuration={400}
                radius={[5, 5, 0, 0]}
              >
                <LabelList
                  dataKey="label"
                  position="top"
                  // className="animate-in"
                  content={(props) => {
                    const x = Number(props.x ?? 0);
                    const y = Number(props.y ?? 0);
                    const width = Number(props.width ?? 0);
                    const { value } = props;
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
                        className="text-foreground animate-in fade-in slide-in-from-bottom-1 zoom-in-95 fill-mode-both delay-75 duration-350 ease-out"
                        style={{
                          transformOrigin: `${x + width / 2}px ${y - 18}px`,
                        }}
                      >
                        <tspan
                          x={x + width / 2}
                          dy={hasPercent ? "-0.5em" : "0"}
                          className="font-condensed font-semibold"
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
