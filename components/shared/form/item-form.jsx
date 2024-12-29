"use client"
import PageTitle from "../page/page-title"
import { useActionState } from "react"
import { createItem, editItem } from "@/lib/actions/item.actions"
import { InputCurrencyIDR, InputText, InputTextDataList } from "./input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SubmitButton } from "../buttons"

const units = ["Ons", "Pcs", "Pck", "Set"]

const ItemForm = ({ pageTitle, dataForm = null }) => {
	let actionForm = createItem
	if (dataForm) {
		actionForm = editItem.bind(null, dataForm.id)
	}
	const [state, formAction] = useActionState(actionForm, null)
	return (
		<>
			<PageTitle>{pageTitle.toUpperCase()}</PageTitle>
			<form action={formAction}>
				<div className="p-4 md:p-6">
					<InputText title={"Item Name"} name={"name"} state={state} value={dataForm?.name} />
					<InputTextDataList title={"Unit"} name={"unit"} state={state} units={units} value={dataForm?.unit} />
					<InputCurrencyIDR title={"Price"} name={"price"} state={state} defaultValue={dataForm?.price} />
					<div id="message-error" aria-live="polite" aria-atomic="true">
						<p className="mt-2 text-sm text-red-500">{state?.message}</p>
					</div>
				</div>
				<div className="mt-6 flex justify-end gap-4">
					<Button variant="outline" asChild>
						<Link href="/item">Cancel</Link>
					</Button>
					<SubmitButton label={dataForm ? "update" : "save"} />
				</div>
			</form>
		</>
	)
}

export default ItemForm
