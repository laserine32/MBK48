"use client"
import { usePathname } from "next/navigation"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarRail,
	useSidebar,
} from "../../ui/sidebar"
import SidebarNavHeader from "./sidebarnav-header"
import SidebarNavLinks from "./sidebarnav-links"
import SidebarNavTheme from "./sidebarnav-theme"
import { useEffect } from "react"

const AppSidebar = ({ ...props }) => {
	const { setOpenMobile } = useSidebar()
	const pathname = usePathname()

	useEffect(() => {
		setOpenMobile(false)
	}, [pathname, setOpenMobile])

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
