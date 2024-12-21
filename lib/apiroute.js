import { NextRequest, NextResponse } from "next/server"

export const apiResonse = async (callback) => {
	try {
		const data = await callback()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: `${error.message}` }, { status: 500 })
	}
}

export const get = async (request, model) => {
	return apiResonse(() => model.getAll())
}

export const getwparam = async (request, model, params) => {
	return apiResonse(async () => {
		const { id } = await params
		return model.get(id)
	})
}

export const getSearchPagin = async (request, model) => {
	return apiResonse(async () => {
		let page = request.nextUrl.searchParams.get("page")
		let query = request.nextUrl.searchParams.get("query")
		page = page == null ? 1 : Number(page)
		query = query == null ? "" : query
		const data = {
			data: await model.getSearchPagin(query, page),
			pagination: {
				current_page: page,
				pages: await model.getPage(query),
			},
			search_query: query,
		}
		return data
	})
}

export const post = async (request, model) => {
	return apiResonse(async () => {
		const body = await request.json()
		return model.add(body)
	})
}

export const put = async (request, model) => {
	return apiResonse(async () => {
		const body = await request.json()
		const id = body.id
		return model.edit(id, body)
	})
}
