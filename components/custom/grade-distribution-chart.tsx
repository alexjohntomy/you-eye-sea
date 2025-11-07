"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, LabelList} from "recharts"
import { calculateGPA } from "@/app/_util/gpaCalculator" 

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart with a label"

const chartConfig = {
    count: {
        label: "Counts",
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
} satisfies ChartConfig


function GradeDistributionChart({chartData} : any) {
    console.log(chartData)
    const calculatedGPA = calculateGPA(chartData)

    const { passes, total } = chartData.reduce(
            (accumulator: any, item: any) => {
            if (["A", "B", "C", "D", "F"].includes(item.grade)) {
                accumulator.total += item.count;
                if (["A", "B", "C", "D"].includes(item.grade)) {
                    accumulator.passes += item.count;
                }
            }
            return accumulator;
            },
            { passes: 0, total: 0 }
    );

    const passRate = total === 0 ? 0 : ((passes / total)*100).toFixed(1);
    
    return (
        <Card className="flex flex-col grow justify-between h-full flex-1 min-h-60 rounded-lg shadow-[inset_0px_-6px_10px_2px_var(--secondary)]/10 border-foreground/10 gap-0">
            <div>
                <CardHeader className="flex flex-row justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold">Grade Distribution</CardTitle>
                        <CardDescription className="text-sm">(Spring '22 - '25)</CardDescription>
                    </div>
                    <Card className="px-2 py-1 md:py-2 rounded-md leading-6 md:leading-4 shadow-2xs shadow-foreground text-sm">
                        <h1><span className="font-semibold">Average GPA: </span> {calculatedGPA}</h1>
                        <h1><span className="font-semibold">Pass Rate: </span> {passRate}%</h1>
                    </Card>
                </CardHeader>
            </div>
            <CardContent className="flex">
                <div className="w-full h-full min-w-0 min-h-0 overflow-scroll">
                    <ChartContainer
                        config={chartConfig}
                        className="min-w-full max-h-full">
                        <BarChart 
                            accessibilityLayer
                            data={chartData}
                            layout="horizontal"
                            margin={{ top: 16, right: 16, bottom: 8, left: 16 }}
                        >

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
                                hide
                            />

                            <Bar
                                dataKey="count"
                                className="stroke-1 stroke-foreground/30"
                                layout="horizontal"
                                radius={3}>
                                <LabelList
                                    position="top"
                                    offset={10}
                                    className="fill-foreground"
                                    fontSize={14}
                                />
                            </Bar>
                    </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export {GradeDistributionChart}