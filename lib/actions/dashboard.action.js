import { packInUseModel, productionModel, purchaseModel } from "../repo"
import { formatCurrency } from "../utils"
import prisma from "../prisma"

export const fetchDataCards = async () => {
	const fexpenses = await getExpenses()
	const fproduced = await getProduction()
	const fpackinuse = await getPackInUse()
	return {
		expenses: formatCurrency(fexpenses),
		produced: fproduced.toLocaleString("id-ID"),
		packinuse: fpackinuse,
		daysspent: getDaysspent(),
	}
}

const getExpenses = async () => {
	const data = await purchaseModel.tbl.aggregate({
		_sum: {
			total: true,
		},
	})
	return data._sum.total
}

const getProduction = async () => {
	const data = await productionModel.tbl.aggregate({
		_count: {
			id: true,
		},
	})
	return data._count.id
}

const getPackInUse = async () => {
	const data = await packInUseModel.tbl.findFirst({
		where: {
			flag: true,
		},
		include: {
			pack: true,
		},
	})
	return data?.pack.name
}

const getDaysspent = () => {
	const today = new Date()
	const targetDate = new Date("2024-12-25")

	if (isNaN(targetDate.getTime())) {
		return "Invalid date format"
	}

	let difference = Math.abs(today - targetDate)
	let tdifference = difference

	const msInDay = 24 * 60 * 60 * 1000
	const msInWeek = 7 * msInDay
	const msInMonth = 30 * msInDay
	const msInYear = 365 * msInDay

	const years = Math.floor(difference / msInYear)
	difference %= msInYear

	const months = Math.floor(difference / msInMonth)
	difference %= msInMonth

	const weeks = Math.floor(difference / msInWeek)
	difference %= msInWeek

	const days = Math.floor(difference / msInDay)

	const spelledOut = (value, param) => {
		// if(value == 0) return ""
		if (value == 1) {
			if (param == "y") return "A Year"
			if (param == "m") return "A Month"
			if (param == "w") return "A Week"
			if (param == "d") return "A Day"
		}
		if (value > 1) {
			if (param == "y") return `${years} Years`
			if (param == "m") return `${months} Months`
			if (param == "w") return `${weeks} Weeks`
			if (param == "d") return `${days} Days`
		}
		return ""
	}
	const result = [spelledOut(years, "y"), spelledOut(months, "m"), spelledOut(weeks, "w"), spelledOut(days, "d")]
		.filter(Boolean)
		.join(" ")

	const ret = { days: `${Math.floor(tdifference / msInDay)} Days`, spell: result || "a Day" }
	return ret
}

// Chart

export const getMainChart = async () => {
	const purchase = await prisma.$queryRaw`
		SELECT
			TO_CHAR(date, 'Month') AS month,
			SUM(total)::integer as purchase
		FROM "Purchase"
		GROUP BY TO_CHAR(date, 'Month')
	`
	const production = await prisma.$queryRaw`
	SELECT
		TO_CHAR(date, 'Month') AS month,
		COUNT(*)::integer as production
	FROM "Production"
	GROUP BY TO_CHAR(date, 'Month')
	`
	const inuse = await prisma.$queryRaw`
	SELECT
		TO_CHAR(time_start, 'Month') AS month,
		COUNT(*)::integer as packinuse
	FROM "PackInUse"
	GROUP BY TO_CHAR(time_start, 'Month')
	`
	const data = mergeMultipleObjects([purchase, production, inuse])
	return data
}

const mergeMultipleObjects = (lists) => {
	const uniqueMonths = [...new Set(lists.flatMap((list) => list.map((item) => item.month)))]

	return uniqueMonths.map((month) => {
		const mergedItem = { month }
		lists.forEach((list, index) => {
			const matchingItem = list.find((item) => item.month === month)
			const key = !matchingItem ? Object.keys(list[0]) : Object.keys(matchingItem)
			mergedItem[key[1]] = matchingItem ? matchingItem[key[1]] : 0
		})
		return mergedItem
	})
}

// DATE_TRUNC('month', date) AS month,
