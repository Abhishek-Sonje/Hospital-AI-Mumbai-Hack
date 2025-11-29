"use client";

import { useRequireAuth } from '@/contexts/auth-context';
import { UserSidebar } from '@/components/user/user-sidebar';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect this route - only user role can access
  const { loading } = useRequireAuth('user');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <main className="flex-1 ml-64 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
