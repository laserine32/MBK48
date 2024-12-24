"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { packInUseModel } from "../repo"

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
	revalidatePath("/inuse")
	redirect("/inuse")
}
