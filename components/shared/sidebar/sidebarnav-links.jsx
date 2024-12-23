import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"

import { Beer, Gauge, Package, PackageOpen, PackagePlus, ShoppingCart } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
	{ name: "Dashboard", href: "/", icon: Gauge },
	{ name: "Items", href: "/item", icon: Beer },
	{ name: "Purchase", href: "/purchase", icon: ShoppingCart },
	{ name: "Pack", href: "/pack", icon: Package },
	{ name: "Pack In Ise", href: "/pack/inuse", icon: PackageOpen },
	{ name: "Production", href: "/pack/production", icon: PackagePlus },
]

const SidebarNavLinks = () => {
	const pathname = `/${usePathname().split("/")[1]}`
	return (
		<>
			<SidebarMenu>
				{links.map((link) => (
					<SidebarMenuItem key={link.name}>
						<SidebarMenuButton asChild>
							<Link href={link.href} className={cn(link.href === pathname ? "text-black font-bold" : "")}>
								<link.icon />
								<span>{link.name}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</>
	)
}

export default SidebarNavLinks
