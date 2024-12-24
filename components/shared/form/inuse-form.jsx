"use client"
import { Button } from "@/components/ui/button"
import PageTitle from "../page/page-title"
import Link from "next/link"
import { SubmitButton } from "../buttons"
import { ComboBox } from "./input"
import { useActionState } from "react"
import { createInUse } from "@/lib/actions/inuse.action"

const InuseForm = ({ pageTitle, dataPack, dataForm = null }) => {
	const [state, formAction] = useActionState(createInUse, null)
	return (
		<>
			<PageTitle>{pageTitle.toUpperCase()}</PageTitle>
			<form action={formAction}>
				<div className="p-4 md:p-6">
					<ComboBox data={dataPack} title={"Pack"} name={"packId"} state={state} value={""} />
					<div id="message-error" aria-live="polite" aria-atomic="true">
						<p className="mt-2 text-sm text-red-500">{state?.message}</p>
					</div>
				</div>
				<div className="mt-6 flex justify-end gap-4">
					<Button variant="outline" asChild>
						<Link href="/inuse">Cancel</Link>
					</Button>
					<SubmitButton label={dataForm ? "update" : "save"} />
				</div>
			</form>
		</>
	)
}

export default InuseForm
