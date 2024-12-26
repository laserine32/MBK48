import { formatCurrency, formatDateToLocal } from "@/lib/utils"
import { TableButton } from "../buttons"

const TableTransaction = ({ headers, data, items, action = false }) => {
	return (
		<>
			{!action && (
				<div className="flex items-center justify-start gap-1 mb-5">
					<h3>Date :</h3>
					<p>{formatDateToLocal(data.date)}</p>
				</div>
			)}
			<table className="w-full text-sm text-left">
				<thead className="text-sm uppercase">
					<tr>
						{headers.map((item, index) => {
							return (
								<th className="p-2 md:py-3 md:px-6" key={index}>
									{item}
								</th>
							)
						})}
					</tr>
				</thead>
				<tbody>
					<TableRow tr={items} />
				</tbody>
				<tfoot>
					<tr>
						<th colSpan={headers.length - (action ? 2 : 1)} className="p-2 md:py-3 md:px-6">
							TOTAL
						</th>
						<td className="p-2 md:py-3 md:px-6">{formatCurrency(data.total)}</td>
					</tr>
				</tfoot>
			</table>
		</>
	)
}

const TableRow = ({ tr }) => {
	return tr.map((trtd, i) => (
		<tr key={i} className="border-b">
			{trtd?.map((td, j) => (
				<TableData key={j} td={td} />
			))}
		</tr>
	))
}

const TableData = ({ td }) => {
	if (td.type == "action") {
		return (
			<>
				<td className="flex justify-center gap-1 py-3">
					{td.buttons?.map((btn, i) => {
						if (typeof btn === "object" && btn !== null) {
							return <TableButton key={i} id={td.value} name={btn.name} action={btn.action} />
						}
						return <TableButton key={i} id={td.value} name={btn} />
					})}
				</td>
			</>
		)
	}
	return <td className="p-2 md:py-3 md:px-6">{td.value}</td>
}

export default TableTransaction
