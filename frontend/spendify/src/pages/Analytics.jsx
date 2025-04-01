import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const Analytics = () => {
  console.log("Analytics component rendering");

  const [filterType, setFilterType] = useState("weekly");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useEffect triggered");
    console.log("Current filterType:", filterType);
    fetchAnalyticsData();
  }, [filterType]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      console.log("Fetching data with filterType:", filterType);
      const response = await fetch(
        `http://127.0.0.1:3000/spendify/api/reports/67cf12a40004818c2916?filterType=${filterType}`
      );
      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "success") {
        console.log("Setting analytics data:", data.data);
        setAnalyticsData(data.data);
      } else {
        console.error("API returned error status:", data);
        setError("Failed to fetch analytics data");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error fetching analytics data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return filterType === "weekly"
      ? date.toLocaleDateString("en-US", { weekday: "short" })
      : date.toLocaleDateString("en-US", { month: "short" });
  };

  const processIncomeVsExpense = () => {
    console.log(
      "Processing income vs expense data:",
      analyticsData?.incomeVsExpense
    );
    if (!analyticsData?.incomeVsExpense) return [];

    const sortedData = [...analyticsData.incomeVsExpense].sort(
      (a, b) => new Date(a.month) - new Date(b.month)
    );
    console.log("Sorted income vs expense data:", sortedData);
    return sortedData.map((item) => ({
      name: formatDate(item.month),
      Income: item.income || 0,
      Expense: item.expense || 0,
    }));
  };

  const processSpendingHeatmap = () => {
    console.log(
      "Processing spending heatmap data:",
      analyticsData?.spendingHeatmap
    );
    if (!analyticsData?.spendingHeatmap) return [];

    const sortedData = [...analyticsData.spendingHeatmap].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    console.log("Sorted spending heatmap data:", sortedData);
    return sortedData.map((item) => ({
      name: formatDate(item.date),
      amount: item.amount || 0,
    }));
  };

  const processBudgetVsActual = () => {
    console.log(
      "Processing budget vs actual data:",
      analyticsData?.budgetVsActual
    );
    if (!analyticsData?.budgetVsActual) return [];

    const {
      budget = 0,
      spent = 0,
      remaining = 0,
    } = analyticsData.budgetVsActual;
    const result = [
      { name: "Budget", value: budget },
      { name: "Spent", value: spent },
      { name: "Remaining", value: remaining },
    ];
    console.log("Processed budget vs actual data:", result);
    return result;
  };

  // Add a function to format tooltip values
  const formatTooltipValue = (value) => {
    return formatCurrency(value || 0);
  };

  const COLORS = ["#4CAF50", "#FF5252", "#2196F3"];

  const handleFilterChange = (value) => {
    console.log("Filter changing to:", value);
    setFilterType(value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analyticsData) return <div>No data available</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Select value={filterType} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Income:</span>
                <span className="text-green-500">
                  {formatCurrency(analyticsData.financialSummary.totalIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Expenses:</span>
                <span className="text-red-500">
                  {formatCurrency(analyticsData.financialSummary.totalExpenses)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Net Savings:</span>
                <span
                  className={
                    analyticsData.financialSummary.netSavings >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }>
                  {formatCurrency(analyticsData.financialSummary.netSavings)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processBudgetVsActual()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label>
                    {processBudgetVsActual().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processSpendingHeatmap()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income vs Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processIncomeVsExpense()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={formatTooltipValue}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={formatTooltipValue}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="Income" fill="#4CAF50" />
                <Bar dataKey="Expense" fill="#FF5252" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
