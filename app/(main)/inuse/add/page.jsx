import InuseForm from "@/components/shared/form/inuse-form"
import StandardPage from "@/components/shared/page/standard-page"
import { getNextInUse } from "@/lib/actions/other.action"
import { packInUseModel, packModel } from "@/lib/repo"
import { formatTimeToLocal } from "@/lib/utils"

export const metadata = {
	title: "Use Pack",
}

const tableHeader = ["#", "PACK", "TIME START", "TIME END"]

const AddPackInUsePage = async ({ searchParams }) => {
	const csp = await searchParams
	const query = csp?.query || ""
	const currentPage = Number(csp?.page) || 1
	const data = await packInUseModel.getSearchPagin(query, currentPage)
	const totalPage = await packInUseModel.getPage(query)
	const tr = data.map((item, index) => [
		{ type: "data", value: index + 1 },
		{ type: "data", value: item.pack.name },
		{ type: "data", value: formatTimeToLocal(item.time_start) },
		{ type: "data", value: item.flag ? "[IN USE]" : formatTimeToLocal(item.time_end) },
	])

	const getAll = await packModel.getAll()
	const dataPack = getAll.map((pack) => ({ value: pack.id, label: pack.name }))
	const packInUse = await getNextInUse(dataPack)

	return (
		<>
			<InuseForm pageTitle={"Use Pack"} dataPack={dataPack} value={packInUse.value} redirect="add" />
			<StandardPage
				pageTitle={"Packs in Used"}
				suspenseKey={query + currentPage}
				tableHeader={tableHeader}
				tr={tr}
				totalPages={totalPage}
			></StandardPage>
		</>
	)
}

export default AddPackInUsePage
