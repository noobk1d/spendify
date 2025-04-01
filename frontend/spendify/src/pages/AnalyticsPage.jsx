"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Profile/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Profile/tabs";
import { IncomeExpenseChart } from "../components/analytics/IncomeExpenseChart";
import { BudgetActualChart } from "../components/analytics/BudgetActualChart";
import { SummaryCards } from "../components/analytics/SummaryCards";
import { SpendingHeatmap } from "../components/analytics/SpendingHeatmap";
import { DailyTrends } from "../components/analytics/DailyTrends";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("monthly");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://127.0.0.1:3000/spendify/api/reports/67cf12a40004818c2916?timeframe=${timeframe}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch analytics data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.status === "success") {
          setAnalyticsData(data.data.data);
        } else {
          throw new Error("Failed to fetch analytics data");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">Error: {error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Analytics Dashboard
            </h1>
            <Tabs
              defaultValue="monthly"
              value={timeframe}
              className="w-full sm:w-[200px]"
              onValueChange={(value) => {
                setTimeframe(value);
                // Force a re-render of the components
                setAnalyticsData(null);
                setLoading(true);
              }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="weekly"
                  className="transition-all data-[state=active]:animate-pulse-slow">
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="transition-all data-[state=active]:animate-pulse-slow">
                  Monthly
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Summary Cards Column */}
            <div className="lg:col-span-1 space-y-4">
              <SummaryCards
                data={analyticsData?.summary}
                timeframe={timeframe}
              />
            </div>

            {/* Income vs Expense Chart */}
            <Card className="lg:col-span-2 overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-4">
                <CardTitle>Income vs Expense</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[300px]">
                  <IncomeExpenseChart
                    data={analyticsData?.incomeExpense}
                    timeframe={timeframe}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Budget vs Actual Chart */}
            <Card className="lg:col-span-2 overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-4">
                <CardTitle>Budget vs Actual Spent</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[250px]">
                  <BudgetActualChart
                    data={analyticsData?.budgetActual}
                    timeframe={timeframe}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Daily Trends */}
            <Card className="lg:col-span-1 overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-4">
                <CardTitle>Daily Trends</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[250px]">
                  <DailyTrends
                    data={analyticsData?.dailyTrends}
                    timeframe={timeframe}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Spending Heatmap */}
            <Card className="lg:col-span-3 overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-4">
                <CardTitle>Spending Heatmap</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[200px]">
                  <SpendingHeatmap
                    data={analyticsData?.spendingHeatmap}
                    timeframe={timeframe}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
