import { TableButton } from "../buttons"

const Table = ({ headers, data }) => {
	return (
		<>
			<table className="w-full text-sm text-left">
				<thead className="text-sm uppercase">
					<tr>
						{headers.map((item, index) => {
							if (item.toLowerCase() == "actions")
								return (
									<th className="py-3 px-6 text-center" key={index}>
										Actions
									</th>
								)
							return (
								<th className="py-3 px-6" key={index}>
									{item}
								</th>
							)
						})}
					</tr>
				</thead>
				<tbody className="divide-y">
					<TableRow tr={data} />
				</tbody>
			</table>
		</>
	)
}

const TableRow = ({ tr }) => {
	return tr.map((trtd, i) => (
		<tr key={i} className="border-b">
			{trtd.map((td, j) => (
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
	return <td className="py-3 px-6">{td.value}</td>
}

export default Table
