import ProductionForm from "@/components/shared/form/production-form"
import StandardPage from "@/components/shared/page/standard-page"
import { getNextProduction } from "@/lib/actions/other.action"
import { packModel, productionModel } from "@/lib/repo"
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

	const getAll = await packModel.getAll()
	const dataPack = getAll.map((pack) => ({ value: pack.id, label: pack.name }))
	const lastProduction = await getNextProduction(dataPack)

	return (
		<>
			<ProductionForm pageTitle={"Add Production"} dataPack={dataPack} value={lastProduction.value} />
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
