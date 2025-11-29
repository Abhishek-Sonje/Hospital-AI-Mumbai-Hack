"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  Package,
  BedDouble,
  Bell,
  Calendar,
  ClipboardList,
  Settings,
  Shield,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Staff Scheduling",
    href: "/staff-scheduling",
    icon: Users,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Beds & Wards",
    href: "/beds",
    icon: BedDouble,
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: Bell,
    badge: 3, // Mock critical alerts
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Planner",
    href: "/planner",
    icon: ClipboardList,
    badge: 1, // Mock pending plan
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Shield,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block w-64 h-full fixed left-0 top-0 bottom-0 z-30">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">Hospital AI</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1 pt-2">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
              >
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    pathname === item.href && "bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                  {item.badge && (
                    <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}
