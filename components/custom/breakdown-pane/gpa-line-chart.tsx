"use client";

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";


interface GPALineChartProps {
  data: {
    semester: string;
    gpa: number;
  }[];
}

export function GPALineChart({ data }: GPALineChartProps) {
  if (!data || data.length === 0) return null;

  const minGpa = Math.min(...data.map(d => d.gpa));
  const yAxisMin = minGpa < 2 ? Math.floor(minGpa) : 2;

  const avgGpa = data.reduce((sum, item) => sum + item.gpa, 0) / data.length;
  let strokeColor = "#9ca3af";
  if (avgGpa >= 3.5) {
    strokeColor = "#22c55e"; // green-500
  } else if (avgGpa >= 3.0) {
    strokeColor = "#34d399"; // emerald-400
  } else if (avgGpa >= 2.5) {
    strokeColor = "#facc15"; // yellow-400
  } else if (avgGpa >= 2.0) {
    strokeColor = "#fb923c"; // orange-400
  } else {
    strokeColor = "#ef4444"; // red-500
  }

  const dynamicChartConfig = {
    gpa: {
      label: "GPA",
      color: strokeColor,
    },
  } satisfies ChartConfig;

  return (
    <Card className="border-uic-navy-300/40 py-2 dark:border-foreground/10 shadow-uic-navy-300 flex w-full flex-col gap-0 rounded-xl shadow-[inset_0px_-6px_10px_2px_var(--secondary)]/5 mb-4">
      <CardHeader>
        <CardTitle className="text-sm font-bold opacity-60 text-center">
          Average GPA Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={dynamicChartConfig} className="h-[90px] w-full">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="semester"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[yAxisMin, 4.0]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="gpa"
              stroke="var(--color-gpa)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-gpa)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
