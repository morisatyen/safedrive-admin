import { ReactNode } from "react";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          {/* Sticky Header & Breadcrumb Container */}
          <div className="sticky top-0 bg-background border-b flex-shrink-0">
            <Header />
            <div className="px-6 pt-4 pb-2">
              <Breadcrumb />
            </div>
          </div>

          {/* Scrollable Main Content */}
          <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
