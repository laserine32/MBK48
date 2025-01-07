"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useMemo, useState } from "react"
import { formatCurrency } from "@/lib/utils"

// const chartData = [
// 	{ month: "January", desktop: 222, mobile: 150 },
// 	{ month: "February", desktop: 522, mobile: 950 },
// 	{ month: "March", desktop: 722, mobile: 250 },
// 	{ month: "April", desktop: 122, mobile: 850 },
// 	{ month: "May", desktop: 22, mobile: 150 },
// ]

const chartConfig = {
	views: {
		label: "Total",
	},
	purchase: {
		label: "Purchase",
		color: "hsl(var(--chart-1))",
	},
	production: {
		label: "Production",
		color: "hsl(var(--chart-2))",
	},
	packinuse: {
		label: "Pack In Use",
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
			<Card className="w-full md:col-span-8">
				<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
					<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
						<CardTitle>Bar Chart - Interactive</CardTitle>
						<CardDescription>Showing Expenses, Produced & Pack In Use Chart for the last 3 months</CardDescription>
					</div>
					<div className="flex">
						{["purchase", "production", "packinuse"].map((key) => {
							const chart = key
							return (
								<button
									key={chart}
									data-active={activeChart === chart}
									className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
									onClick={() => setActiveChart(chart)}
								>
									<span className="text-sm font-bold leading-none">{chartConfig[chart].label}</span>
								</button>
							)
						})}
					</div>
				</CardHeader>
				<CardContent className="px-2 sm:p-6">
					<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
						<BarChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
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
							<Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</>
	)
}

export default MainChart
