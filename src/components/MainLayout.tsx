import { ReactNode } from "react";
import { AppSidebar } from "./Sidebar";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-6">
            <Breadcrumb />
            <div className="mt-4">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
