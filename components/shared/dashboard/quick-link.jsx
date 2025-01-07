import { Card, CardContent, CardHeader } from "@/components/ui/card"
import React from "react"

const QuickLink = () => {
	return (
		<>
			<Card className="flex w-full flex-col md:col-span-2">
				<CardHeader>
					<h2 className="mb-4 text-xl md:text-2xl">Quick Link</h2>
				</CardHeader>
				<CardContent></CardContent>
			</Card>
		</>
	)
}

export default QuickLink
