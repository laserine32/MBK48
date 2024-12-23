import ItemForm from "@/components/shared/form/item-form"

export const metadata = {
	title: "Add Items",
}

const AddItemPage = () => {
	return (
		<>
			<ItemForm pageTitle={"Add Item"} />
		</>
	)
}

export default AddItemPage
