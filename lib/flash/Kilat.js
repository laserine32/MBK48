"use server"
import { cookies } from "next/headers"

const COOKIE_KEY = "kilat"

const isValidLevel = (level) => typeof level === "string" && ["info", "success", "warning", "error"].includes(level)

const isValidMessage = (message) =>
	!!message && typeof message === "object" && "message" in message && typeof message.message === "string"

const toJson = (message) => {
	return JSON.stringify(message, (key, value) => {
		if (key === "duration" && value == Infinity) {
			return "Infinity"
		}
		return value
	})
}

const fromJson = (message) => {
	return JSON.parse(message, (key, value) => {
		if (key === "duration" && value === "Infinity") {
			return Infinity
		}
		return value
	})
}

export const getFlashMessage = async () => {
	try {
		const cookieStore = await cookies()
		const rawMessage = cookieStore.get(COOKIE_KEY)?.value ?? null
		cookieStore.delete(COOKIE_KEY)
		if (!rawMessage) {
			return null
		}
		const parsedMessage = fromJson(rawMessage)
		if (isValidMessage(parsedMessage)) {
			return {
				message: parsedMessage.message,
				level: isValidLevel(parsedMessage.level) ? parsedMessage.level : undefined,
				options: {
					description: parsedMessage.options?.description ?? parsedMessage.description,
					duration: parsedMessage.options?.duration ?? parsedMessage.duration,
					position: parsedMessage.options?.position ?? parsedMessage.position,
					closeButton: parsedMessage.options?.closeButton ?? parsedMessage.closeButton,
				},
			}
		}
		throw new Error("Invalid flash message format in cookie.")
	} catch (error) {
		console.error("Failed to retrieve or delete flash message.", error)
		return null
	}
}

export async function setFlashMessage(message, level, description) {
	try {
		let messageToStore
		if (typeof message === "string") {
			if (level && !isValidLevel(level)) {
				throw new Error(`Invalid flash message level: ${level}`)
			} else {
				messageToStore = { message, level, description }
			}
		} else if (isValidMessage(message)) {
			messageToStore = {
				...message,
				level: isValidLevel(message.level) ? message.level : undefined,
			}
		} else {
			console.error("Invalid flash message format.", { message })
			throw new Error("Invalid flash message format.")
		}
		;(await cookies()).set(COOKIE_KEY, toJson(messageToStore))
	} catch (error) {
		console.error("Failed to set flash message", error)
		throw error
	}
}

export async function flashMessage(message, level, description) {
	try {
		if (typeof message === "string") {
			await setFlashMessage(message, level, description)
		} else if (typeof message === "object") {
			await setFlashMessage(message)
		} else {
			return await getFlashMessage()
		}
	} catch (error) {
		console.error("Failed to handle flash message.", error)
	}
}
