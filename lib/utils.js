// import { clsx } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs) {
// 	return twMerge(clsx(inputs))
// }

export const capitalizeFirstLetter = (text) => {
	if (typeof text !== "string") {
		return ""
	}

	return text.charAt(0).toUpperCase() + text.slice(1)
}

export const formatCurrency = (amount) => {
	return amount.toLocaleString("id-ID", {
		style: "currency",
		currency: "IDR",
	})
}

export const formatDateToLocal = (dateStr, locale = "id-ID") => {
	const date = new Date(dateStr)
	const options = {
		day: "numeric",
		month: "short",
		year: "numeric",
	}
	const formatter = new Intl.DateTimeFormat(locale, options)
	return formatter.format(date)
}
