"use client";
import { Card, CardContent } from "@/components/ui/card";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { CheckCircleIcon, SealCheckIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { DashboardScoreType } from "@/server/dashboard";

const dataScoreInfoTheme = {
  excellent: {
    ScIcon: SealCheckIcon,
    color: `text-fg-1`,
    fill: "var(--fg-1)",
  },
  good: {
    ScIcon: CheckCircleIcon,
    color: `text-fg-2`,
    fill: "var(--fg-2)",
  },
  warning: {
    ScIcon: WarningIcon,
    color: `text-fg-3`,
    fill: "var(--fg-3)",
  },
  danger: {
    ScIcon: XCircleIcon,
    color: `text-fg-5`,
    fill: "var(--fg-5)",
  },
};

const chartConfig = {
  score: {
    label: "score",
  },
} satisfies ChartConfig;

const DashboardScoreChart = ({ data }: { data: DashboardScoreType }) => {
  const { summary, messages } = data;
  const mainTheme = dataScoreInfoTheme[summary.description.rank as keyof typeof dataScoreInfoTheme];
  const chartData = [{ name: "score", score: data.summary.score, fill: mainTheme.fill }];

  const scoreInfo: Array<ScoreInfoType> = messages.map(
    (e) =>
      ({
        title: e.title,
        score: e.message,
        theme: e.rank,
      }) as ScoreInfoType
  );

  return (
    <>
      <Card className="pt-0">
        <CardContent className="grid grid-cols-1 gap-2 px-2 pt-4 sm:px-6 sm:pt-6 lg:grid-cols-2 lg:gap-4">
          <div className="w-full">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-62.5 w-full">
              <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={(chartData[0].score / 100) * 360}
                outerRadius={90}
                innerRadius={80}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[90, 80]}
                />
                <RadialBar dataKey="score" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                              {chartData[0].score.toLocaleString()}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                              {`/100`}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className={cn("text-sm font-semibold md:py-2 md:text-2xl", "text-fg-1")}>
              {capitalizeFirstLetter(summary.description.rank)}
            </h3>
            <p className="md:text-md mb-4 text-xs">{summary.description.message}</p>
            {scoreInfo.map((e, i) => (
              <ScoreInfo key={i} title={e.title} score={e.score} theme={e.theme} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

type ScoreInfoType = {
  title: string;
  score: string;
  theme: keyof typeof dataScoreInfoTheme;
};

const ScoreInfo = ({ title, score, theme }: ScoreInfoType) => {
  const scit = dataScoreInfoTheme[theme];
  return (
    <>
      <div className="flex items-center gap-2">
        <scit.ScIcon className={cn(scit.color)} size={16} weight="fill" />
        <p className="grow">{title}</p>
        <p className={cn("text-right", scit.color)}>{score}</p>
      </div>
    </>
  );
};

export default DashboardScoreChart;
