"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Startup } from "@/types";
import { ArrowRight, Briefcase, Building2, Loader2 } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";

export default function StartupSelectionPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStartups() {
      try {
        const response = await fetch('/api/startupFind');
        if (!response.ok) throw new Error('Failed to fetch startups');
        const data = await response.json();
        setStartups(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchStartups();
  }, []);

  const handleStartupSelect = (startupId: string) => {
    router.push(`/analysis/${startupId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 mt-10 xl:mt-16 md:mt-12 sm:mt-16">
      <DashboardHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
              Select a Startup for Analysis
            </h1>
            <p className="text-slate-400">
              Choose a startup to view detailed AI-powered analysis and insights
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {startups.map((startup) => (
              <Card 
                key={startup.id} 
                className="group backdrop-blur-xl bg-slate-900/50 border-slate-800 hover:border-primary/50 
                         transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-slate-200">
                    {startup.name}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 text-slate-400">
                    <Building2 className="h-4 w-4" />
                    <span>{startup.industry}</span>
                  </CardDescription>
                  <CardDescription className="flex items-center space-x-2 text-slate-400">
                    <Briefcase className="h-4 w-4" />
                    <span>{startup.sector}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleStartupSelect(startup.id)} 
                    className="w-full bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple/80 
                             hover:to-purple-400/80 text-white group-hover:shadow-md transition-all
                             duration-300"
                  >
                    <span>Analyze Startup</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {startups.length === 0 && (
            <Card className="backdrop-blur-xl bg-slate-900/50 border-slate-800 p-8 text-center">
              <CardContent>
                <p className="text-slate-400">No startups found. Add a startup to begin analysis.</p>
                <Button 
                  onClick={() => router.push('/startup/new')}
                  className="mt-4 bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple/80 
                           hover:to-purple-400/80 text-white"
                >
                  Add Startup
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}