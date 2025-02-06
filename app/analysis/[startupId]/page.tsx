"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis, 
  Tooltip, Legend, LineChart, Line
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisData {
  category: string;
  value: number;
  previousValue: number;
  change: number;
}

interface TrendData {
  month: string;
  funding: number;
  growth: number;
  marketFit: number;
}

export default function StartupAnalysisPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const { startupId } = useParams();

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const [analysisResponse, trendResponse] = await Promise.all([
        fetch(`/api/analysis/${startupId}`),
        fetch(`/api/analysis/trend/${startupId}`)
      ]);
      const analysisData = await analysisResponse.json();
      const trendData = await trendResponse.json();
      setAnalysisData(analysisData);
      setTrendData(trendData);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startupId]);

  const getChangeColor = (change: number) => {
    return change > 0
      ? "text-green-500"
      : change < 0
      ? "text-red-500"
      : "text-yellow-500";
  };

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
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {analysisData.map((item) => (
                  <Card key={item.category}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {item.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{item.value}</div>
                      <p className={`text-xs ${getChangeColor(item.change)}`}>
                        {item.change > 0 ? "+" : ""}
                        {item.change}% from last period
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Comparison of key startup metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analysisData}>
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Current" />
                      <Bar
                        dataKey="previousValue"
                        fill="#82ca9d"
                        name="Previous"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>
                    Monthly trends of key startup metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={trendData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="funding"
                        stroke="#8884d8"
                      />
                      <Line type="monotone" dataKey="growth" stroke="#82ca9d" />
                      <Line
                        type="monotone"
                        dataKey="marketFit"
                        stroke="#ffc658"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        <Button onClick={fetchAnalysis} className="mt-6">
          Refresh Analysis
        </Button>
      </div>
    </>
  );
}