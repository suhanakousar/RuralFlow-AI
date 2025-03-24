import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "fa-tachometer-alt" },
  { label: "Energy Management", href: "/energy", icon: "fa-bolt" },
  { label: "Water Supply", href: "/water", icon: "fa-water" },
  { label: "Smart Agriculture", href: "/agriculture", icon: "fa-seedling" },
  { label: "Alerts & Notifications", href: "/alerts", icon: "fa-bell" },
  { label: "Analytics", href: "/analytics", icon: "fa-chart-line" },
  { label: "Settings", href: "/settings", icon: "fa-cog" }
];

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const [location] = useLocation();
  const { isCollapsed, setIsCollapsed: setCollapsed } = useSidebar();
  const toggleSidebar = () => setCollapsed(prev => !prev);
  
  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle with Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleSidebar]);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        const parsedState = JSON.parse(savedState);
        if (parsedState !== isCollapsed) {
          toggleSidebar();
        }
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error);
      // If there's an error, set the default state
      localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    }
  }, []); // Only run on mount
  
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-500 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className={cn("flex items-center space-x-3 transition-all duration-300", isCollapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
            <span className="text-xl font-bold text-white">RF</span>
          </div>
          <h1 className={cn(
            "text-xl font-bold text-white tracking-wide transition-all duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>
            RuralFlow <span className="text-primary">AI</span>
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              "text-gray-400 hover:text-white hover:bg-gray-700/40",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50",
              "group relative"
            )}
            onClick={toggleSidebar}
            title={`${isCollapsed ? "Expand" : "Collapse"} sidebar (Ctrl/Cmd + B)`}
          >
            <i className={cn(
              "fas transition-transform duration-300",
              isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
            )}></i>
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {isCollapsed ? "Expand" : "Collapse"} (Ctrl/Cmd + B)
            </span>
          </button>
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            onClick={onCloseMobile}
            title="Close sidebar"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onCloseMobile();
                }
              }}
            >
              <a
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg group relative",
                  "transition-all duration-200",
                  location === item.href
                    ? "bg-blue-500/10 text-blue-400 border-l-[3px] border-blue-500"
                    : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200",
                  isCollapsed && "justify-center"
                )}
              >
                <i className={cn(
                  "fas transition-all duration-200 text-lg",
                  item.icon,
                  isCollapsed ? "mx-auto" : "mr-3",
                  location === item.href ? "text-blue-400" : "text-gray-400 group-hover:text-gray-200"
                )}></i>
                <span className={cn(
                  "transition-all duration-300 whitespace-nowrap",
                  isCollapsed ? "opacity-0 w-0 absolute left-full ml-2" : "opacity-100 w-auto"
                )}>{item.label}</span>
              </a>
            </Link>
          ))}
        </div>
      </nav>
      
      <div className={cn(
        "absolute bottom-0 w-full p-4 border-t border-gray-800/50 transition-all duration-300",
        isCollapsed && "px-2"
      )}>
        <div className="px-4 py-3 bg-gray-800/40 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
            <div className={cn(
              "text-sm transition-all duration-300",
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}>
              <p className="text-gray-400">System Status</p>
              <p className="font-semibold text-gray-200">Online</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
