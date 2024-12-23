import PageTitle from "@/components/shared/page/page-title"
import { CardSkeleton } from "@/components/shared/skeletons"

const DashboardPage = () => {
	return (
		<>
			<PageTitle>Dashboard</PageTitle>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<CardSkeleton />
			</div>
		</>
	)
}

export default DashboardPage
