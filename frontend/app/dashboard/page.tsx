"use client";

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Icons
import { FileText, Users, Wallet, LogOut, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

// UI Components
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/theme-toggle';

// Feature Components
import { BrandBriefForm, BrandBriefFormValues } from '@/components/dashboard/brand-brief-form';
import { MatchConsole } from '@/components/dashboard/match-console';
import { BillingFlow } from '@/components/dashboard/billing-flow';
import type { MatchedCreator } from '@/lib/types';
import Link from 'next/link';


type View = 'brief' | 'match' | 'billing';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('brief');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  // State for matching
  const [matches, setMatches] = useState<MatchedCreator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleBriefSubmit = async (values: BrandBriefFormValues) => {
    setIsLoading(true);
    setError(null);
    setMatches([]);
    setActiveView('match');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: values.category,
          budgetINR: values.budget,
          targetLocations: values.locations,
          targetAges: values.ageRange,
          tone: values.tone,
          platforms: values.platforms,
          constraints: { noAdultContent: true }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `API Error: ${response.statusText}`);
      }

      const data: MatchedCreator[] = await response.json();
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Memoize the content to prevent re-renders when state changes
  const activeContent = useMemo(() => {
    switch (activeView) {
      case 'brief':
        return <BrandBriefForm onFormSubmit={handleBriefSubmit} />;
      case 'match':
        return <MatchConsole matches={matches} isLoading={isLoading} error={error} />;
      case 'billing':
        return <BillingFlow />;
      default:
        return null;
    }
  }, [activeView, matches, isLoading, error]);
  
  const pageDetails = useMemo(() => {
    switch (activeView) {
      case 'brief': return { title: 'Create Brand Brief', description: 'Define your campaign to find the perfect creators.' };
      case 'match': return { title: 'Match Console', description: 'View and filter AI-recommended creators for your brief.' };
      case 'billing': return { title: 'Billing & Payouts', description: 'Manage brand billing and creator payout information.' };
    }
  }, [activeView]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p>Loading session...</p></div>;
  }

  const userInitial = user.email ? user.email[0].toUpperCase() : 'U';

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        {/* --- SIDEBAR --- */}
        <aside className={cn(
          "flex flex-col border-r bg-background transition-all duration-300 ease-in-out z-10",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}>
          <div className="flex h-16 items-center border-b px-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className={cn("text-2xl font-bold", isSidebarCollapsed ? "text-blue-500" : "text-foreground")}>T</span>
              {!isSidebarCollapsed && <span className="font-bold text-xl">Taag<span className="text-blue-500">.</span></span>}
            </Link>
          </div>
          <nav className="flex flex-col gap-2 p-2 flex-grow">
            <SidebarButton icon={FileText} label="Brand Brief" isActive={activeView === 'brief'} onClick={() => setActiveView('brief')} isCollapsed={isSidebarCollapsed}/>
            <SidebarButton icon={Users} label="Match Console" isActive={activeView === 'match'} onClick={() => setActiveView('match')} isCollapsed={isSidebarCollapsed}/>
            <SidebarButton icon={Wallet} label="Billing" isActive={activeView === 'billing'} onClick={() => setActiveView('billing')} isCollapsed={isSidebarCollapsed}/>
          </nav>
          <div className="mt-auto p-2 border-t">
            <SidebarButton icon={LogOut} label="Logout" onClick={handleLogout} isCollapsed={isSidebarCollapsed}/>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex flex-col flex-1">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6 shrink-0">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}>
              {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{pageDetails.title}</h2>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                    <Avatar>
                      <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{pageDetails.title}</CardTitle>
                <CardDescription>{pageDetails.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {activeContent}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface SidebarButtonProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}
// Reusable Sidebar Button Component
function SidebarButton({ icon: Icon, label, isActive, onClick, isCollapsed }: any) {
  const content = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start gap-3 px-3"
      onClick={onClick}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </Button>
  );

  return isCollapsed ? (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  ) : (
    content
  );
}