import ProductionForm from "@/components/shared/form/production-form"
import { getNextProduction } from "@/lib/actions/other.action"
import { packModel } from "@/lib/repo"

export const metadata = {
	title: "Add Production",
}

const AddProductionPage = async () => {
	const getAll = await packModel.getAll()
	const dataPack = getAll.map((pack) => ({ value: pack.id, label: pack.name }))
	const lastProduction = await getNextProduction(dataPack)
	return (
		<>
			<ProductionForm pageTitle={"Add Production"} dataPack={dataPack} value={lastProduction.value} />
		</>
	)
}

export default AddProductionPage
