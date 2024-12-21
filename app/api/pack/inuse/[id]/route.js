import { getwparam } from "@/lib/apiroute"
import { packInUseModel as model } from "@/lib/repo"

export const GET = async (request, { params }) => getwparam(request, model, params)
