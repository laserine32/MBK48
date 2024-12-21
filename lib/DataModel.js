import { ITEMS_PER_PAGE } from "./constants"

class DataModel {
	constructor(tbl, name, config = {}) {
		this.tbl = tbl
		this.name = name
		this.config = config
	}

	genWhere(query) {
		const updateContainsValue = (obj, newValue) => {
			for (const key in obj) {
				if (typeof obj[key] === "object" && obj[key] !== null) {
					updateContainsValue(obj[key], newValue)
				} else if (key === "contains") {
					obj[key] = newValue
				}
			}
		}
		updateContainsValue(this.config.searh_config, query)
		if (this.config.searh_config.length > 1) {
			return {
				OR: this.config.searh_config,
			}
		}
		return this.config.searh_config[0]
	}

	async getSearchPagin(query, currentPage) {
		const offset = (currentPage - 1) * ITEMS_PER_PAGE
		try {
			if (!this.config.searh_config) {
				return await this.getAll()
			}
			let conf = {
				skip: offset,
				take: ITEMS_PER_PAGE,
				where: this.genWhere(query),
			}
			if (this.config.orderBy) {
				conf.orderBy = this.config.orderBy
			}
			if (this.config.include) {
				conf.include = this.config.include
			}
			const data = await this.tbl.findMany(conf)
			return data
		} catch (error) {
			console.log(error.message)
			throw new Error(`Failed to get all '${this.name}' data. with search query '${query}' on page '${currentPage}'`)
		}
	}

	async getPage(query) {
		try {
			let conf = this.config.searh_config
				? {
						where: this.genWhere(query),
				  }
				: {}
			// if (this.config.include) {
			// 	conf.select = this.config.include
			// }
			const data = await this.tbl.count(conf)
			const totalPages = Math.ceil(Number(data) / ITEMS_PER_PAGE)
			return totalPages
		} catch (error) {
			console.log(error.message)
			throw new Error(`Failed to get page in '${this.name}' data. with search query '${query}'`)
		}
	}

	async query(func, err) {
		try {
			return func(this.tbl)
		} catch (error) {
			throw new Error(err)
		}
	}

	async getAll() {
		try {
			let conf = {}
			if (this.config.orderBy) {
				conf.orderBy = this.config.orderBy
			}
			if (this.config.include) {
				conf.include = this.config.include
			}
			const data = await this.tbl.findMany(conf)
			return data
		} catch (error) {
			throw new Error(`Failed to get all '${this.name}' data.`)
		}
	}

	wrapId(id) {
		return id
	}

	async get(id) {
		try {
			let conf = {
				where: {
					id: this.wrapId(id),
				},
			}
			if (this.config.include) {
				conf.include = this.config.include
			}
			const data = await this.tbl.findUnique(conf)
			return data
		} catch (error) {
			console.log(error.message)
			throw new Error(`Failed to get '${this.name}' data.`)
		}
	}

	async add(item) {
		try {
			const data = await this.tbl.create({
				data: item,
			})
			return data
		} catch (error) {
			throw new Error(`Failed to create '${this.name}' data.`)
		}
	}

	async edit(id, item) {
		try {
			const data = await this.tbl.update({
				data: item,
				where: { id },
			})
			return data
		} catch (error) {
			throw new Error(`Failed to edit '${this.name}' data.`)
		}
	}

	async delete(id) {
		try {
			const data = await this.tbl.delete({
				where: { id },
			})
			return data
		} catch (error) {
			throw new Error(`Failed to delete '${this.name}' data.`)
		}
	}
}

export default DataModel
