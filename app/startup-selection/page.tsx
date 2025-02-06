"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Startup } from "@/types";
import { Loader2 } from "lucide-react";
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
    <>
      <DashboardHeader />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Select a Startup for Analysis</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {startups.map((startup) => (
            <Card key={startup.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{startup.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {startup.industry} | {startup.sector}
                </p>
                <Button 
                  onClick={() => handleStartupSelect(startup.id)} 
                  className="mt-4 w-full"
                >
                  Analyze Startup
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}