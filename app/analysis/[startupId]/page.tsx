"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Download,
  CheckSquare,
  Square,
  TrendingUp,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface StartupAnalysis {
  strengths: string[];
  recommendations: string[];
  marketAnalysis: string;
  score: number;
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
        fetch(`/api/analysis/trend/${startupId}`),
      ]);
      const analysisData = await analysisResponse.json();
      const challengesData = await challengesResponse.json();
      setAnalysis(analysisData);
      setChallenges(
        challengesData.map((c: MonthlyChallenge) => ({
          ...c,
          completed: false,
        }))
      );
      toast.success("Analysis data refreshed successfully");
    } catch (error) {
      console.error("Error fetching analysis:", error);
      toast.error("Failed to fetch analysis data");
    } finally {
      setLoading(false);
    }
  };


  const toggleChallengeCompletion = (index: number) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index].completed = !updatedChallenges[index].completed;
    setChallenges(updatedChallenges);
    toast.success(
      `Challenge ${
        updatedChallenges[index].completed ? "completed" : "uncompleted"
      }`
    );
  };

  const downloadReport = () => {
    if (!analysis) return;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Startup Analysis Report",
              heading: HeadingLevel.TITLE,
            }),

            new Paragraph({
              text: "Strengths",
              heading: HeadingLevel.HEADING_1,
            }),
            ...analysis.strengths.map(
              (strength) =>
                new Paragraph({
                  children: [new TextRun(`• ${strength}`)],
                  bullet: {
                    level: 0,
                  },
                })
            ),

            new Paragraph({
              text: "Key Recommendations",
              heading: HeadingLevel.HEADING_1,
            }),
            ...analysis.recommendations.map(
              (recommendation) =>
                new Paragraph({
                  children: [new TextRun(`• ${recommendation}`)],
                  bullet: {
                    level: 0,
                  },
                })
            ),

            new Paragraph({
              text: "Market Analysis",
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph(analysis.marketAnalysis),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "startup_analysis_report.docx";
      link.click();
      URL.revokeObjectURL(url);
    });
    toast.success("Report downloaded successfully");
  };

useEffect(() => {
  fetchAnalysis();
// No dependencies needed since we want it to run only once
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  return (
    <>
      <DashboardHeader />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Startup Analysis
        </motion.h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      <CardTitle className="text-2xl flex items-center">
                        <TrendingUp className="mr-2" /> Startup Insights
                      </CardTitle>
                      <Button
                        onClick={downloadReport}
                        variant="secondary"
                        className="mt-4 w-full sm:w-auto"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download Report
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">
                          Startup Score
                        </h3>
                        <div className="flex items-center">
                          <Progress
                            value={analysis.score}
                            className="w-full h-4 mr-4"
                          />
                          <span className="text-2xl font-bold text-purple-600">
                            {analysis.score}%
                          </span>
                        </div>
                      </div>
                      <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-3 flex items-center text-yellow-600">
                          <Zap className="mr-2" /> Strengths
                        </h2>
                        <ul className="space-y-2">
                          {analysis.strengths.map((strength, index) => (
                            <motion.li
                              key={index}
                              className="flex items-start"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <ArrowRight className="mr-2 h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                              <span>{strength}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </section>
                      <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-3 flex items-center text-blue-600">
                          <Target className="mr-2" /> Key Recommendations
                        </h2>
                        <ul className="space-y-2">
                          {analysis.recommendations.map(
                            (recommendation, index) => (
                              <motion.li
                                key={index}
                                className="flex items-start"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.1,
                                }}
                              >
                                <ArrowRight className="mr-2 h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                                <span>{recommendation}</span>
                              </motion.li>
                            )
                          )}
                        </ul>
                      </section>
                      <section>
                        <h2 className="text-xl font-semibold mb-3 text-green-500">
                          Market Analysis
                        </h2>
                        <p className="text-white leading-relaxed">
                          {analysis.marketAnalysis}
                        </p>
                      </section>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
            <TabsContent value="challenges" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <CardTitle className="text-2xl">
                      Monthly Challenges
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      Track and manage your startup&apos;s key challenges
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {challenges.map((challenge, index) => (
                        <motion.div
                          key={challenge.month}
                          className="flex items-center justify-between p-4 bg-zinc-600 rounded-lg shadow"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleChallengeCompletion(index)}
                              className="focus:outline-none"
                            >
                              {challenge.completed ? (
                                <CheckSquare className="text-green-500 h-6 w-6" />
                              ) : (
                                <Square className="text-gray-400 h-6 w-6" />
                              )}
                            </button>
                            <div>
                              <span
                                className={`font-medium text-lg ${
                                  challenge.completed
                                    ? "line-through text-white-500"
                                    : "text-white"
                                }`}
                              >
                                {challenge.challenge}
                              </span>
                              <p className="text-sm text-green-600">
                                {challenge.month}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
              onClick={fetchAnalysis}
              className="mt-8 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!loading && <Loader2 className="mr-2 h-4 w-4 hidden" />}
              Refresh Analysis
        </Button>
        </motion.div>
      </main>
    </>
  );
}
