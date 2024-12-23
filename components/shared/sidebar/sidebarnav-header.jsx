import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image"

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
							<Image src="/icon.png" width={32} height={32} alt={`MBK48 logo`} priority />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">MBK48</span>
							<span className="truncate text-xs">Crafted Origin</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</>
	)
}

export default SidebarNavHeader
