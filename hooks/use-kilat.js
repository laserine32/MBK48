import { flashMessage } from "@/lib/flash/Kilat"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export const useFlashMessage = () => {
	const path = usePathname()
	useEffect(() => {
		const showFlashMessage = async () => {
			const flash = await flashMessage()
			if (flash) {
				if (flash.level) {
					toast[flash.level](flash.message, flash.options)
				} else {
					toast(flash.message, flash.options)
				}
			}
		}
		showFlashMessage()
	}, [path])
}
