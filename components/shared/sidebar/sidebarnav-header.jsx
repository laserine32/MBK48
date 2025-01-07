import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image"
import AppLogo from "../app-logo"

const SidebarNavHeader = () => {
	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild={true}
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<AppLogo className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" />
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</>
	)
}

export default SidebarNavHeader
