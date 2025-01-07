import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image"
import { SvgLogo } from "../app-logo"
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants"

const SidebarNavHeader = () => {
	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
							<SvgLogo width={32} height={32} />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{APP_NAME}</span>
							<span className="truncate text-xs">{APP_DESCRIPTION}</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</>
	)
}

export default SidebarNavHeader
