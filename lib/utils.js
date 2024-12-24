import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
	return twMerge(clsx(inputs))
}

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

export const formatTimeToLocal = (dateStr, locale = "id-ID") => {
	const date = new Date(dateStr)
	const options = {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: false,
	}
	const formatter = new Intl.DateTimeFormat(locale, options)
	return formatter.format(date)
}

export const generatePagination = (currentPage, totalPages) => {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}

	if (currentPage <= 3) {
		return [1, 2, 3, "...", totalPages - 1, totalPages]
	}

	if (currentPage >= totalPages - 2) {
		return [1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages]
	}

	return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
}
