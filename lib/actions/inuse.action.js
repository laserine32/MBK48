"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { packInUseModel } from "../repo"
import { flashMessage } from "../flash/Kilat"

const InUseSchema = z.object({
	packId: z.string().min(1),
})

export const createInUse = async (prevSate, formData) => {
	const validatedFields = InUseSchema.safeParse(Object.fromEntries(formData.entries()))
	if (!validatedFields.success) {
		return {
			Errors: validatedFields.error.flatten().fieldErrors,
		}
	}
	try {
		await packInUseModel.add({
			packId: validatedFields.data.packId,
		})
	} catch (error) {
		return { message: "Failed to use pack" }
	}
	await flashMessage("Success", "success", "Data added successfully.")
	revalidatePath("/")
	revalidatePath("/inuse")
	redirect("/inuse")
}
