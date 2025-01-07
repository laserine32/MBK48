"use client"
import { Button } from "@/components/ui/button"
import { CircleHelp, Eye, Loader2, Pencil, Plus, Trash, TriangleAlert } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useFormStatus } from "react-dom"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
	DialogDescription,
	DialogTitle,
} from "../ui/dialog"
import { useActionState, useEffect, useState } from "react"
import { flashMessage } from "@/lib/flash/Kilat"
import { toast } from "sonner"

export const CreateButton = () => {
	const pathname = usePathname()
	return (
		<>
			<Button size="icon" asChild>
				<Link href={`${pathname}/add`}>
					<Plus />
				</Link>
			</Button>
		</>
	)
}

export const TableButton = ({ id, name, action = null }) => {
	const pathname = usePathname()
	let href = `${pathname}/${name}/${id}`
	let Icn = CircleHelp
	if (name == "edit") Icn = Pencil
	if (name == "view") Icn = Eye
	if (name == "delete") return <DeleteButton id={id} action={action} />
	if (name == "delete_tansaction") return <DeleteButtonTransaction id={id} action={action} />
	return (
		<>
			<Button variant="outline" size="icon" asChild>
				<Link href={href}>
					<Icn className="w-5" />
				</Link>
			</Button>
		</>
	)
}

export const DeleteButtonTransaction = ({ id, action }) => {
	const DeleteAppWithId = action.bind(null, id)
	const [state, formAction] = useActionState(DeleteAppWithId, null)
	return (
		<>
			<form action={formAction}>
				<Button type="submit" variant="outline" size="icon">
					<Trash className="w-5" />
				</Button>
			</form>
		</>
	)
}

export const DeleteButton = ({ id, action }) => {
	const DeleteAppWithId = action.bind(null, id)
	const [state, formAction] = useActionState(DeleteAppWithId, null)
	const [dialogOpen, setDialogOpen] = useState(false)
	useEffect(() => {
		if (state?.success) {
			setDialogOpen(false)
			const showFlashMessage = async () => {
				const flash = await flashMessage()
				if (flash) {
					if (flash.level) {
						toast[flash.level](flash.message, flash.options)
					} else {
						toast(flash.message, flash.options)
					}
				}
			}
			showFlashMessage()
		}
	}, [state])

	return (
		<>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogTrigger asChild>
					<Button variant="outline" size="icon">
						<Trash className="w-5" />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<form action={formAction}>
						<div className="flex flex-col items-center justify-center gap-4">
							<TriangleAlert size={100} className="text-orange-400" />
							<DialogHeader>
								<DialogTitle className="text-center">Are you really sure?</DialogTitle>
								<DialogDescription>
									Because this is master data, this data is very influential on transaction data. Are you really sure
									you want to delete this? The action you take cannot be undone.
								</DialogDescription>
							</DialogHeader>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="secondary">
									Close
								</Button>
							</DialogClose>
							<SubmitButton label={"delete"} />
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	)
}

export const SubmitButton = ({ label }) => {
	const { pending } = useFormStatus()
	let lblBtn = "Save"
	let lblBtnLoading = "Saving..."
	if (label == "update") {
		lblBtn = "Update"
		lblBtnLoading = "Updating..."
	}
	if (label == "delete") {
		lblBtn = "Delete"
		lblBtnLoading = "Deleting..."
	}
	if (label == "add") {
		lblBtn = "Add"
		lblBtnLoading = "Adding..."
	}
	if (pending) {
		return (
			<>
				<Button type="submit" disabled>
					<Loader2 className="animate-spin" />
					{lblBtnLoading}
				</Button>
			</>
		)
	}
	return (
		<>
			<Button type="submit">{lblBtn}</Button>
		</>
	)
}
