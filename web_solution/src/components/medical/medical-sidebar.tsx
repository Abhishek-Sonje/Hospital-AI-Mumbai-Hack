"use client";

import Link from 'next/link';
import { Activity, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export function MedicalSidebar() {
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
          <p className="text-xs text-muted-foreground">Medical Staff</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <Link
          href="/medical"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-primary text-primary-foreground"
        >
          Medication Stock
        </Link>
      </nav>

      {/* User info and actions */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium">{appUser?.displayName || 'Medical Staff'}</p>
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
