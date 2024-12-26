import { getSearchPagin, post } from "@/lib/apiroute"
import { purchaseModel as model } from "@/lib/repo"

export const GET = async (request) => getSearchPagin(request, model)
export const POST = async (request) => post(request, model)
