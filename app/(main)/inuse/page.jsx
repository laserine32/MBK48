import StandardPage from "@/components/shared/page/standard-page"
import { packInUseModel } from "@/lib/repo"
import { formatTimeToLocal } from "@/lib/utils"

export const metadata = {
	title: "Packs In Use",
}

const tableHeader = ["#", "PACK", "TIME START", "TIME END"]

const PackInUsePage = async ({ searchParams }) => {
	const csp = await searchParams
	const query = csp?.query || ""
	const currentPage = Number(csp?.page) || 1
	const data = await packInUseModel.getSearchPagin(query, currentPage)
	const totalPage = await packInUseModel.getPage(query)
	const tr = data.map((item, index) => [
		{ type: "data", value: index + 1 },
		{ type: "data", value: item.pack.name },
		{ type: "data", value: formatTimeToLocal(item.time_start) },
		{ type: "data", value: item.flag ? "[IN USE]" : formatTimeToLocal(item.time_end) },
	])
	return (
		<>
			<StandardPage
				pageTitle={"Packs"}
				suspenseKey={query + currentPage}
				tableHeader={tableHeader}
				tr={tr}
				totalPages={totalPage}
			></StandardPage>
		</>
	)
}

export default PackInUsePage
