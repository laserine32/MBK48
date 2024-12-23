"use server"
import { z } from "zod"
import { itemModel } from "../repo"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const ItemSchema = z.object({
	name: z.string().min(1),
	unit: z.string().min(1),
	price: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
})

export const createItem = async (prevSate, formData) => {
	const validatedFields = ItemSchema.safeParse(Object.fromEntries(formData.entries()))
	if (!validatedFields.success) {
		return {
			Errors: validatedFields.error.flatten().fieldErrors,
		}
	}
	try {
		await itemModel.add({
			name: validatedFields.data.name,
			unit: validatedFields.data.unit,
			price: validatedFields.data.price,
		})
	} catch (error) {
		return { message: "Failed to create apps" }
	}
	revalidatePath("/item")
	redirect("/item")
}

export const editItem = async (id, prevSate, formData) => {
	const validatedFields = ItemSchema.safeParse(Object.fromEntries(formData.entries()))
	if (!validatedFields.success) {
		return {
			Errors: validatedFields.error.flatten().fieldErrors,
		}
	}
	try {
		await itemModel.edit(id, {
			name: validatedFields.data.name,
			unit: validatedFields.data.unit,
			price: validatedFields.data.price,
		})
	} catch (error) {
		return { message: "Failed to create apps" }
	}
	revalidatePath("/item")
	redirect("/item")
}

export const deleteItem = async (id) => {
	try {
		await itemModel.edit(id, { flag: false })
	} catch (error) {
		return { message: "Failed to create apps" }
	}
	revalidatePath("/item")
	return { success: true }
}
