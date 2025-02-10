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
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Insight {
  id: string;
  title: string;
  description: string;
  category: string[];
  impact: "positive" | "negative" | "neutral";
  relevanceScore: number;
  trendDirection: "up" | "down" | "stable";
}

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
      const response = await fetch("/api/insights");
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInsights = selectedCategory
    ? insights.filter((insight) => 
        insight.category.some(cat => 
          cat.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    : insights;

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "market":
        return "bg-blue-100 text-blue-800";
      case "funding":
        return "bg-green-100 text-green-800";
      case "growth":
        return "bg-purple-100 text-purple-800";
      case "risk":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <>
      <DashboardHeader />
      <div className="container mx-auto p-8 mt-10 xl:mt-16 md:mt-12 sm:mt-16">
        <h1 className="text-3xl font-bold mb-6">Startup Insights</h1>
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {["startup"].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`${getCategoryColor(category)} border-none`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredInsights.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInsights.map((insight) => (
              <Card key={insight.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      {insight.category.map((cat) => (
                        <Badge key={cat} className={`${getCategoryColor(cat)}`}>
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    {getImpactIcon(insight.impact)}
                  </div>
                  <CardTitle className="mt-2">{insight.title}</CardTitle>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Relevance</span>
                      <span className="text-sm font-medium">
                        {insight.relevanceScore}%
                      </span>
                    </div>
                    <Progress
                      value={insight.relevanceScore}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium">Trend: </span>
                    <span
                      className={`text-sm font-bold ${
                        insight.trendDirection === "up"
                          ? "text-green-500"
                          : insight.trendDirection === "down"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {insight.trendDirection.toUpperCase()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No insights found for this category.
          </div>
        )}
        <Button onClick={fetchInsights} className="mt-6">
          Refresh Insights
        </Button>
      </div>
    </>
  );
}