'use client';

import React from 'react';
import { TopNav } from '@/components/layout/top-nav';
import { Footer } from '@/components/layout/footer';
import { FloatingCopilot } from '@/components/layout/floating-copilot';
import { mockDashboardSummary } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { PortfolioProvider } from '@/context/portfolio-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/onboarding');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-bg">
        <TopNav />
        <main className="mt-[104px] min-h-[calc(100vh-104px-52px)] px-6 py-8 max-w-[1600px] mx-auto">
          {children}
        </main>
        <div>
          <Footer lastSyncAt={mockDashboardSummary.lastSyncAt} />
        </div>
        <FloatingCopilot />
      </div>
    </PortfolioProvider>
  );
}
