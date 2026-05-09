"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn, getYearPassed } from "@/lib/utils";
import { BarChartType, getMainChart } from "@/server/dashboard";
import { useEffect, useState } from "react";
import { BarChartHorizontalChartSkeleton, BarChartSkeleton } from "../skeletons";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

const chartConfig = {
  purchase: {
    label: "purchase",
    color: "var(--fg-1)",
  },
  production: {
    label: "production",
    color: "var(--fg-2)",
  },
  packinuse: {
    label: "packinuse",
    color: "var(--fg-3)",
  },
} satisfies ChartConfig;

const DashboardBarChart = () => {
  const years = getYearPassed();
  const [selectedYear, setSelectedYear] = useState<string>(years?.at(-1) ?? "2024");
  const [isLoading, setIsLoading] = useState(false);
  const [activeChart, setActiveChart] = useState("purchase");
  const [dataChart, setDataChart] = useState<BarChartType>(null);
  useEffect(() => {
    const callServer = async () => {
      try {
        setIsLoading(true);
        const result = await getMainChart(selectedYear);
        setDataChart(result);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to call server:", error);
      }
    };
    callServer();
  }, [selectedYear]);

  if (!dataChart) {
    return <BarChartSkeleton />;
  }

  return (
    <>
      <Card className="min-h-dvh pt-0 md:min-h-auto">
        <CardHeader className="flex flex-col items-center gap-2 space-y-0 border-b py-5 md:flex-row">
          <div className="grow gap-1">
            <CardTitle>{`Bar Chart - Interactive`}</CardTitle>
            <CardDescription>{`Showing Expenses, Produced & Pack In Use Chart`}</CardDescription>
          </div>
          <div className="w-full py-2 md:w-auto">
            <Combobox items={years} value={selectedYear} onInputValueChange={(e) => setSelectedYear(e)}>
              <ComboboxInput placeholder="Select a year" />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </CardHeader>
        <CardContent className="flex grow flex-col self-stretch p-2">
          <div className="flex">
            {["purchase", "production", "packinuse"].map((key) => {
              const chart = key;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t p-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-sm leading-none font-bold">
                    {chartConfig[key as keyof typeof chartConfig].label}
                  </span>
                </button>
              );
            })}
          </div>
          {/*  */}
          <div className="grow self-stretch p-2">
            {isLoading && <BarChartHorizontalChartSkeleton />}
            <ChartContainer config={chartConfig} className={cn(isLoading && "hidden", "aspect-auto h-full")}>
              <BarChart
                accessibilityLayer
                data={dataChart}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="month"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  hide
                />
                <XAxis dataKey={activeChart} type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={4}>
                  <LabelList
                    dataKey="month"
                    position="insideLeft"
                    offset={8}
                    className={cn(
                      activeChart == "purchase" && "fill-bg-1",
                      activeChart == "production" && "fill-bg-2",
                      activeChart == "packinuse" && "fill-bg-3"
                    )}
                    fontSize={12}
                  />
                  <LabelList
                    dataKey={activeChart}
                    position="insideRight"
                    offset={8}
                    className={cn(
                      activeChart == "purchase" && "fill-bg-1",
                      activeChart == "production" && "fill-bg-2",
                      activeChart == "packinuse" && "fill-bg-3"
                    )}
                    fontSize={12}
                    formatter={(value) => {
                      return `${value?.toLocaleString("id-ID")}`;
                    }}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          {/*  */}
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardBarChart;
