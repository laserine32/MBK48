import StandardPage from "@/components/shared/page/standard-page"
import { deletePack } from "@/lib/actions/pack.actions"
import { packModel } from "@/lib/repo"

export const metadata = {
	title: "Packs",
}

const tableHeader = ["#", "NAME", "TOTAL CONTENT", "ACTIONS"]

const PackPage = async ({ searchParams }) => {
	const csp = await searchParams
	const query = csp?.query || ""
	const currentPage = Number(csp?.page) || 1
	const data = await packModel.getSearchPagin(query, currentPage)
	const totalPage = await packModel.getPage(query)
	const tr = data.map((item, index) => [
		{ type: "data", value: index + 1 },
		{ type: "data", value: item.name },
		{ type: "data", value: item.total_content },
		{ type: "action", value: item.id, buttons: ["edit", { name: "delete", action: deletePack }] },
	])
	return (
		<>
			<StandardPage
				pageTitle={"Packs"}
				suspenseKey={query + currentPage}
				tableHeader={tableHeader}
				tr={tr}
				totalPages={totalPage}
			></StandardPage>
		</>
	)
}

export default PackPage
