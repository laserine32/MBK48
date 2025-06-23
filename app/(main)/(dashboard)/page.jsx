import MainChartWrapper from "@/components/shared/dashboard/main-chart-wrapper"
import QuickLink from "@/components/shared/dashboard/quick-link"
import RatioCardWrapper from "@/components/shared/dashboard/ratio-card-wrapper"
import StatCardsWrapper from "@/components/shared/dashboard/stat-cards-wrapper"
import PageTitle from "@/components/shared/page/page-title"
import { CardsSkeleton } from "@/components/shared/skeletons"
import { Suspense } from "react"

const DashboardPage = async () => {
	return (
		<>
			<PageTitle>Dashboard</PageTitle>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Suspense fallback={<CardsSkeleton />}>
					<StatCardsWrapper />
				</Suspense>
			</div>
			<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-8">
				<MainChartWrapper />
			</div>
			<div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-2">
				<RatioCardWrapper />
			</div>
		</>
	)
}

export default DashboardPage
