"use client"
import { useFlashMessage } from "@/hooks/use-kilat"
import { Toaster } from "../ui/sonner"

const FlashMessageProvider = () => {
	useFlashMessage()

	return (
		<>
			<Toaster />
		</>
	)
}

export { FlashMessageProvider }
