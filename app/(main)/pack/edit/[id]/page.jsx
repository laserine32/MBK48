import PackForm from "@/components/shared/form/pack-form"
import { packModel } from "@/lib/repo"

export const metadata = {
	title: "Edit Pack",
}

const EditPackPage = async ({ params }) => {
	const { id } = await params
	const data = await packModel.get(id)
	return (
		<>
			<PackForm pageTitle={"Edit Pack"} dataForm={data} />
		</>
	)
}

export default EditPackPage
