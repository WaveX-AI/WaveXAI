"use client";

import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import DashboardHeader from '../../components/DashboardHeader';
import { Badge } from '../../components/ui/badge';

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
      router.push('/sign-in');
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
        <div className="container mx-auto p-8">
          <div className="text-center py-8">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Startups</h1>
            <p className="text-muted-foreground">Welcome back, {user?.firstName}</p>
          </div>
          <Link href="/Form">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit a Startup
            </Button>
          </Link>
        </div>

        {error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : startups.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven&apos;t submitted any startups yet.</p>
              <Link href="/Form">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Submit Your First Startup
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {startups.map((startup) => (
              <Card key={startup.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{startup.name}</CardTitle>
                    <Badge variant="secondary">
                      {startup.matches.length} Matches
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-gray-500">
                    {startup.industry} • {startup.sector} • {startup.stage}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">{startup.description}</p>
                  <p className="text-sm mt-2">Required Capital: ${startup.capital.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted on: {new Date(startup.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Link href={`/startup/${startup.id}`} className="w-full">
                    <Button className="w-full">
                      View Matches
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default DashboardPage;