"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import SidebarNavHeader from "./sidebarnav-header";
import SidebarNavLinks from "./sidebarnav-links";
import SidebarNavTheme from "./sidebarnav-theme";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

const AppSidebar: React.FC<AppSidebarProps> = (props) => {
  const { setOpenMobile } = useSidebar();
  const pathname: string | null = usePathname();
  useEffect((): void => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);
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
  );
};

export default AppSidebar;
