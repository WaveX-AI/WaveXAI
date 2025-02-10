'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { stringify } from 'csv-stringify/sync';
import { ArrowLeft, Download, ExternalLink} from 'lucide-react';
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

  

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
          <div className="container mx-auto p-8 mt-16">
            <div className="relative backdrop-blur-xl bg-slate-900/50 rounded-2xl p-8 shadow-lg">
              <div className="space-y-4">
                <Progress value={30} className="w-full" />
                <p className="text-center text-slate-400">Loading analysis...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !analysisData) {
    return (
      <>
        <DashboardHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
          <div className="container mx-auto p-8">
            <Card className="backdrop-blur-xl bg-red-900/20 border-red-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-400">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{error || 'Failed to load startup data'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const { startup, analysis } = analysisData;

  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 mt-10 xl:mt-16 md:mt-12 sm:mt-16">
        <div className="container mx-auto p-8 space-y-8 pt-16">
          <Link href="/dashboard">
            <Button variant="outline" className="bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800/50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <Card className="backdrop-blur-xl bg-slate-900/50 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {startup.name}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {startup.industry} | {startup.sector} | {startup.stage}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-slate-300 font-semibold">Description</h3>
                  <p className="text-slate-400">{startup.description}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-slate-300 font-semibold">Capital Required</h3>
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    ${startup.capital.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-slate-900/50 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Matched Investors</CardTitle>
              <CardDescription className="text-slate-400">
                Found {analysis.investors.length} potential investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-wrap gap-4">
                <Button 
                  onClick={downloadCSV}
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-400 transition-transform group-hover:translate-x-full" />
                  <span className="relative flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download Investor List (CSV)
                  </span>
                </Button>
                <EmailComposer 
                  startupId={startup.id} 
                  startupData={startup}
                />
              </div>
              {analysis.investors.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 bg-slate-900/50">
                        <TableHead className="text-slate-300">Investor</TableHead>
                        <TableHead className="text-slate-300">Match Score</TableHead>
                        <TableHead className="text-slate-300">Investment Range</TableHead>
                        <TableHead className="text-slate-300">Location</TableHead>
                        <TableHead className="text-slate-300">Sectors</TableHead>
                        <TableHead className="text-slate-300">Notable Portfolio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.investors.map((investor, index) => (
                        <TableRow 
                          key={index}
                          className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <div className="text-white">{investor.name}</div>
                            <div className="text-sm text-slate-400 flex items-center gap-1">
                              <a 
                                href={investor.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-primary flex items-center gap-1"
                              >
                                Website
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                              {investor.fitScore}%
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            ${investor.investmentCriteria.minInvestment.toLocaleString()}+
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {investor.contactInfo.location}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="flex flex-wrap gap-1">
                              {investor.investmentCriteria.sectors.map((sector, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300"
                                >
                                  {sector}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {investor.notablePortfolio.split(',').map((company, idx) => (
                              <div key={idx} className="text-sm">{company.trim()}</div>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-slate-400">No matched investors found.</p>
              )}
            </CardContent>
          </Card>

          <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogContent className="bg-slate-900 border border-slate-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Download Error</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Failed to download the investor list. Please try again later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction 
                  onClick={() => setShowDialog(false)}
                  className="bg-primary hover:bg-primary/90"
                >
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}