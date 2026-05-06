"use client";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  BeerSteinIcon,
  CardholderIcon,
  CodesandboxLogoIcon,
  GaugeIcon,
  PackageIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type IconComponent = React.ComponentType<{ className?: string; size?: number | string; color?: string }>;

const links: Array<{
  name: string;
  href: string;
  icon: IconComponent;
}> = [
  { name: "Dashboard", href: "/", icon: GaugeIcon },
  { name: "Items", href: "/item", icon: BeerSteinIcon },
  { name: "Purchase", href: "/purchase", icon: ShoppingCartIcon },
  { name: "Pack", href: "/pack", icon: PackageIcon },
  { name: "Pack In Use", href: "/inuse", icon: CardholderIcon },
  { name: "Production", href: "/production", icon: CodesandboxLogoIcon },
];

const SidebarNavLinks = () => {
  const pathname: string = `/${usePathname().split("/")[1]}`;

  return (
    <>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.name}>
            <SidebarMenuButton asChild>
              <Link href={`${link.href}`} className={cn(link.href === pathname ? "font-bold" : "", "linking")}>
                <link.icon />
                <span>{link.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
};

export default SidebarNavLinks;
