import ProductionForm from "@/components/shared/form/production-form"
import { packModel } from "@/lib/repo"

export const metadata = {
	title: "Add Production",
}

const AddProductionPage = async () => {
	const getAll = await packModel.getAll()
	const dataPack = getAll.map((pack) => ({ value: pack.id, label: pack.name }))
	return (
		<>
			<ProductionForm pageTitle={"Add Production"} dataPack={dataPack} />
		</>
	)
}

export default AddProductionPage
