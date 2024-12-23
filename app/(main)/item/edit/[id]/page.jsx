import ItemForm from "@/components/shared/form/item-form"
import { itemModel } from "@/lib/repo"

const EditItemPage = async ({ params }) => {
	const { id } = await params
	const data = await itemModel.get(id)
	return (
		<>
			<ItemForm pageTitle={"Edit Item"} dataForm={data} />
		</>
	)
}

export default EditItemPage
