"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { productionModel } from "../repo"

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
		return { message: "Failed to use pack" }
	}
	revalidatePath("/production")
	redirect("/production")
}
