import { getMainChart } from "@/lib/actions/dashboard.action"
import MainChart from "./main-chart"

const MainChartWrapper = async () => {
	const mainData = await getMainChart()
	return (
		<>
			<MainChart mainData={mainData} />
		</>
	)
}

export default MainChartWrapper
