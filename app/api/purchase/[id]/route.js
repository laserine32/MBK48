import { getwparam } from "@/lib/apiroute"
import { purchaseModel as model } from "@/lib/repo"

export const GET = async (request, { params }) => getwparam(request, model, params)
