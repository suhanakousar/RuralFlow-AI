import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}

export default function DashboardLayout({ children, title, actions }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Main Content */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-500 ease-in-out",
        isCollapsed ? "md:ml-16" : "md:ml-64"
      )}>
        <TopBar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          {/* Page Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{title}</h2>
                {actions}
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
} 