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
		</>
	)
}

export default DashboardPage
