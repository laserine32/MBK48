import RatioChart from "@/components/shared/dashboard/ratio-chart"
import { getPackRatioChart } from "@/lib/actions/dashboard.action"

const RatioCardWrapper = async () => {
	const mainData = await getPackRatioChart()
	return (
		<>
			<RatioChart mainData={mainData} />
		</>
	)
}

export default RatioCardWrapper
