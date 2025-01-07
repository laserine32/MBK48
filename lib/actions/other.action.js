import { packInUseModel, productionModel } from "../repo"

export const getNextInUse = async (dataPack) => {
	const inuse = await packInUseModel.tbl.findFirst({
		where: {
			flag: true,
		},
		include: {
			pack: true,
		},
	})
	const index = dataPack.findIndex((e) => e.value === inuse?.pack.id) + 1
	return index >= dataPack.length ? dataPack[0] : dataPack[index]
}

export const getNextProduction = async (dataPack) => {
	const inuse = await productionModel.tbl.findFirst({
		include: {
			pack: true,
		},
		orderBy: {
			date: "desc",
		},
	})
	const index = dataPack.findIndex((e) => e.value === inuse?.pack.id) + 1
	return index >= dataPack.length ? dataPack[0] : dataPack[index]
}
