import { cn } from "@/lib/utils"

export const InputText = ({ title, name, value = "", state }) => {
	const placeholder = `${title}...`
	const errorId = `${name}-error`
	return (
		<>
			<div className="mb-5">
				<label htmlFor={name} className="mb-2 block text-sm font-medium">
					{title}
				</label>
				<div className="relative mt-2 rounded-md">
					<div className="relative">
						<input
							type="text"
							name={name}
							id={name}
							className={cn(
								"peer border text-sm rounded-md block w-full p-2.5 outline-2",
								state?.Errors[name] && "border-red-500"
							)}
							placeholder={placeholder}
							defaultValue={value}
							aria-describedby={errorId}
						/>
					</div>
				</div>
				<div id={errorId} aria-live="polite" aria-atomic="true">
					<p className="mt-2 text-sm text-red-500">{state?.Errors[name]}</p>
				</div>
			</div>
		</>
	)
}

export const InputTextDataList = ({ title, name, value = "", units, state }) => {
	const placeholder = `${title}...`
	const errorId = `${name}-error`
	const listId = `${name}-list`
	return (
		<>
			<div className="mb-5">
				<label htmlFor={name} className="mb-2 block text-sm font-medium">
					{title}
				</label>
				<div className="relative mt-2 rounded-md">
					<div className="relative">
						<input
							type="text"
							name={name}
							id={name}
							className={cn(
								"peer border text-sm rounded-md block w-full p-2.5 outline-2",
								state?.Errors[name] && "border-red-500"
							)}
							placeholder={placeholder}
							defaultValue={value}
							aria-describedby={errorId}
							list={listId}
						/>
						<datalist id={listId}>
							{units.map((unit, i) => (
								<option key={i} value={unit} />
							))}
						</datalist>
					</div>
				</div>
				<div id={errorId} aria-live="polite" aria-atomic="true">
					<p className="mt-2 text-sm text-red-500">{state?.Errors[name]}</p>
				</div>
			</div>
		</>
	)
}

export const InputCurrencyIDR = ({ title, name, value = "", state }) => {
	const placeholder = `${title}...`
	const errorId = `${name}-error`
	return (
		<>
			<div className="mb-5">
				<label htmlFor={name} className="mb-2 block text-sm font-medium">
					{title}
				</label>
				<div className="relative mt-2 rounded-md">
					<div className="relative">
						<input
							type="number"
							name={name}
							id={name}
							step={"1"}
							className={cn(
								"peer border text-sm rounded-md block w-full p-2.5 pl-10 outline-2",
								state?.Errors[name] && "border-red-500"
							)}
							placeholder={placeholder}
							defaultValue={value}
							aria-describedby={errorId}
						/>
						<div className="pointer-events-none absolute left-3 top-1/2 w-[18px] -translate-y-1/2">
							<p>Rp.</p>
						</div>
					</div>
				</div>
				<div id={errorId} aria-live="polite" aria-atomic="true">
					<p className="mt-2 text-sm text-red-500">{state?.Errors[name]}</p>
				</div>
			</div>
		</>
	)
}
