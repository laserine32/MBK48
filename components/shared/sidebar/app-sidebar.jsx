"use client"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarRail,
} from "../../ui/sidebar"
import SidebarNavHeader from "./sidebarnav-header"
import SidebarNavLinks from "./sidebarnav-links"
import SidebarNavTheme from "./sidebarnav-theme"

const AppSidebar = ({ ...props }) => {
	return (
		<>
			<Sidebar collapsible="icon" {...props}>
				<SidebarHeader>
					<SidebarNavHeader />
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarNavLinks />
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SidebarNavTheme />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
		</>
	)
}

export default AppSidebar

/* 

*/
