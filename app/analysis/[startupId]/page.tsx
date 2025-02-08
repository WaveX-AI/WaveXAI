"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, CheckSquare, Square } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StartupAnalysis {
  strengths: string[];
  recommendations: string[];
  marketAnalysis: string;
}

interface MonthlyChallenge {
  month: string;
  challenge: string;
  completed: boolean;
}

export default function StartupAnalysisPage() {
  const [analysis, setAnalysis] = useState<StartupAnalysis | null>(null);
  const [challenges, setChallenges] = useState<MonthlyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { startupId } = useParams();

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const [analysisResponse, challengesResponse] = await Promise.all([
        fetch(`/api/analysis/${startupId}`),
        fetch(`/api/analysis/trend/${startupId}`)
      ]);
      const analysisData = await analysisResponse.json();
      const challengesData = await challengesResponse.json();
      setAnalysis(analysisData);
      setChallenges(challengesData.map((c: MonthlyChallenge) => ({...c, completed: false})));
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChallengeCompletion = (index: number) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index].completed = !updatedChallenges[index].completed;
    setChallenges(updatedChallenges);
  };

  const downloadReport = () => {
    if (!analysis) return;

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: "Startup Analysis Report",
            heading: HeadingLevel.TITLE
          }),
          
          new Paragraph({
            text: "Strengths",
            heading: HeadingLevel.HEADING_1
          }),
          ...analysis.strengths.map(strength => 
            new Paragraph({
              children: [
                new TextRun(`• ${strength}`),
              ],
              bullet: {
                level: 0
              }
            })
          ),

          new Paragraph({
            text: "Key Recommendations",
            heading: HeadingLevel.HEADING_1
          }),
          ...analysis.recommendations.map(recommendation => 
            new Paragraph({
              children: [
                new TextRun(`• ${recommendation}`),
              ],
              bullet: {
                level: 0
              }
            })
          ),

          new Paragraph({
            text: "Market Analysis",
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph(analysis.marketAnalysis)
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'startup_analysis_report.docx';
      link.click();
      URL.revokeObjectURL(url);
    });
  };
  
  useEffect(() => {
    fetchAnalysis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startupId]);

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Startup Analysis</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              {analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Startup Insights</CardTitle>
                    <Button 
                      onClick={downloadReport} 
                      className="absolute top-4 right-4"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Report
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <section className="mb-4">
                      <h2 className="text-xl font-semibold mb-2">Strengths</h2>
                      <ul className="list-disc pl-5">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </section>
                    <section className="mb-4">
                      <h2 className="text-xl font-semibold mb-2">Key Recommendations</h2>
                      <ul className="list-disc pl-5">
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index}>{recommendation}</li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h2 className="text-xl font-semibold mb-2">Market Analysis</h2>
                      <p>{analysis.marketAnalysis}</p>
                    </section>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="challenges" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Challenges</CardTitle>
                  <CardDescription>
                    Track and manage your startup&apos;s key challenges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {challenges.map((challenge, index) => (
                      <div 
                        key={challenge.month} 
                        className="flex justify-between items-center border-b py-2 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => toggleChallengeCompletion(index)}
                          >
                            {challenge.completed ? (
                              <CheckSquare className="text-green-500" />
                            ) : (
                              <Square className="text-gray-400" />
                            )}
                          </button>
                          <span className={`font-medium ${challenge.completed ? 'line-through text-gray-500' : ''}`}>
                            {challenge.month}: {challenge.challenge}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        <Button onClick={fetchAnalysis} className="mt-6 w-full">
          Refresh Analysis
        </Button>
      </div>
    </>
  );
}