import AppLogo from "@/components/shared/app-logo"
import { FlashMessageProvider } from "@/components/shared/kilat-message-providex"
import AppSidebar from "@/components/shared/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
const Mainlayout = ({ children }) => {
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="border-b-2 flex justify-between md:justify-start h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
						<div className="block md:hidden pl-2">
							<AppLogo />
						</div>
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger />
						</div>
					</header>
					<main className="p-4 md:p-8">{children}</main>
					<FlashMessageProvider />
				</SidebarInset>
			</SidebarProvider>
		</>
	)
}

export default Mainlayout
