"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useMounted } from "@/hooks/use-mounted";
import { capitalizeFirstLetter } from "@/lib/utils";
import { CaretUpDownIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

type ThemeName = "light" | "dark" | "system";

const SidebarNavTheme = () => {
  const { theme, setTheme } = useTheme();
  const { isMobile }: { isMobile: boolean } = useSidebar();
  const mounted = useMounted();

  if (!mounted) return null;
  const themeValue: ThemeName = (theme as ThemeName) ?? ("system" satisfies ThemeName);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <SunIcon className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <MoonIcon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{capitalizeFirstLetter(themeValue)}</span>
                  <span className="truncate text-xs">{"Theme"}</span>
                </div>
                <CaretUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">Theme</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <SunIcon className="size-4 shrink-0" />
                </div>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <MoonIcon className="size-4 shrink-0" />
                </div>
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
};

export default SidebarNavTheme;
