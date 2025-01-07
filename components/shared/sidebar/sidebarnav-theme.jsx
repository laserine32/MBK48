import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { capitalizeFirstLetter } from "@/lib/utils"
import { ChevronsUpDown, MonitorCog, Moon, Sun, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const themeItem = [
	{ name: "light", icon: Sun },
	{ name: "dark", icon: Moon },
	{ name: "system", icon: SunMoon },
]

const SidebarNavTheme = () => {
	const { theme, setTheme } = useTheme()
	const { isMobile } = useSidebar()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	const ThemeIcon = () => {
		if (theme == "light") return <Sun className="size-4" />
		if (theme == "dark") return <Moon className="size-4" />
		if (theme == "system") return <MonitorCog className="size-4" />
	}

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
									<ThemeIcon />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{capitalizeFirstLetter(theme)}</span>
									<span className="truncate text-xs">{"Theme"}</span>
								</div>
								<ChevronsUpDown className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							align="start"
							side={isMobile ? "bottom" : "right"}
							sideOffset={4}
						>
							<DropdownMenuLabel className="text-xs text-muted-foreground">Theme</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 p-2">
								<div className="flex size-6 items-center justify-center rounded-sm border">
									<MonitorCog className="size-4 shrink-0" />
								</div>
								System
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 p-2">
								<div className="flex size-6 items-center justify-center rounded-sm border">
									<Sun className="size-4 shrink-0" />
								</div>
								Light
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 p-2">
								<div className="flex size-6 items-center justify-center rounded-sm border">
									<Moon className="size-4 shrink-0" />
								</div>
								Dark
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</>
	)
}

export default SidebarNavTheme
