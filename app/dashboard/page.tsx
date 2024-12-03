"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import DashboardHeader from '../../components/DashboardHeader';


function DashboardPage() {
  interface Startup {
    id: string;
    name: string;
    description: string;
    submittedAt: string;
  }

  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartups = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/startups');
        if (!response.ok) {
          throw new Error('Failed to fetch startups');
        }
        const data = await response.json();
        setStartups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching startups');
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Startups</CardTitle>
            <CardDescription>
              View and manage your submitted startups
            </CardDescription>
          </CardHeader>
          <CardContent>
            {startups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven&apos;t submitted any startups yet.</p>
                <Link href="../Form">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Submit a Startup
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {startups.map((startup) => (
                  <Link href={`/startup/${startup.id}`} key={startup.id}>
                    <Card className="hover:bg-muted transition-colors">
                      <CardHeader>
                        <CardTitle>{startup.name}</CardTitle>
                        <CardDescription>{startup.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Submitted on: {new Date(startup.submittedAt).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default DashboardPage;

