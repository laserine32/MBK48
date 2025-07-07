import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { fetchDataCards } from "@/lib/actions/dashboard.action"
import { BanknoteIcon, CalendarClock, Factory, PackageOpen } from "lucide-react"

const iconMap = {
	expenses: BanknoteIcon,
	produced: Factory,
	packinuse: PackageOpen,
	daysspent: CalendarClock,
}

const StatCardsWrapper = async () => {
	const { expenses, produced, packinuse, daysspent } = await fetchDataCards()
	return (
		<>
			<StatCard title="Expenses" value={expenses.total} type="expenses" subvalue={expenses.day} />
			<StatCard title="Produced" value={produced.total} type="produced" subvalue={produced.day} />
			<StatCard title="Pack In Use" value={packinuse.total} type="packinuse" subvalue={packinuse.day} />
			<StatCard title="Days Spent" value={daysspent.days} type="daysspent" subvalue={daysspent.spell} />
		</>
	)
}

const StatCard = ({ title, value, type, subvalue = null }) => {
	const Icon = iconMap[type]
	return (
		<>
			<Card>
				<CardHeader className="pb-2 flex flex-row space-y-0 space-x-3">
					{Icon ? <Icon className="h-5 w-5" /> : null}
					<h3 className="ml-2 text-sm font-medium">{title}</h3>
				</CardHeader>
				<CardContent>
					<p className="truncate rounded-xl p-2 text-2xl">{value}</p>
					{subvalue && <SubValue value={subvalue} />}
				</CardContent>
			</Card>
		</>
	)
}

const SubValue = ({ value }) => {
	if (Array.isArray(value)) {
		return (
			<>
				{value.map((e, i) => (
					<p key={i} className="text-xs text-muted-foreground">
						{e}
					</p>
				))}
			</>
		)
	}
	return (
		<>
			<p className="text-xs text-muted-foreground">{value}</p>
		</>
	)
}

export default StatCardsWrapper
