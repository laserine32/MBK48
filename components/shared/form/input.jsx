import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

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

export const InputNumber = ({ title, name, value = "", state }) => {
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
							step={1}
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

export const ComboBoxCustom = ({ title, name, data, state, callBack, value = "" }) => {
	const [open, setOpen] = useState(false)
	const [defaultValue, setDefaultValue] = useState(value)
	const onselect = (currentValue) => {
		setDefaultValue(currentValue == defaultValue ? "" : currentValue)
		setOpen(false)
		callBack(currentValue)
	}
	return (
		<ComboBoxRender
			title={title}
			name={name}
			data={data}
			state={state}
			open={open}
			setOpen={setOpen}
			defaultValue={defaultValue}
			onSelect={onselect}
			value={value}
		/>
	)
}

export const ComboBox = ({ title, name, data, state, value = "" }) => {
	const [open, setOpen] = useState(false)
	const [defaultValue, setDefaultValue] = useState(value)
	const onselect = (currentValue) => {
		setDefaultValue(currentValue == defaultValue ? "" : currentValue)
		setOpen(false)
	}
	return (
		<ComboBoxRender
			title={title}
			name={name}
			data={data}
			state={state}
			open={open}
			setOpen={setOpen}
			defaultValue={defaultValue}
			onSelect={onselect}
			value={value}
		/>
	)
}

export const ComboBoxRender = ({ title, name, data, state, open, setOpen, defaultValue, onSelect, value = "" }) => {
	const placeholder = `${title}...`
	const errorId = `${name}-error`
	return (
		<>
			<div className="mb-5">
				<label className="mb-2 block text-sm font-medium">{title}</label>
				<input type="hidden" id={name} name={name} value={defaultValue} />
				<div className="relative mt-2 rounded-md">
					<div className="relative">
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={open}
									className={cn(
										"border text-sm rounded-md w-full p-2.5 outline-2 justify-between",
										state?.Errors[name] && "border-red-500"
									)}
								>
									{defaultValue ? data.find((d) => d.value === defaultValue)?.label : `Select ${placeholder}`}
									<ChevronsUpDown className="opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-full p-0">
								<Command>
									<CommandInput placeholder={`Search ${placeholder}`} className="h-9" />
									<CommandList>
										<CommandEmpty>{`No ${title} found.`}</CommandEmpty>
										<CommandGroup>
											{data.map((d) => (
												<CommandItem key={d.value} value={d.value} onSelect={onSelect}>
													{d.label}
													<Check className={cn("ml-auto", defaultValue === d.value ? "opacity-100" : "opacity-0")} />
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
				</div>
				<div id={errorId} aria-live="polite" aria-atomic="true">
					<p className="mt-2 text-sm text-red-500">{state?.Errors[name]}</p>
				</div>
			</div>
		</>
	)
}
