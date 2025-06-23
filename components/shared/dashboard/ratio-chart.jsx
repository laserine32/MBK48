"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Label, LabelList, Pie, PieChart } from "recharts"

const chartConfig = {
	value: {
		label: "Percent",
	},
	produced: {
		label: "Production",
		color: "hsl(var(--chart-1))",
	},
	inuse: {
		label: "In Use",
		color: "hsl(var(--chart-2))",
	},
}

const RatioChart = ({ mainData }) => {
	const chartData = mainData.chartData
	return (
		<>
			<Card className="flex flex-col">
				<CardHeader className="pb-0">
					<CardTitle>Pie Chart - Ratio Pack</CardTitle>
					<CardDescription>Ratio between Produced and In Use</CardDescription>
				</CardHeader>
				<CardContent className="flex-1 pb-0">
					<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
						<PieChart>
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<Pie data={chartData} dataKey="value" nameKey={"item"} innerRadius={60} strokeWidth={5}>
								<Label
									content={({ viewBox }) => {
										if (viewBox && "cx" in viewBox && "cy" in viewBox) {
											return (
												<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
													<tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
														{mainData.gap.toLocaleString("id-ID")}
													</tspan>
													<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
														Gap
													</tspan>
												</text>
											)
										}
									}}
								/>
							</Pie>
						</PieChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</>
	)
}

export default RatioChart
