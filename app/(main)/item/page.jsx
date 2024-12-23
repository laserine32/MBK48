import StandardPage from "@/components/shared/page/standard-page"
import { deleteItem } from "@/lib/actions/item.actions"
import { itemModel } from "@/lib/repo"
import { formatCurrency } from "@/lib/utils"

export const metadata = {
	title: "Items",
}

const tableHeader = ["#", "NAME", "UNIT", "PRICE", "ACTIONS"]

const ItemPage = async ({ searchParams }) => {
	const csp = await searchParams
	const query = csp?.query || ""
	const currentPage = Number(csp?.page) || 1
	const data = await itemModel.getSearchPagin(query, currentPage)
	const totalPage = await itemModel.getPage(query)
	const tr = data.map((item, index) => [
		{ type: "data", value: index + 1 },
		{ type: "data", value: item.name },
		{ type: "data", value: item.unit },
		{ type: "data", value: formatCurrency(item.price) },
		{ type: "action", value: item.id, buttons: ["edit", { name: "delete", action: deleteItem }] },
	])
	return (
		<>
			<StandardPage
				pageTitle={"Items"}
				suspenseKey={query + currentPage}
				tableHeader={tableHeader}
				tr={tr}
				totalPages={totalPage}
			></StandardPage>
		</>
	)
}

export default ItemPage
