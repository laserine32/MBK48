"use client"
import { useActionState, useEffect, useState } from "react"
import PageTitle from "../page/page-title"
import { ComboBoxCustom, InputCurrencyIDR, InputNumber } from "./input"
import TableTransaction from "../page/table-transaction"
import { SubmitButton } from "../buttons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { z } from "zod"
import { formatCurrency } from "@/lib/utils"
import { addPurchase } from "@/lib/actions/purchase.action"

const tableHeader = ["#", "ITEMS", "QTY", "PRICE", "TOTAL", "ACTIONS"]
const DetailPurchaseSchema = z.object({
	itemId: z.string().min(1),
	price: z.preprocess((a) => Number(z.string().parse(a)), z.number().min(1)),
	qty: z.preprocess((a) => Number(z.string().parse(a)), z.number().min(1)),
})

const PurchaseForm = ({ pageTitle, dataItems }) => {
	const [itemName, setItemName] = useState("")
	const [itemPrice, setItemPrice] = useState(0)
	// const [dataPurchase, setDataPurchase] = useState({date: Date.now(), total: 0, items: []})
	const [detailPurchase, setDetailPurchase] = useState([])
	const [total, setTotal] = useState(0)

	useEffect(() => {
		if (detailPurchase.length == 0) return
		const tot =
			detailPurchase.length == 1 ? detailPurchase[0].subtotal : detailPurchase.reduce((t, e) => t.subtotal + e.subtotal)
		setTotal(tot)
	}, [detailPurchase])

	const onSelect = (value) => {
		const { label, price } = dataItems.filter((e) => e.value === value)[0]
		setItemPrice(price)
		setItemName(label)
	}

	const addDetailAction = (prevSate, formData) => {
		const validatedFields = DetailPurchaseSchema.safeParse(Object.fromEntries(formData.entries()))
		if (!validatedFields.success) {
			return {
				Errors: validatedFields.error.flatten().fieldErrors,
			}
		}
		const subTotal = validatedFields.data.price * validatedFields.data.qty
		const tmpDetailPurchase = {
			id: validatedFields.data.itemId,
			item: itemName,
			qty: validatedFields.data.qty,
			price: validatedFields.data.price,
			subtotal: subTotal,
		}

		setDetailPurchase((data) => {
			const itm = data.find((e) => e.id == tmpDetailPurchase.id)
			if (itm) {
				return data.map((i) =>
					i.id === tmpDetailPurchase.id
						? {
								id: i.id,
								item: i.item,
								qty: i.qty + tmpDetailPurchase.qty,
								price: i.price,
								subtotal: i.subtotal + tmpDetailPurchase.subtotal,
						  }
						: i
				)
			}
			return [tmpDetailPurchase, ...data]
		})
	}

	const deleteItemsAction = (id) => {
		setDetailPurchase((dp) => dp.filter((d) => d.id !== id))
		return {
			success: true,
		}
	}
	const [state, formAction] = useActionState(addDetailAction, null)
	const [purchaseState, purchaseFormAction] = useActionState(
		addPurchase.bind(null, { total: total, items: detailPurchase }),
		null
	)

	const TableTransactionAction = ({ headers, total, items }) => {
		let tr = items.map((d, i) => [
			{ type: "data", value: i + 1 },
			{ type: "data", value: d.item },
			{ type: "data", value: d.qty },
			{ type: "data", value: formatCurrency(d.price) },
			{ type: "data", value: formatCurrency(d.subtotal) },
			{ type: "action", value: d.id, buttons: [{ name: "delete_tansaction", action: deleteItemsAction }] },
		])
		return <TableTransaction headers={headers} data={{ date: Date.now(), total: total }} items={tr} action={true} />
	}

	return (
		<>
			<PageTitle>{pageTitle.toUpperCase()}</PageTitle>
			<form action={formAction}>
				<div className="p-4 md:p-6">
					<ComboBoxCustom
						data={dataItems}
						title={"Item"}
						name={"itemId"}
						state={state}
						callBack={onSelect}
						value={""}
					/>
					<InputCurrencyIDR title={"Price"} name={"price"} state={state} value={itemPrice} />
					<InputNumber title={"Qty"} name={"qty"} state={state} value={1} />
					<div id="message-error" aria-live="polite" aria-atomic="true">
						<p className="mt-2 text-sm text-red-500">{state?.message}</p>
					</div>
				</div>
				<div className="mb-6 flex justify-end gap-4">
					<SubmitButton label={"add"} />
				</div>
			</form>
			<TableTransactionAction headers={tableHeader} total={total} items={detailPurchase} />
			<form action={purchaseFormAction}>
				<div className="p-4 md:p-6">
					<div id="message-error" aria-live="polite" aria-atomic="true">
						<p className="mt-2 text-sm text-red-500">{purchaseState?.message}</p>
					</div>
				</div>
				<div className="mb-6 flex justify-end gap-4">
					<Button variant="outline" asChild>
						<Link href="/purchase">Cancel</Link>
					</Button>
					<SubmitButton label={"save"} />
				</div>
			</form>
		</>
	)
}

export default PurchaseForm
