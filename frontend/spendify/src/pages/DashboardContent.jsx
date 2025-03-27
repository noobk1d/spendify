import { useState, useEffect } from "react";
import {
  Bell,
  CreditCard,
  DollarSign,
  Home,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  User,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Dashboard/card";
import { Button } from "../components/ui/Dashboard/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/Dashboard/avatar";
import { Input } from "../components/ui/Dashboard/input";
import { Progress } from "../components/ui/Dashboard/progress";
import { AddTransactionDialog } from "../components/AddTransactionDialog";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Dashboard/tabs";
import { IncomeExpenseChart } from "../components/IncomeExpenseChart";

export default function DashboardContent() {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("monthly");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:3000/spendify/api/dashboard/67cf12a40004818c2916?filterType=${timeframe}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        console.log(response.data);
        const result = await response.json();
        if (result.status === "success") {
          setDashboardData(result.data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Dashboard Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4 md:gap-2">
          <h2 className="text-xl md:text-2xl font-semibold -800">
            My Dashboard
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Tabs
              value={timeframe}
              className="w-full sm:w-[200px]"
              onValueChange={setTimeframe}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekly">This Week</TabsTrigger>
                <TabsTrigger value="monthly">This Month</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              onClick={() => setIsAddTransactionOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Left Column: Wallet Balance and Top Spending stacked */}
          <div className="col-span-1 lg:col-span-2 space-y-4 md:space-y-6">
            {/* Wallet Balance */}
            <Card className="w-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg -700">
                  Wallet Balance
                </CardTitle>
                <CardDescription className="text-sm">
                  {formatDate(new Date())}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-4xl font-bold -800">
                      {dashboardData?.walletBalance
                        ? formatCurrency(dashboardData.walletBalance)
                        : `No data for this ${
                            timeframe === "weekly" ? "week" : "month"
                          }`}
                    </p>
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Spending */}
            <Card className="w-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base md:text-lg -700">
                    Top Spending
                  </CardTitle>
                  <Button variant="ghost" size="icon">
                    <svg
                      width="15"
                      height="3"
                      viewBox="0 0 15 3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="-600">
                      <path
                        d="M1.5 1.5C1.5 1.89782 1.65804 2.27936 1.93934 2.56066C2.22064 2.84196 2.60218 3 3 3C3.39782 3 3.77936 2.84196 4.06066 2.56066C4.34196 2.27936 4.5 1.89782 4.5 1.5C4.5 1.10218 4.34196 0.720644 4.06066 0.43934C3.77936 0.158035 3.39782 0 3 0C2.60218 0 2.22064 0.158035 1.93934 0.43934C1.65804 0.720644 1.5 1.10218 1.5 1.5ZM6 1.5C6 1.89782 6.15804 2.27936 6.43934 2.56066C6.72064 2.84196 7.10218 3 7.5 3C7.89782 3 8.27936 2.84196 8.56066 2.56066C8.84196 2.27936 9 1.89782 9 1.5C9 1.10218 8.84196 0.720644 8.56066 0.43934C8.27936 0.158035 7.89782 0 7.5 0C7.10218 0 6.72064 0.158035 6.43934 0.43934C6.15804 0.720644 6 1.10218 6 1.5ZM10.5 1.5C10.5 1.89782 10.658 2.27936 10.9393 2.56066C11.2206 2.84196 11.6022 3 12 3C12.3978 3 12.7794 2.84196 13.0607 2.56066C13.342 2.27936 13.5 1.89782 13.5 1.5C13.5 1.10218 13.342 0.720644 13.0607 0.43934C12.7794 0.158035 12.3978 0 12 0C11.6022 0 11.2206 0.158035 10.9393 0.43934C10.658 0.720644 10.5 1.10218 10.5 1.5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {dashboardData?.topSpendingCategories?.length > 0 ? (
                  dashboardData.topSpendingCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium capitalize">
                          {category.category}
                        </p>
                        <p className="text-sm font-medium">
                          {formatCurrency(category.amount)}
                        </p>
                      </div>
                      <Progress
                        value={
                          (category.amount /
                            dashboardData.topSpendingCategories[0].amount) *
                          100
                        }
                        className="h-2 bg-slate-100"
                        indicatorClassName={`${
                          index === 0
                            ? "bg-purple-500"
                            : index === 1
                            ? "bg-blue-500"
                            : index === 2
                            ? "bg-green-500"
                            : index === 3
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    No data for this {timeframe === "weekly" ? "week" : "month"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Income vs Expense Graph */}
          <Card className="col-span-1 lg:col-span-2 row-span-1 bg-blue-50 border-blue-100 flex flex-col min-h-[350px] md:min-h-[400px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg -700">
                Income vs Expense
              </CardTitle>
              <CardDescription className="text-sm">
                Last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 md:p-4 flex-1">
              {dashboardData?.incomeExpenseGraph ? (
                <div className="h-full">
                  <IncomeExpenseChart data={dashboardData.incomeExpenseGraph} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data for this {timeframe === "weekly" ? "week" : "month"}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="col-span-1 lg:col-span-4 row-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base md:text-lg -700">
                  Recent Transactions
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <svg
                    width="15"
                    height="3"
                    viewBox="0 0 15 3"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="-600">
                    <path
                      d="M1.5 1.5C1.5 1.89782 1.65804 2.27936 1.93934 2.56066C2.22064 2.84196 2.60218 3 3 3C3.39782 3 3.77936 2.84196 4.06066 2.56066C4.34196 2.27936 4.5 1.89782 4.5 1.5C4.5 1.10218 4.34196 0.720644 4.06066 0.43934C3.77936 0.158035 3.39782 0 3 0C2.60218 0 2.22064 0.158035 1.93934 0.43934C1.65804 0.720644 1.5 1.10218 1.5 1.5ZM6 1.5C6 1.89782 6.15804 2.27936 6.43934 2.56066C6.72064 2.84196 7.10218 3 7.5 3C7.89782 3 8.27936 2.84196 8.56066 2.56066C8.84196 2.27936 9 1.89782 9 1.5C9 1.10218 8.84196 0.720644 8.56066 0.43934C8.27936 0.158035 7.89782 0 7.5 0C7.10218 0 6.72064 0.158035 6.43934 0.43934C6.15804 0.720644 6 1.10218 6 1.5ZM10.5 1.5C10.5 1.89782 10.658 2.27936 10.9393 2.56066C11.2206 2.84196 11.6022 3 12 3C12.3978 3 12.7794 2.84196 13.0607 2.56066C13.342 2.27936 13.5 1.89782 13.5 1.5C13.5 1.10218 13.342 0.720644 13.0607 0.43934C12.7794 0.158035 12.3978 0 12 0C11.6022 0 11.2206 0.158035 10.9393 0.43934C10.658 0.720644 10.5 1.10218 10.5 1.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {dashboardData?.recentTransactions?.length > 0 ? (
                  dashboardData.recentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-100"
                              : "bg-red-100"
                          } flex items-center justify-center`}>
                          <DollarSign
                            className={`w-5 h-5 ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {transaction.category}
                          </p>
                          <p className="text-xs -500">{transaction.note}</p>
                        </div>
                      </div>
                      <p
                        className={`text-sm font-medium ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}>
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center text-gray-500">
                    No data for this {timeframe === "weekly" ? "week" : "month"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Add Transaction Button (Mobile) */}
        <div className="fixed bottom-4 right-4 md:hidden">
          <Button
            onClick={() => setIsAddTransactionOpen(true)}
            size="icon"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg">
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
            <span className="sr-only">Add Transaction</span>
          </Button>
        </div>
      </main>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
      />
    </div>
  );
}
