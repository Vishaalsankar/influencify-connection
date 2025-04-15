
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Home,
  MessageSquare,
  Search,
  ShoppingBag,
  User,
  Users,
  Shield,
  Settings,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon: Icon, label, href, active }: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar({ isOpen }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role || null;

  // Define navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      {
        icon: Home,
        label: "Home",
        href: "/",
      },
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: MessageSquare,
        label: "Messages",
        href: "/messages",
      },
    ];

    const roleSpecificItems = {
      admin: [
        {
          icon: Users,
          label: "Users",
          href: "/users",
        },
        {
          icon: Shield,
          label: "Fraud Detection",
          href: "/fraud-detection",
        },
      ],
      brand: [
        {
          icon: Search,
          label: "Find Influencers",
          href: "/find-influencers",
        },
        {
          icon: ShoppingBag,
          label: "Campaigns",
          href: "/campaigns",
        },
        {
          icon: BarChart3,
          label: "Analytics",
          href: "/analytics",
        },
      ],
      influencer: [
        {
          icon: ShoppingBag,
          label: "Campaigns",
          href: "/campaigns",
        },
        {
          icon: User,
          label: "My Profile",
          href: "/profile",
        },
        {
          icon: BarChart3,
          label: "Earnings",
          href: "/earnings",
        },
      ],
    };

    return [
      ...commonItems,
      ...(role ? roleSpecificItems[role] || [] : []),
      {
        icon: Settings,
        label: "Settings",
        href: "/settings",
      },
    ];
  };

  const navItems = getNavItems();

  if (!user) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col space-y-6 p-4">
        <div className="flex h-14 items-center px-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-brand-600 p-1">
              <div className="h-6 w-6 rounded-full bg-white text-brand-600 flex items-center justify-center font-bold">
                P
              </div>
            </div>
            <span className="text-xl font-bold">PromoPULSE</span>
          </Link>
        </div>

        {role === "brand" && (
          <Button className="w-full flex gap-2 justify-center" asChild>
            <Link to="/campaigns/new">
              <Plus className="h-4 w-4" />
              New Campaign
            </Link>
          </Button>
        )}

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}
