import AppSidebar from "@/components/shared/sidebar/app-sidebar"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"

export default function NotFound() {
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
					<main className="p-4 md:p-8">
						<h2 className="text-center text-[10rem] font-black">404</h2>
						<h1 className="text-center text-3xl font-bold">Nothing to see here</h1>
						<p className="text-center my-4">
							Page you are trying to open doesn't exist. You may have mustyped the address, or the page has been moved
							to another URL.
						</p>
						<div className="flex items-center justify-center">
							<Button asChild>
								<Link href={"/"}>Back to Dashborad</Link>
							</Button>
						</div>
					</main>
				</SidebarInset>
			</SidebarProvider>
		</>
	)
}
