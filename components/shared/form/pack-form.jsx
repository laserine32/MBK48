"use client"
import { createPack, editPack } from "@/lib/actions/pack.actions"
import { useActionState } from "react"
import PageTitle from "../page/page-title"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SubmitButton } from "../buttons"
import { InputNumber, InputText } from "./input"

const PackForm = ({ pageTitle, dataForm = null }) => {
	let actionForm = createPack
	if (dataForm) {
		actionForm = editPack.bind(null, dataForm.id)
	}
	const [state, formAction] = useActionState(actionForm, null)
	return (
		<>
			<PageTitle>{pageTitle.toUpperCase()}</PageTitle>
			<form action={formAction}>
				<div className="p-4 md:p-6">
					<InputText title={"Pack Name"} name={"name"} state={state} value={dataForm?.name} />
					<InputNumber title={"Total Content"} name={"total_content"} state={state} value={dataForm?.total_content} />
					<div id="message-error" aria-live="polite" aria-atomic="true">
						<p className="mt-2 text-sm text-red-500">{state?.message}</p>
					</div>
				</div>
				<div className="mt-6 flex justify-end gap-4">
					<Button variant="outline" asChild>
						<Link href="/pack">Cancel</Link>
					</Button>
					<SubmitButton label={dataForm ? "update" : "save"} />
				</div>
			</form>
		</>
	)
}

export default PackForm
