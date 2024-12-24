import StandardPage from "@/components/shared/page/standard-page"
import { productionModel } from "@/lib/repo"
import { formatDateToLocal } from "@/lib/utils"

export const metadata = {
	title: "Production",
}

const tableHeader = ["#", "PACK", "DATE"]

const ProductionPage = async ({ searchParams }) => {
	const csp = await searchParams
	const query = csp?.query || ""
	const currentPage = Number(csp?.page) || 1
	const data = await productionModel.getSearchPagin(query, currentPage)
	const totalPage = await productionModel.getPage(query)
	const tr = data.map((item, index) => [
		{ type: "data", value: index + 1 },
		{ type: "data", value: item.pack.name },
		{ type: "data", value: formatDateToLocal(item.date) },
	])
	return (
		<>
			<StandardPage
				pageTitle={"Production"}
				suspenseKey={query + currentPage}
				tableHeader={tableHeader}
				tr={tr}
				totalPages={totalPage}
			></StandardPage>
		</>
	)
}

export default ProductionPage
