"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Bed, 
  Bell, 
  Ambulance,
  LogOut,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

const navigation = [
  { name: 'Dashboard', href: '/hospital', icon: LayoutDashboard },
  { name: 'Inventory', href: '/hospital/inventory', icon: Package },
  { name: 'Beds & Wards', href: '/hospital/beds', icon: Bed },
  { name: 'Alerts', href: '/hospital/alerts', icon: Bell },
  { name: 'Ambulance Tracking', href: '/hospital/ambulance', icon: Ambulance },
];

export function HospitalSidebar() {
  const pathname = usePathname();
  const { signOut, appUser } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Hospital AI</h1>
          <p className="text-xs text-muted-foreground">Hospital Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info and actions */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium">{appUser?.displayName || 'Hospital Staff'}</p>
            <p className="text-xs text-muted-foreground capitalize">{appUser?.role} Role</p>
          </div>
          <ModeToggle />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
