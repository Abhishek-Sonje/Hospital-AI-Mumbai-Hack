"use client";

import { useRequireAuth } from '@/contexts/auth-context';
import { HospitalSidebar } from '@/components/hospital/hospital-sidebar';

export default function HospitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect this route - only hospital role can access
  const { loading } = useRequireAuth('hospital');

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
      <HospitalSidebar />
      <main className="flex-1 ml-64 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
