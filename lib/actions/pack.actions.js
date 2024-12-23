"use server"
import { revalidatePath } from "next/cache"
import { packModel } from "../repo"
import { z } from "zod"
import { redirect } from "next/navigation"

const PackSchema = z.object({
	name: z.string().min(1),
	total_content: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
})

export const createPack = async (prevSate, formData) => {
	const validatedFields = PackSchema.safeParse(Object.fromEntries(formData.entries()))
	if (!validatedFields.success) {
		return {
			Errors: validatedFields.error.flatten().fieldErrors,
		}
	}
	try {
		await packModel.add({
			name: validatedFields.data.name,
			total_content: validatedFields.data.total_content,
		})
	} catch (error) {
		return { message: "Failed to create pack" }
	}
	revalidatePath("/pack")
	redirect("/pack")
}

export const editPack = async (id, prevSate, formData) => {
	const validatedFields = PackSchema.safeParse(Object.fromEntries(formData.entries()))
	if (!validatedFields.success) {
		return {
			Errors: validatedFields.error.flatten().fieldErrors,
		}
	}
	try {
		await packModel.edit(id, {
			name: validatedFields.data.name,
			total_content: validatedFields.data.total_content,
		})
	} catch (error) {
		return { message: "Failed to create pack" }
	}
	revalidatePath("/pack")
	redirect("/pack")
}

export const deletePack = async (id) => {
	try {
		await packModel.edit(id, { flag: false })
	} catch (error) {
		return { message: "Failed to delete pack" }
	}
	revalidatePath("/pack")
	return { success: true }
}
