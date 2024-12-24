import InuseForm from "@/components/shared/form/inuse-form"
import { packModel } from "@/lib/repo"

export const metadata = {
	title: "Use Pack",
}

const AddPackInUsePage = async () => {
	const getAll = await packModel.getAll()
	const dataPack = getAll.map((pack) => ({ value: pack.id, label: pack.name }))
	return (
		<>
			<InuseForm pageTitle={"Use Pack"} dataPack={dataPack} />
		</>
	)
}

export default AddPackInUsePage
