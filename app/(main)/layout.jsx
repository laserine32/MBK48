import AppSidebar from "@/components/shared/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
const Mainlayout = ({ children }) => {
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="bg-sidebar flex justify-end md:justify-start h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger />
						</div>
					</header>
					<main className="p-4 md:p-8">{children}</main>
				</SidebarInset>
			</SidebarProvider>
		</>
	)
}

export default Mainlayout
