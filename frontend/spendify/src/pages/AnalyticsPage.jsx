"use client";

import { useState } from "react";
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
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("monthly");

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
              className="w-full sm:w-[200px]"
              onValueChange={setTimeframe}>
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
              <SummaryCards timeframe={timeframe} />
            </div>

            {/* Income vs Expense Chart */}
            <Card className="lg:col-span-2 overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-4">
                <CardTitle>Income vs Expense</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[300px]">
                  <IncomeExpenseChart timeframe={timeframe} />
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
                  <BudgetActualChart timeframe={timeframe} />
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
                  <DailyTrends timeframe={timeframe} />
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
                  <SpendingHeatmap timeframe={timeframe} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
