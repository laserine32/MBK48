import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export const CardSkeleton = () => {
	return (
		<Card>
			<CardHeader className="flex flex-row  space-y-0 space-x-3">
				<Skeleton className="w-6 h-6 rounded-full" />
				<Skeleton className="w-20 h-6" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-10 w-full" />
			</CardContent>
		</Card>
	)
}

export const TableItemsSkeleton = () => {
	const data = [...Array(10).keys()]
	return (
		<table className="w-full text-sm text-left text-gray-500">
			<thead className="text-sm text-gray-700 uppercase bg-gray-50">
				<tr>
					<th className="py-3 px-6">#</th>
					<th className="py-3 px-6">Name</th>
					<th className="py-3 px-6">Unit</th>
					<th className="py-3 px-6">Price</th>
					<th className="py-3 px-6 text-center">Actions</th>
				</tr>
			</thead>
			<tbody>
				{data.map((item, index) => (
					<tr key={index} className="bg-white border-b">
						<td className="py-3 px-6">
							<Skeleton className="h-6 w-16" />
						</td>
						<td className="py-3 px-6">
							<Skeleton className="h-6 w-16" />
						</td>
						<td className="py-3 px-6">
							<Skeleton className="h-6 w-16" />
						</td>
						<td className="py-3 px-6">
							<Skeleton className="h-6 w-16" />
						</td>
						<td className="flex justify-center gap-1 py-3">
							<Skeleton className="h-6 w-16" />
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
export const TableSkeleton = ({ header }) => {
	const data = [...Array(10).keys()]
	return (
		<table className="w-full text-sm text-left text-gray-500">
			<thead className="text-sm text-gray-700 uppercase bg-gray-50">
				<tr>
					{header.map((item, index) => {
						if (item.toLowerCase() == "actions")
							return (
								<th key={index} className="py-3 px-6 text-center">
									Actions
								</th>
							)
						return (
							<th key={index} className="py-3 px-6">
								{item}
							</th>
						)
					})}
				</tr>
			</thead>
			<tbody>
				{data.map((item, index) => (
					<tr key={index} className="bg-white border-b">
						{header.map((item, index) => (
							<td key={index} className="py-3 px-6">
								<Skeleton className="h-6 w-16" />
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}
