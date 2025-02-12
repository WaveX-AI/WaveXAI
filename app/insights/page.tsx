"use client";

import { useState, useEffect } from "react";
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
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  DollarSign,
  BarChart,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Insight {
  id: string;
  title: string;
  description: string;
  category: string[];
  impact: "positive" | "negative" | "neutral";
  relevanceScore: number;
  trendDirection: "up" | "down" | "stable";
}

const mockInsights: Insight[] = [
  {
    id: "1",
    title: "AI Integration Boosts Efficiency",
    description:
      "Startups integrating AI see a 30% increase in operational efficiency.",
    category: ["Market", "Growth"],
    impact: "positive",
    relevanceScore: 85,
    trendDirection: "up",
  },
  {
    id: "2",
    title: "Venture Capital Slowdown",
    description:
      "VC funding in the tech sector has decreased by 15% in Q2 2023.",
    category: ["Funding"],
    impact: "negative",
    relevanceScore: 70,
    trendDirection: "down",
  },
  {
    id: "3",
    title: "Remote Work Adoption Plateaus",
    description:
      "The rapid growth of remote work adoption has stabilized at 30% of the workforce.",
    category: ["Market"],
    impact: "neutral",
    relevanceScore: 60,
    trendDirection: "stable",
  },
  {
    id: "4",
    title: "Cybersecurity Threats on the Rise",
    description:
      "Small businesses report a 40% increase in cyberattacks over the last quarter.",
    category: ["Risk"],
    impact: "negative",
    relevanceScore: 90,
    trendDirection: "up",
  },
  {
    id: "5",
    title: "Green Tech Investments Surge",
    description:
      "Investments in sustainable technology startups have grown by 50% year-over-year.",
    category: ["Funding", "Growth"],
    impact: "positive",
    relevanceScore: 80,
    trendDirection: "up",
  },
  {
    id: "6",
    title: "Regulatory Challenges in Fintech",
    description:
      "New regulations pose challenges for 60% of fintech startups in compliance and operations.",
    category: ["Risk", "Market"],
    impact: "negative",
    relevanceScore: 75,
    trendDirection: "up",
  },
  {
    id: "7",
    title: "Gig Economy Expansion",
    description:
      "The gig economy is projected to grow by 25% in the next two years, opening new markets.",
    category: ["Market", "Growth"],
    impact: "positive",
    relevanceScore: 65,
    trendDirection: "up",
  },
  {
    id: "8",
    title: "Talent Shortage in Tech",
    description:
      "85% of tech startups report difficulties in hiring skilled developers and data scientists.",
    category: ["Risk", "Growth"],
    impact: "negative",
    relevanceScore: 85,
    trendDirection: "up",
  },
  {
    id: "9",
    title: "Blockchain Adoption in Supply Chain",
    description:
      "Blockchain technology in supply chain management is expected to grow by 60% annually.",
    category: ["Market", "Growth"],
    impact: "positive",
    relevanceScore: 70,
    trendDirection: "up",
  },
];

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // Simulating API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setInsights(mockInsights);
      toast.success("Insights refreshed successfully");
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast.error("Failed to fetch insights");
    } finally {
      setLoading(false);
    }
  };

  const filteredInsights = selectedCategory
    ? insights.filter((insight) =>
        insight.category.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    : insights;

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "market":
        return "bg-blue-500 text-white";
      case "funding":
        return "bg-green-500 text-white";
      case "growth":
        return "bg-purple-500 text-white";
      case "risk":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "market":
        return <BarChart className="h-4 w-4" />;
      case "funding":
        return <DollarSign className="h-4 w-4" />;
      case "growth":
        return <TrendingUp className="h-4 w-4" />;
      case "risk":
        return <ShieldAlert className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "negative":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case "neutral":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <DashboardHeader />
      <main className="container mx-auto p-8 pt-24">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Startup Insights
        </motion.h1>
        <motion.div
          className="mb-8 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            All
          </Button>
          {["Market", "Funding", "Growth", "Risk"].map((category) => (
            <Button
              key={category}
              variant={
                selectedCategory === category.toLowerCase()
                  ? "default"
                  : "outline"
              }
              onClick={() => setSelectedCategory(category.toLowerCase())}
              className={`${getCategoryColor(
                category
              )} rounded-full hover:opacity-80 flex items-center gap-2`}
            >
              {getCategoryIcon(category)}
              {category}
            </Button>
          ))}
        </motion.div>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
            <p className="text-lg text-gray-300">Loading insights...</p>
          </div>
        ) : filteredInsights.length > 0 ? (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnimatePresence>
              {filteredInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/20 transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex flex-wrap gap-2">
                          {insight.category.map((cat) => (
                            <Badge
                              key={cat}
                              className={`${getCategoryColor(
                                cat
                              )} flex items-center gap-1`}
                            >
                              {getCategoryIcon(cat)}
                              {cat}
                            </Badge>
                          ))}
                        </div>
                        {getImpactIcon(insight.impact)}
                      </div>
                      <CardTitle className="mt-3 text-xl">
                        {insight.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {insight.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">
                            Relevance
                          </span>
                          <span className="text-sm font-medium text-gray-300">
                            {insight.relevanceScore}%
                          </span>
                        </div>
                        <Progress
                          value={insight.relevanceScore}
                          className="w-full h-2"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">
                          Trend
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            insight.trendDirection === "up"
                              ? "text-green-400"
                              : insight.trendDirection === "down"
                              ? "text-red-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {insight.trendDirection.toUpperCase()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className="text-center text-gray-300 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No insights found for this category.
          </motion.div>
        )}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            onClick={fetchInsights}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full flex items-center"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Refresh Insights
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
