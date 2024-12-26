"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { productionModel, purchaseModel } from "../repo"

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
		console.log(toAdd)
		await purchaseModel.add(toAdd)
	} catch (error) {
		// console.log(purchaseData)
		console.log(error)
		return { message: "Failed to process purchase!" }
	}
	// const validatedFields = InUseSchema.safeParse(Object.fromEntries(formData.entries()))
	// if (!validatedFields.success) {
	//   return {
	//     Errors: validatedFields.error.flatten().fieldErrors,
	//   }
	// }
	// try {
	//   await productionModel.add({
	//     packId: validatedFields.data.packId,
	//   })
	// } catch (error) {
	//   return { message: "Failed to use pack" }
	// }
	revalidatePath("/purchase")
	redirect("/purchase")
}
