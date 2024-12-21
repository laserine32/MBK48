import { getSearchPagin, post, put } from "@/lib/apiroute"
import { itemModel as model } from "@/lib/repo"

export const GET = async (request) => getSearchPagin(request, model)
export const POST = async (request) => post(request, model)
export const PUT = async (request) => put(request, model)
