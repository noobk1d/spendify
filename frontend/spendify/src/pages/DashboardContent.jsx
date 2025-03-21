import { useState } from "react";
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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Dashboard/Card";
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

function DashboardContent() {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {/* <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold -800">
              next wallet
            </h1>
            <span className="ml-2 text-xs -500">by NextDesign</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 w-4 h-4 -400" />
              <Input
                placeholder="Search for anything"
                className="pl-10 w-64 bg-slate-50 border-slate-200 focus-visible:ring-purple-500"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 -600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-purple-600 rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="https://via.placeholder.com/40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Jonathan</p>
                <p className="text-xs -500">$4500</p>
              </div>
            </div>
          </div>
        </header> */}

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold -800">My Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Tabs defaultValue="this-week" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="this-week">This Week</TabsTrigger>
                  <TabsTrigger value="this-month">This Month</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                onClick={() => setIsAddTransactionOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Bento Grid Layout - Updated as requested */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left Column: Wallet Balance and Top Spending stacked */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              {/* Wallet Balance */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg -700">Wallet Balance</CardTitle>
                  <CardDescription>Thursday, 16 December 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold -800">$1,280.50</p>
                      <p className="text-sm text-green-600 mt-1">
                        +$250.00 this month
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                      <DollarSign className="w-7 h-7 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Spending */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg -700">Top Spending</CardTitle>
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
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">Shopping</p>
                      <p className="text-sm font-medium">$420.80</p>
                    </div>
                    <Progress
                      value={42}
                      className="h-2 bg-slate-100"
                      indicatorClassName="bg-purple-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">Groceries</p>
                      <p className="text-sm font-medium">$285.65</p>
                    </div>
                    <Progress
                      value={28}
                      className="h-2 bg-slate-100"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">Entertainment</p>
                      <p className="text-sm font-medium">$150.20</p>
                    </div>
                    <Progress
                      value={15}
                      className="h-2 bg-slate-100"
                      indicatorClassName="bg-green-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Income vs Expense Graph */}
            <Card className="col-span-1 md:col-span-2 row-span-1 bg-blue-50 border-blue-100 flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg -700">
                  Income vs Expense
                </CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="h-[250px] flex flex-col">
                  <IncomeExpenseChart />
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions - Full Width Below */}
            <Card className="col-span-1 md:col-span-4 row-span-1">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg -700">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Apple Store</p>
                        <p className="text-xs -500">Electronics</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-red-600">-$299.99</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Whole Foods</p>
                        <p className="text-xs -500">Groceries</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-red-600">-$85.32</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Salary Deposit</p>
                        <p className="text-xs -500">Income</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-green-600">
                      +$2,500.00
                    </p>
                  </div>
                </div>
                {/* <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm" className="text-purple-600">
                    View more
                  </Button>
                </div> */}
              </CardContent>
            </Card>
          </div>

          {/* Quick Add Transaction Button (Mobile) */}
          <div className="fixed bottom-6 right-6 md:hidden">
            <Button
              onClick={() => setIsAddTransactionOpen(true)}
              size="icon"
              className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg">
              <Plus className="w-6 h-6" />
              <span className="sr-only">Add Transaction</span>
            </Button>
          </div>
        </main>
      </div>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
      />
    </div>
  );
}

export default DashboardContent;
