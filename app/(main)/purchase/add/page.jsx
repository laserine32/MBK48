import PurchaseForm from "@/components/shared/form/purchase-form"
import { itemModel } from "@/lib/repo"

export const metadata = {
	title: "Add Purchase",
}

const AddPurchasePage = async () => {
	const getAll = await itemModel.getAll()
	const dataItems = getAll.map((pack) => ({ value: pack.id, label: pack.name, price: pack.price }))
	return (
		<>
			<PurchaseForm pageTitle={"ADD PURCHASE"} dataItems={dataItems} />
		</>
	)
}

export default AddPurchasePage
