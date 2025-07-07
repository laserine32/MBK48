"use client"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useMemo, useState } from "react"
import { formatCurrency } from "@/lib/utils"

const chartConfig = {
	purchase: {
		label: "purchase",
		color: "hsl(var(--chart-1))",
	},
	production: {
		label: "production",
		color: "hsl(var(--chart-2))",
	},
	packinuse: {
		label: "packinuse",
		color: "hsl(var(--chart-3))",
	},
}

const MainChart = ({ mainData }) => {
	const [activeChart, setActiveChart] = useState("purchase")
	const chartData = mainData

	const total = useMemo(
		() => ({
			purchase: chartData.reduce((acc, curr) => acc + curr.purchase, 0),
			production: chartData.reduce((acc, curr) => acc + curr.production, 0),
			packinuse: chartData.reduce((acc, curr) => acc + curr.packinuse, 0),
		}),
		[]
	)
	return (
		<>
			<Card className="w-full">
				<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
					<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
						<CardTitle>Bar Chart - Interactive</CardTitle>
						<CardDescription>Showing Expenses, Produced & Pack In Use Chart</CardDescription>
					</div>
					<div className="flex">
						{["purchase", "production", "packinuse"].map((key) => {
							const chart = key
							return (
								<button
									key={chart}
									data-active={activeChart === chart}
									className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t p-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0"
									onClick={() => setActiveChart(chart)}
								>
									<span className="text-sm font-bold leading-none">{chartConfig[chart].label}</span>
								</button>
							)
						})}
					</div>
				</CardHeader>
				<CardContent className="mt-4">
					<ChartContainer config={chartConfig} className="h-[80vh] w-full">
						<BarChart
							accessibilityLayer
							data={chartData}
							layout="vertical"
							margin={{
								left: -20,
							}}
						>
							<CartesianGrid vertical={true} />
							<XAxis type="number" dataKey={activeChart} hide />
							<YAxis
								dataKey="month"
								type="category"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										className="w-[150px]"
										nameKey="views"
										formatter={(value, name, item, index) => {
											return (
												<>
													<div
														className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
														style={{
															"--color-bg": `var(--color-${name})`,
														}}
													/>
													{chartConfig[name]?.label || name}
													<div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
														{name == "puchase" ? formatCurrency(value) : value}
													</div>
												</>
											)
										}}
									/>
								}
							/>
							<Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={5} />
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</>
	)
}

export default MainChart
