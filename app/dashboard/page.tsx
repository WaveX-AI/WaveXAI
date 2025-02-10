"use client";

import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, ArrowRight, AlertCircle, Calendar, Activity, Users, Rocket } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import DashboardHeader from '../../components/DashboardHeader';
import { Badge } from '../../components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Startup {
  id: string;
  name: string;
  description: string;
  industry: string;
  sector: string;
  stage: string;
  capital: number;
  createdAt: string | Date;
  matches: { id: string }[];
}

function DashboardPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded } = useAuth();
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoaded && !user) {
      router.push('/');
      return;
    }

    if (userLoaded && user) {
      const fetchStartups = async () => {
        try {
          const response = await fetch('/api/user/startups');
          
          if (!response.ok) {
            throw new Error('Failed to fetch startups');
          }
          
          const data = await response.json();
          console.log("Fetched startups data:", data); // Debug log
          
          if (Array.isArray(data)) {
            setStartups(data);
          } else {
            console.error("Unexpected data format:", data);
            setError("Received invalid data format");
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setError(err instanceof Error ? err.message : 'An error occurred while fetching startups');
        } finally {
          setLoading(false);
        }
      };

      fetchStartups();
    }
  }, [userLoaded, authLoaded, user, router]);

  if (!userLoaded || !authLoaded || loading) {
    return (
      <>
        <DashboardHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
          <div className="container mx-auto px-4 py-16">
            <div className="relative backdrop-blur-xl bg-slate-900/50 rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-full max-w-md">
                  <Progress value={60} className="h-2" />
                </div>
                <p className="text-slate-400 animate-pulse">Loading your startup journey...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-8 pb-16 mt-10 xl:mt-16 md:mt-12 sm:mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="backdrop-blur-xl bg-slate-900/50 border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Startups</p>
                    <h3 className="text-2xl font-bold mt-1 text-white">{startups.length}</h3>
                  </div>
                  <div className="rounded-full bg-primary/20 p-3">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-slate-900/50 border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Matches</p>
                    <h3 className="text-2xl font-bold mt-1 text-white">
                      {startups.reduce((sum, startup) => sum + startup.matches.length, 0)}
                    </h3>
                  </div>
                  <div className="rounded-full bg-green-950 p-3">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-slate-900/50 border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Latest Activity</p>
                    <h3 className="text-2xl font-bold mt-1 text-white">
                      {startups.length > 0 
                        ? new Date(startups[0].createdAt).toLocaleDateString() 
                        : 'No activity'}
                    </h3>
                  </div>
                  <div className="rounded-full bg-blue-950 p-3">
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Header Section */}
          <div className="relative backdrop-blur-xl bg-slate-900/50 rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Your Startups
                </h1>
                <p className="text-slate-400">
                  Welcome back, {user?.firstName} 👋
                </p>
              </div>
              <Link href="/Form" className="shrink-0">
                <Button 
                  className="w-full sm:w-auto relative group overflow-hidden"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-400 transition-transform group-hover:translate-x-full" />
                  <span className="relative flex items-center">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Submit a Startup
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="relative backdrop-blur-xl bg-red-950/50 rounded-2xl p-6 mb-8 shadow-lg border border-red-800">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-900 p-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!error && startups.length === 0 && (
            <div className="relative backdrop-blur-xl bg-slate-900/50 rounded-2xl p-16 shadow-lg border border-dashed border-slate-700">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-gradient-to-r from-primary/20 to-purple-400/20 p-6 mb-6">
                  <PlusCircle className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Start Your Journey
                </h3>
                <p className="text-slate-400 mb-8 max-w-sm">
                  Submit your first startup to get matched with potential investors and begin your entrepreneurial journey.
                </p>
                <Link href="/Form">
                  <Button 
                    size="lg"
                    className="relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-400 transition-transform group-hover:translate-x-full" />
                    <span className="relative flex items-center">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Submit Your First Startup
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Startups Grid */}
          {!error && startups.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {startups.map((startup) => (
                <Card 
                  key={startup.id} 
                  className="relative backdrop-blur-xl bg-slate-900/50 border-none shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-xl font-bold line-clamp-1 text-white">
                        {startup.name}
                      </CardTitle>
                      <Badge 
                        variant="secondary"
                        className="bg-gradient-to-r from-primary/20 to-purple-400/20 text-primary shadow-sm"
                      >
                        {startup.matches.length} Matches
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-700">
                          {startup.industry}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-700">
                          {startup.sector}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-700">
                          {startup.stage}
                        </Badge>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                      {startup.description}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary"
                          className="font-medium bg-gradient-to-r from-green-950 to-blue-950 text-slate-300"
                        >
                          ${startup.capital.toLocaleString()}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          capital required
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Submitted on: {new Date(startup.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Link 
                      href={`/dashboard/startup/${startup.id}`}
                      className="w-full"
                    >
                      <Button 
                        className="w-full relative group overflow-hidden"
                        variant="secondary"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-400/20 transition-transform group-hover:translate-x-full" />
                        <span className="relative flex items-center justify-center">
                          View Matches
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default DashboardPage;