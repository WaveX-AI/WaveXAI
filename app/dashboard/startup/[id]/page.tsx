'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { stringify } from 'csv-stringify/sync';
import { ArrowLeft, Mail } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import DashboardHeader from '@/components/DashboardHeader';
import EmailComposer from '@/components/emailComposer/EmailComposer';
import { useToast } from '@/hooks/use-toast';

interface StartupDetails {
  id: string;
  name: string;
  description: string;
  industry: string;
  sector: string;
  stage: string;
  capital: number;
}

interface Investor {
  name: string;
  fitScore: number;
  website: string;
  contactInfo: {
    email: string;
    location: string;
  };
  investmentCriteria: {
    minInvestment: number;
    sectors: string[];
  };
  matchReason: string;
  notablePortfolio: string;
}

interface AnalysisResponse {
  startup: StartupDetails;
  analysis: {
    keyStrengths: string[];
    potentialChallenges: string[];
    investors: Investor[];
  };
}

export default function StartupDetailsPage() {
  const { id } = useParams();
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlingProgress, setCrawlingProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStartupData = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error('Startup ID is required');
        }
        const response = await fetch(`/api/startup/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch startup data');
        }
        const data: AnalysisResponse = await response.json();
        if (!data.startup) {
          throw new Error('No startup data found');
        }
        setAnalysisData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch startup data');
      } finally {
        setLoading(false);
      }
    };

    fetchStartupData();
  }, [id]);

  const downloadCSV = () => {
    if (!analysisData?.analysis.investors) return;

    try {
      const records = analysisData.analysis.investors.map(investor => ({
        'Investor Name': investor.name,
        'Email': investor.contactInfo.email,
        'Location': investor.contactInfo.location,
        'Website': investor.website,
        'Min Investment': `$${investor.investmentCriteria.minInvestment.toLocaleString()}`,
        'Sectors': investor.investmentCriteria.sectors.join(', '),
        'Match Score': `${investor.fitScore}%`,
        'Match Reason': investor.matchReason,
        'Notable Portfolio': investor.notablePortfolio,
      }));

      const csv = stringify(records, {
        header: true,
        columns: Object.keys(records[0])
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `investor_matches_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download CSV');
      setShowDialog(true);
    }
  };

  const startEmailCrawling = async () => {
    try {
      setIsCrawling(true);
      const response = await fetch('/api/crawlemails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startupId: analysisData?.startup.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to crawl emails');
      }

      const data = await response.json();
      setCrawlingProgress(100);

      toast({
        title: "Email Collection Complete",
        description: `Successfully collected ${data.count} email addresses.`,
        duration: 5000,
      });
    } catch (err) {
      console.error('Error collecting emails:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to collect emails. Please try again later.",
        duration: 5000,
      });
    } finally {
      setIsCrawling(false);
      setTimeout(() => setCrawlingProgress(0), 1000);
    }
  };

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <div className="container mx-auto p-8">
          <div className="space-y-4">
            <Progress value={30} className="w-full" />
            <p className="text-center text-muted-foreground">Loading analysis...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !analysisData) {
    return (
      <>
        <DashboardHeader />
        <div className="container mx-auto p-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error || 'Failed to load startup data'}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const { startup, analysis } = analysisData;

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto p-8 space-y-8">
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{startup.name}</CardTitle>
            <CardDescription>
              {startup.industry} | {startup.sector} | {startup.stage}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Description:</strong> {startup.description}
              </div>
              <div>
                <strong>Capital Required:</strong> ${startup.capital.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Key Strengths</h3>
                <ul className="list-disc pl-5">
                  {analysis.keyStrengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Potential Challenges</h3>
                <ul className="list-disc pl-5">
                  {analysis.potentialChallenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matched Investors</CardTitle>
            <CardDescription>
              Found {analysis.investors.length} potential investors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4">
              <Button onClick={downloadCSV}>
                Download Investor List (CSV)
              </Button>
              <Button 
                onClick={startEmailCrawling} 
                disabled={isCrawling}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                {isCrawling ? (
                  <>
                    <span>Collecting Emails... {crawlingProgress}%</span>
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-primary-foreground transition-all duration-300"
                      style={{ width: `${crawlingProgress}%` }}
                    />
                  </>
                ) : (
                  'Collect Investor Emails'
                )}
              </Button>
              <EmailComposer 
                startupId={startup.id} 
                startupData={startup}
              />
            </div>
            {analysis.investors.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investor</TableHead>
                      <TableHead>Match Score</TableHead>
                      <TableHead>Investment Range</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Sectors</TableHead>
                      <TableHead>Notable Portfolio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.investors.map((investor, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div>{investor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            <a href={investor.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              Website
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>{investor.fitScore}%</TableCell>
                        <TableCell>
                          ${investor.investmentCriteria.minInvestment.toLocaleString()}+
                        </TableCell>
                        <TableCell>{investor.contactInfo.location}</TableCell>
                        <TableCell>{investor.investmentCriteria.sectors.join(', ')}</TableCell>
                        <TableCell>
                          {investor.notablePortfolio.split(',').map((company, idx) => (
                            <div key={idx}>{company.trim()}</div>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p>No matched investors found.</p>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Download Error</AlertDialogTitle>
              <AlertDialogDescription>
                Failed to download the investor list. Please try again later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowDialog(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}