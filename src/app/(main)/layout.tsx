import { AppLogo } from "@/components/shared/app-logo";
import ProgressBar from "@/components/shared/progress-bar";
import AppSidebar from "@/components/shared/sidebar/app-sidebar";
import { MyGlobalAppProvider } from "@/components/toast-provider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MyToast } from "@/hooks/mytoast";
import { Suspense } from "react";

const Mainlayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <MyGlobalAppProvider>
        <Suspense>
          <ProgressBar />
        </Suspense>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:justify-start">
                <div className="block pl-2 md:hidden">
                  <AppLogo />
                </div>
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger />
                </div>
              </header>
              <main className="p-4 md:p-8">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
        <MyToast />
        <Toaster />
      </MyGlobalAppProvider>
    </>
  );
};

export default Mainlayout;
