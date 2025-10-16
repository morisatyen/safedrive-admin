import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  Shield,
  Ambulance,
  Flame,
  Truck,
  FileCheck,
  Smartphone,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import "./sidebar-styles.css";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const [expandedMenu, setExpandedMenu] = useState<string | null>("users");

  useEffect(() => {
    if (state === "expanded") {
      setExpandedMenu("users");
    }
  }, [state]);

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (paths: string[]) =>
    paths.some((path) => location.pathname.includes(path));

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const userTypes = [
    { key: "police", label: "Police Users", icon: Shield },
    { key: "emt", label: "EMT Users", icon: Ambulance },
    { key: "fire", label: "Fire Users", icon: Flame },
    { key: "wrecker", label: "Wrecker Users", icon: Truck },
    { key: "insurance", label: "Insurance Users", icon: FileCheck },
    { key: "driver", label: "App Users", icon: Smartphone },
  ];

  return (
    <Sidebar collapsible="icon">
      {/* Header with optimized logo-text spacing */}
      <SidebarHeader className={`border-b border-sidebar-border transition-all duration-200 ${state === "collapsed" ? "px-0 py-2" : "px-4 py-2"}`}>
        <div className={`flex items-center cursor-pointer transition-all duration-200 ${state === "collapsed" ? "justify-center w-full" : "justify-start"}`} onClick={() => navigate("/dashboard")}>
          <img 
            src="/Logo.png" 
            alt="SafeDrive Logo" 
            className={`object-contain shrink-0 transition-all duration-200 ${state === "collapsed" ? "h-10 w-10" : "h-10 w-10"}`}
          />
          {state === "expanded" && (
            <div className="flex items-center gap-1 ml-1 transition-opacity duration-200">
              <span className="text-lg font-bold" style={{ color: '#E53935' }}>SAFE</span>
              <span className="text-lg font-bold" style={{ color: '#e9e0e0ff' }}>DRIVE</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className={`transition-all duration-200 ${state === "collapsed" ? "py-2" : "py-4"}`}>
          <SidebarMenu className={`transition-all duration-200 ${state === "collapsed" ? "px-0 space-y-1 align-center" : "px-2 space-y-1"}`}>
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/dashboard")}
                isActive={isActive("/dashboard")}
                tooltip="Dashboard"
                className="hover:bg-[#FF8A80] data-[active=true]:bg-[#E53935] data-[active=true]:text-white transition-all duration-200"
              >
                <LayoutDashboard className="h-5 w-5 shrink-0" />
                <span className="truncate">Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Manage Users - Collapsible */}
            <Collapsible open={expandedMenu === "users"} onOpenChange={() => toggleMenu("users")}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={isParentActive(["users"])}
                    tooltip="Manage Users"
                    className="hover:bg-[#FF8A80] data-[active=true]:bg-[#E53935] data-[active=true]:text-white transition-all duration-200"
                  >
                    <Users className="h-5 w-5 shrink-0" />
                    <span className="truncate">Manage Users</span>
                    {/* Chevron toggle: Right when closed, Down when opened */}
                    {state === "expanded" && (
                      expandedMenu === "users" ? (
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200" />
                      )
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="transition-all duration-200 ease-in-out">
                  <SidebarMenu className={`${state === "collapsed" ? "px-0 mt-1 space-y-1" : "ml-4 mt-1 pr-4 space-y-1"}`}>
                    {userTypes.map((type) => (
                      <SidebarMenuItem key={type.key}>
                        <SidebarMenuButton
                          onClick={() => navigate(`/users/${type.key}`)}
                          isActive={isActive(`/users/${type.key}`)}
                          size="sm"
                          tooltip={type.label}
                          className="hover:bg-[#FF8A80] data-[active=true]:bg-[#CE2029] data-[active=true]:text-white transition-all duration-200"
                        >
                          <type.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{type.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Reports */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/reports")}
                isActive={isActive("/reports") || location.pathname.startsWith("/reports/")}
                tooltip="Accident Reports"
                className="hover:bg-[#FF8A80] data-[active=true]:bg-[#E53935] data-[active=true]:text-white transition-all duration-200"
              >
                <FileText className="h-5 w-5 shrink-0" />
                <span className="truncate">Accident Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Email Templates */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/templates")}
                isActive={isActive("/templates") || location.pathname.startsWith("/templates/")}
                tooltip="Email Templates"
                className="hover:bg-[#FF8A80] data-[active=true]:bg-[#E53935] data-[active=true]:text-white transition-all duration-200"
              >
                <Mail className="h-5 w-5 shrink-0" />
                <span className="truncate">Email Templates</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Profile */}
            {/* <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/profile")}
                isActive={isActive("/profile")}
                tooltip="My Profile"
              >
                <UserIcon className="h-5 w-5" />
                <span>My Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
