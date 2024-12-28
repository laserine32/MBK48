"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { purchaseModel } from "../repo"

export const addPurchase = async (purchaseData) => {
	try {
		const toAdd = {
			total: purchaseData.total,
			items: purchaseData.items.map((d) => ({
				itemId: d.id,
				qty: d.qty,
				cost: d.price,
				total: d.subtotal,
			})),
		}
		await purchaseModel.add(toAdd)
	} catch (error) {
		console.log(error)
		return { message: "Failed to process purchase!" }
	}
	revalidatePath("/")
	revalidatePath("/purchase")
	redirect("/purchase")
}
