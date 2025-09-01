"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from '@/components/theme-toggle';

// Import our feature components
import { BrandBriefForm } from '@/components/dashboard/brand-brief-form';
import { MatchConsole } from '@/components/dashboard/match-console';
import { BillingFlow } from '@/components/dashboard/billing-flow';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login'); // Redirect to login if not authenticated
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirect to homepage after logout
  };

  if (!user) {
    // You can add a nice loading spinner here
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <h1 className="text-2xl font-bold">
          Taag<span className="text-blue-500">.</span>
        </h1>
        <div className="relative ml-auto flex-1 md:grow-0">
          {/* Future search bar can go here */}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline-block">{user.email}</span>
          <ThemeToggle />
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="match">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="brief">Brand Brief</TabsTrigger>
            <TabsTrigger value="match">Match Console</TabsTrigger>
            <TabsTrigger value="billing">Billing & Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="brief">
            <BrandBriefForm />
          </TabsContent>
          <TabsContent value="match">
            <MatchConsole />
          </TabsContent>
          <TabsContent value="billing">
            <BillingFlow />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}