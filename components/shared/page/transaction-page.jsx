import { Suspense } from "react"
import PageTitle from "./page-title"
import { TransactionDetailSkelecton } from "../skeletons"
import TableTransaction from "./table-transaction"

const TransactionPage = ({ pageTitle, tableHeader, data, suspenseKey, tr }) => {
	return (
		<>
			<PageTitle>{pageTitle.toUpperCase()}</PageTitle>
			<Suspense key={suspenseKey} fallback={<TransactionDetailSkelecton header={tableHeader} />}>
				<TableTransaction headers={tableHeader} data={data} items={tr}></TableTransaction>
			</Suspense>
		</>
	)
}

export default TransactionPage
