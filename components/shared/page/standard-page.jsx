import PageTitle from "./page-title"
import Search from "./search"
import { Suspense } from "react"
import { TableSkeleton } from "../skeletons"
import Pagination from "./pagination"
import Table from "./table"
import { CreateButton } from "../buttons"

const StandardPage = ({ pageTitle, suspenseKey, tableHeader, tr, totalPages }) => {
	return (
		<>
			<PageTitle>{pageTitle.toUpperCase()}</PageTitle>
			<div className="flex items-center justify-between gap-1 mb-5">
				<Search />
				<CreateButton />
			</div>
			<Suspense key={suspenseKey} fallback={<TableSkeleton header={tableHeader} />}>
				<Table headers={tableHeader} data={tr}></Table>
			</Suspense>
			<div className="flex justify-center mt-4">
				<Pagination totalPages={totalPages} />
			</div>
		</>
	)
}

export default StandardPage
