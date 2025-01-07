import InuseForm from "@/components/shared/form/inuse-form"
import { getNextInUse } from "@/lib/actions/other.action"
import { packModel } from "@/lib/repo"

export const metadata = {
	title: "Use Pack",
}

const AddPackInUsePage = async () => {
	const getAll = await packModel.getAll()
	const dataPack = getAll.map((pack) => ({ value: pack.id, label: pack.name }))
	const packInUse = await getNextInUse(dataPack)
	return (
		<>
			<InuseForm pageTitle={"Use Pack"} dataPack={dataPack} value={packInUse.value} />
		</>
	)
}

export default AddPackInUsePage
