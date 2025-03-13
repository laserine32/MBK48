import { packInUseModel, productionModel, purchaseModel } from "../repo"
import { formatCurrency } from "../utils"
import prisma from "../prisma"

export const fetchDataCards = async () => {
	const daysspent = getDaysspent()
	const fexpenses = await getExpenses()
	const fproduced = await getProduction()
	const fpackinuse = await getPackInUse()

	// console.log(fpackinuse)
	return {
		expenses: { total: formatCurrency(fexpenses), day: `\u00b1 ${formatCurrency(fexpenses / daysspent.day)} / days` },
		produced: {
			total: fproduced.toLocaleString("id-ID"),
			day: `\u00b1 ${Math.round(fproduced / daysspent.day).toLocaleString("id-ID")} / days`,
		},
		packinuse: {
			total: fpackinuse.name,
			day: `total : ${fpackinuse.total}. \u00b1 ${Math.round(fpackinuse.total / daysspent.day).toLocaleString(
				"id-ID"
			)} / days`,
		},
		daysspent: daysspent,
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
	const count = await packInUseModel.tbl.aggregate({
		_count: {
			id: true,
		},
	})
	return { name: data?.pack.name, total: count._count.id }
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
	const dday = Math.floor(tdifference / msInDay)
	const ret = { days: `${dday} Days`, spell: result || "a Day", day: dday }
	return ret
}

// Chart

export const getMainChart = async () => {
	const purchase = await prisma.$queryRaw`
		SELECT
			TO_CHAR(date, 'YYYY-MM') as tgl,
			TO_CHAR(date, 'Month') AS month,
			SUM(total)::integer as purchase
		FROM "Purchase"
		GROUP BY TO_CHAR(date, 'YYYY-MM'), TO_CHAR(date, 'Month')
		ORDER BY 1
	`
	const production = await prisma.$queryRaw`
	SELECT
		TO_CHAR(date, 'YYYY-MM') as tgl,
		TO_CHAR(date, 'Month') AS month,
		COUNT(*)::integer as production
	FROM "Production"
		GROUP BY TO_CHAR(date, 'YYYY-MM'), TO_CHAR(date, 'Month')
		ORDER BY 1
	`
	const inuse = await prisma.$queryRaw`
	SELECT
		TO_CHAR(time_start, 'YYYY-MM') as tgl,
		TO_CHAR(time_start, 'Month') AS month,
		COUNT(*)::integer as packinuse
	FROM "PackInUse"
	GROUP BY TO_CHAR(time_start, 'Month'), TO_CHAR(time_start, 'YYYY-MM')
	ORDER BY 1
	`
	console.log(purchase)
	const data = mergeMultipleObjects([purchase, production, inuse])
	return data
}

const mergeMultipleObjects = (lists) => {
	const uniqueMonths = [...new Set(lists.flatMap((list) => list.map((item) => item.tgl)))]
	return uniqueMonths.map((tgl) => {
		const mergedItem = { tgl }
		lists.forEach((list, index) => {
			const matchingItem = list.find((item) => item.tgl === tgl)
			const key = !matchingItem ? Object.keys(list[0]) : Object.keys(matchingItem)
			mergedItem[key[1]] = matchingItem ? matchingItem[key[1]] : 0
			mergedItem[key[2]] = matchingItem ? matchingItem[key[2]] : 0
		})
		return mergedItem
	})
}

// DATE_TRUNC('month', date) AS month,
