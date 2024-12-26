import StandardPage from "@/components/shared/page/standard-page"
import { purchaseModel } from "@/lib/repo"
import { formatCurrency, formatDateToLocal } from "@/lib/utils"

export const metadata = {
	title: "Purchase",
}

const tableHeader = ["#", "DATE", "ITEMS", "TOTAL", "ACTIONS"]

const PurchasePage = async ({ searchParams }) => {
	const csp = await searchParams
	const query = csp?.query || ""
	const currentPage = Number(csp?.page) || 1
	const data = await purchaseModel.getSearchPagin(query, currentPage)
	const totalPage = await purchaseModel.getPage(query)
	const tr = data.map((item, index) => [
		{ type: "data", value: index + 1 },
		{ type: "data", value: formatDateToLocal(item.date) },
		{ type: "data", value: item.items.length },
		{ type: "data", value: formatCurrency(item.total) },
		{ type: "action", value: item.id, buttons: ["view"] },
	])
	return (
		<>
			<StandardPage
				pageTitle={"Purchase"}
				suspenseKey={query + currentPage}
				tableHeader={tableHeader}
				tr={tr}
				totalPages={totalPage}
			></StandardPage>
		</>
	)
}

export default PurchasePage
