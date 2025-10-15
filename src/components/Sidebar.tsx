import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
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
  User as UserIcon,
  ChevronDown,
  ChevronRight,
  Shield,
  Ambulance,
  Flame,
  Truck,
  FileCheck,
  Smartphone,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const [expandedMenu, setExpandedMenu] = useState<string | null>("users");

  // 🧠 When sidebar collapses, close submenu automatically
  useEffect(() => {
    if (state === "collapsed") {
      setExpandedMenu(null);
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
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center">
          <img 
            src="/Logo.png" 
            alt="SafeDrive Logo" 
            className="h-14 w-14 object-contain shrink-0"
          />
          {state === "expanded" && (
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold" style={{ color: '#E53935' }}>SAFE</span>
              <span className="text-lg font-bold" style={{ color: '#e9e0e0ff' }}>DRIVE</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="px-2">
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/dashboard")}
                isActive={isActive("/dashboard")}
                tooltip="Dashboard"
                className="hover:bg-[#FF8A80] data-[active=true]:bg-[#E53935] data-[active=true]:text-white"
              >
                <LayoutDashboard className="h-6 w-6" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Manage Users - Collapsible */}
            <Collapsible open={expandedMenu === "users"} onOpenChange={() => toggleMenu("users")}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={isParentActive(["users"])}
                    tooltip="Manage Users"
                    className="hover:bg-[#FF8A80] data-[active=true]:bg-[#E53935] data-[active=true]:text-white"
                  >
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                    {state === "expanded" && (
                      expandedMenu === "users" ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu className="ml-4 mt-1">
                    {userTypes.map((type) => (
                      <SidebarMenuItem key={type.key}>
                        <SidebarMenuButton
                          onClick={() => navigate(`/users/${type.key}`)}
                          isActive={isActive(`/users/${type.key}`)}
                          size="sm"
                          tooltip={type.label}
                          className="hover:bg-[#FF8A80] data-[active=true]:bg-[#CE2029] data-[active=true]:text-white"
                        >
                          <type.icon className="h-5 w-5" />
                          <span>{type.label}</span>
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
                className="hover:bg-[#FF8A80] data-[active=true]:bg-[#E53935] data-[active=true]:text-white"
              >
                <FileText className="h-6 w-6" />
                <span>Accident Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Email Templates */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/templates")}
                isActive={isActive("/templates") || location.pathname.startsWith("/templates/")}
                tooltip="Email Templates"
                className="hover:bg-[#FF8A80] data-[active=true]:bg-[#E53935] data-[active=true]:text-white"
              >
                <Mail className="h-6 w-6" />
                <span>Email Templates</span>
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
