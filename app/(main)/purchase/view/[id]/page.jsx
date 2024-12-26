import TransactionPage from "@/components/shared/page/transaction-page"
import { purchaseModel } from "@/lib/repo"
import { formatCurrency } from "@/lib/utils"

export const metadata = {
	title: "Purchase Detail",
}

const tableHeader = ["#", "ITEMS", "QTY", "PRICE", "TOTAL"]
const DetailPuchasePage = async ({ params }) => {
	const { id } = await params
	const data = await purchaseModel.get(id)
	const tr = data.items.map((item, index) => [
		{ type: "data", value: index + 1 },
		{ type: "data", value: item.item.name },
		{ type: "data", value: item.qty },
		{ type: "data", value: formatCurrency(item.cost) },
		{ type: "data", value: formatCurrency(item.total) },
	])
	return (
		<>
			<TransactionPage pageTitle={"Purchase Detail"} tableHeader={tableHeader} data={data} suspenseKey={id} tr={tr} />
		</>
	)
}

export default DetailPuchasePage
