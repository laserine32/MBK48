"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { productionModel } from "../repo"
import { flashMessage } from "../flash/Kilat"

const InUseSchema = z.object({
	packId: z.string().min(1),
})

export const createProduction = async (prevSate, formData) => {
	const validatedFields = InUseSchema.safeParse(Object.fromEntries(formData.entries()))
	if (!validatedFields.success) {
		return {
			Errors: validatedFields.error.flatten().fieldErrors,
		}
	}
	try {
		await productionModel.add({
			packId: validatedFields.data.packId,
		})
	} catch (error) {
		await flashMessage("Error", "error", "Failed to add production.")
		return { message: "Failed to add production" }
	}
	await flashMessage("Success", "success", "Data added successfully.")
	revalidatePath("/")
	revalidatePath("/production")
	redirect("/production")
}
