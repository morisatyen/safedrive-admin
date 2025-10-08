import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const pathNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Manage Users",
  police: "Police Users",
  emt: "EMT Users",
  fire: "Fire Users",
  wrecker: "Wrecker Users",
  insurance: "Insurance Users",
  app: "App Users",
  reports: "Accident Reports",
  templates: "Email Templates",
  profile: "My Profile",
};

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments
    .filter((segment, idx) => {
      // Hide numeric segments (likely IDs) except for the first segment
      return isNaN(Number(segment));
    })
    .map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const name = pathNameMap[segment] || segment;
      return { name, path };
    });

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {crumb.name === "Manage Users" ? (
            <span className="font-medium text-muted-foreground cursor-not-allowed">
              {crumb.name}
            </span>
          ) : index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.name}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-foreground transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
