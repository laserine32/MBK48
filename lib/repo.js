import DataModel from "./DataModel"
import prisma from "./prisma"

const bassic_config = {
	orderBy: {
		name: "asc",
	},
	filter: {
		flag: true,
	},
	searh_config: [
		{
			name: {
				contains: "",
				mode: "insensitive",
			},
		},
	],
}

export const itemModel = new DataModel(prisma.items, "items", bassic_config)
export const packModel = new DataModel(prisma.packs, "packs", bassic_config)

export const packInUseModel = new DataModel(prisma.packInUse, "packs in use", {
	searh_config: [
		{
			pack: {
				name: {
					contains: "",
					mode: "insensitive",
				},
			},
		},
	],
	orderBy: {
		time_start: "desc",
	},
	include: {
		pack: true,
	},
})
packInUseModel.wrapId = (id) => Number(id)
packInUseModel.add = async function (item) {
	try {
		const lastInUseId = await this.tbl.findFirst({
			where: {
				flag: true,
			},
		}).id
		await prisma.$transaction(
			async (prisma) => {
				await Promise.all([
					await prisma.packInUse.updateMany({
						data: { flag: false },
						where: { id: lastInUseId },
					}),
					await prisma.packInUse.create({
						data: item,
					}),
				])
			},
			{
				maxWait: 5000, // default: 2000
				timeout: 10000, // default: 5000
			}
		)
		const data = await this.tbl.findFirst({
			where: {
				flag: true,
			},
		})
		return data
	} catch (error) {
		console.log(error.message)
		throw new Error(`Failed to add '${this.name}' data.`)
	}
}

export const productionModel = new DataModel(prisma.production, "production", {
	searh_config: [
		{
			pack: {
				name: {
					contains: "",
					mode: "insensitive",
				},
			},
		},
	],
	orderBy: {
		date: "desc",
	},
	include: {
		pack: true,
	},
})
productionModel.wrapId = (id) => Number(id)

export const purchaseModel = new DataModel(prisma.purchase, "purchase", {
	searh_config: [
		{
			items: {
				item: {
					name: {
						contains: "",
						mode: "insensitive",
					},
				},
			},
		},
	],
	orderBy: {
		date: "desc",
	},
	include: {
		items: {
			include: {
				item: true,
			},
		},
	},
})
purchaseModel.add = async function (data) {
	try {
		return await prisma.purchase.create({
			data: {
				total: data.total,
				items: {
					create: data.items.map((d) => {
						if (d.item) {
							return {
								qty: d.qty,
								cost: d.cost,
								total: d.total,
								item: {
									create: {
										name: d.item.name,
										unit: d.item.unit,
										price: d.item.price,
									},
								},
							}
						}
						return d
					}),
				},
			},
			include: {
				items: {
					include: {
						item: true,
					},
				},
			},
		})
	} catch (error) {
		throw new Error(`Failed to create '${this.name}' data.`)
	}
}
