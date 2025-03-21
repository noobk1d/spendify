"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Profile/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Profile/card";
import { Badge } from "../components/ui/Profile/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Profile/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Profile/dialog";
import { Skeleton } from "../components/ui/Profile/skeleton";
import Sidebar from "./Sidebar";
import TransactionForm from "../components/TransactionManagement/TransactionForm";
import RecurringTransactionForm from "../components/TransactionManagement/RecurringTransactionForm";
import { motion } from "framer-motion";

// Mock data for transactions
const mockTransactions = [
  {
    id: 1,
    date: "2025-03-18",
    description: "Grocery Shopping",
    amount: -85.42,
    category: "Food",
    paymentMethod: "Credit Card",
  },
  {
    id: 2,
    date: "2025-03-17",
    description: "Monthly Salary",
    amount: 2450.0,
    category: "Income",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 3,
    date: "2025-03-16",
    description: "Electric Bill",
    amount: -124.56,
    category: "Utilities",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 4,
    date: "2025-03-15",
    description: "Coffee Shop",
    amount: -4.5,
    category: "Food",
    paymentMethod: "Cash",
  },
  {
    id: 5,
    date: "2025-03-14",
    description: "Uber Ride",
    amount: -18.75,
    category: "Transportation",
    paymentMethod: "Credit Card",
  },
  {
    id: 6,
    date: "2025-03-13",
    description: "Freelance Work",
    amount: 350.0,
    category: "Income",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 7,
    date: "2025-03-12",
    description: "Phone Bill",
    amount: -65.0,
    category: "Utilities",
    paymentMethod: "Credit Card",
  },
  {
    id: 8,
    date: "2025-03-11",
    description: "Restaurant Dinner",
    amount: -42.8,
    category: "Food",
    paymentMethod: "Credit Card",
  },
];

// Mock data for recurring transactions
const mockRecurringTransactions = [
  {
    id: 1,
    description: "Netflix Subscription",
    amount: -15.99,
    category: "Entertainment",
    frequency: "Monthly",
    nextDate: "2025-04-05",
    active: true,
  },
  {
    id: 2,
    description: "Rent Payment",
    amount: -1200.0,
    category: "Housing",
    frequency: "Monthly",
    nextDate: "2025-04-01",
    active: true,
  },
  {
    id: 3,
    description: "Gym Membership",
    amount: -49.99,
    category: "Health",
    frequency: "Monthly",
    nextDate: "2025-04-10",
    active: true,
  },
  {
    id: 4,
    description: "Salary",
    amount: 2450.0,
    category: "Income",
    frequency: "Monthly",
    nextDate: "2025-04-15",
    active: true,
  },
  {
    id: 5,
    description: "Internet Bill",
    amount: -59.99,
    category: "Utilities",
    frequency: "Monthly",
    nextDate: "2025-04-07",
    active: false,
  },
];

// Categories for filtering
const categories = [
  "All Categories",
  "Food",
  "Income",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Housing",
  "Health",
];

// Payment methods for filtering
const paymentMethods = ["All Methods", "Credit Card", "Cash", "Bank Transfer"];

export default function TransactionsPage() {
  // State for loading
  const [loading, setLoading] = useState(true);

  // State for transactions
  const [transactions, setTransactions] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("All Methods");
  const [dateView, setDateView] = useState("weekly");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // State for dialogs
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const [newRecurringOpen, setNewRecurringOpen] = useState(false);
  const [editRecurringId, setEditRecurringId] = useState(null);

  // Load data with simulated delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(mockTransactions);
      setRecurringTransactions(mockRecurringTransactions);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter transactions based on search, category, and payment method
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      transaction.category === selectedCategory;
    const matchesPaymentMethod =
      selectedPaymentMethod === "All Methods" ||
      transaction.paymentMethod === selectedPaymentMethod;

    return matchesSearch && matchesCategory && matchesPaymentMethod;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Handle recurring transaction toggle
  const handleToggleRecurring = (id) => {
    setRecurringTransactions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  // Handle recurring transaction delete
  const handleDeleteRecurring = (id) => {
    setRecurringTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle recurring transaction edit
  const handleEditRecurring = (id) => {
    setEditRecurringId(id);
    setNewRecurringOpen(true);
  };

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Transaction Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your income and expenses
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button
                // variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                onClick={() => setNewTransactionOpen(true)}>
                <Plus className="h-4 w-4" />
                New Transaction
              </Button>
            </div>
          </div>

          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="transactions">View Transactions</TabsTrigger>
              <TabsTrigger value="recurring">
                Recurring Transactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative w-full md:w-72">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search transactions..."
                        className="pl-8 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Select value={dateView} onValueChange={setDateView}>
                        <SelectTrigger className="w-[130px]">
                          <Calendar className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[150px]">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedPaymentMethod}
                        onValueChange={setSelectedPaymentMethod}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Payment Method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Date
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Description
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Category
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Payment Method
                            </th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {loading ? (
                            Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <tr
                                  key={index}
                                  className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">
                                    <Skeleton className="h-5 w-24" />
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Skeleton className="h-5 w-40" />
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Skeleton className="h-5 w-20" />
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Skeleton className="h-5 w-24" />
                                  </td>
                                  <td className="p-4 align-middle text-right">
                                    <Skeleton className="h-5 w-16 ml-auto" />
                                  </td>
                                </tr>
                              ))
                          ) : currentTransactions.length > 0 ? (
                            currentTransactions.map((transaction) => (
                              <motion.tr
                                key={transaction.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle">
                                  {formatDate(transaction.date)}
                                </td>
                                <td className="p-4 align-middle font-medium">
                                  {transaction.description}
                                </td>
                                <td className="p-4 align-middle">
                                  <Badge
                                    variant={
                                      transaction.category === "Income"
                                        ? "outline"
                                        : "secondary"
                                    }>
                                    {transaction.category}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle">
                                  {transaction.paymentMethod}
                                </td>
                                <td
                                  className={`p-4 align-middle text-right font-medium ${
                                    transaction.amount >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}>
                                  {transaction.amount >= 0 ? "+" : ""}$
                                  {Math.abs(transaction.amount).toFixed(2)}
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-4 text-center text-muted-foreground">
                                No transactions found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination */}
                  {!loading && filteredTransactions.length > 0 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, filteredTransactions.length)}{" "}
                        of {filteredTransactions.length} transactions
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setCurrentPage(page)}>
                              {page}
                            </Button>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recurring" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Recurring Transactions</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        setEditRecurringId(null);
                        setNewRecurringOpen(true);
                      }}>
                      <Plus className="h-4 w-4" />
                      Add Recurring
                    </Button>
                  </div>
                  <CardDescription>
                    Manage your recurring income and expenses
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Description
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Category
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Frequency
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Next Date
                            </th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                              Amount
                            </th>
                            <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                              Status
                            </th>
                            <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {loading ? (
                            Array(3)
                              .fill(0)
                              .map((_, index) => (
                                <tr
                                  key={index}
                                  className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">
                                    <Skeleton className="h-5 w-40" />
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Skeleton className="h-5 w-20" />
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Skeleton className="h-5 w-20" />
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Skeleton className="h-5 w-24" />
                                  </td>
                                  <td className="p-4 align-middle text-right">
                                    <Skeleton className="h-5 w-16 ml-auto" />
                                  </td>
                                  <td className="p-4 align-middle text-center">
                                    <Skeleton className="h-5 w-16 mx-auto" />
                                  </td>
                                  <td className="p-4 align-middle text-center">
                                    <Skeleton className="h-8 w-24 mx-auto" />
                                  </td>
                                </tr>
                              ))
                          ) : recurringTransactions.length > 0 ? (
                            recurringTransactions.map((transaction) => (
                              <motion.tr
                                key={transaction.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle font-medium">
                                  {transaction.description}
                                </td>
                                <td className="p-4 align-middle">
                                  <Badge
                                    variant={
                                      transaction.category === "Income"
                                        ? "outline"
                                        : "secondary"
                                    }>
                                    {transaction.category}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle">
                                  {transaction.frequency}
                                </td>
                                <td className="p-4 align-middle">
                                  {formatDate(transaction.nextDate)}
                                </td>
                                <td
                                  className={`p-4 align-middle text-right font-medium ${
                                    transaction.amount >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}>
                                  {transaction.amount >= 0 ? "+" : ""}$
                                  {Math.abs(transaction.amount).toFixed(2)}
                                </td>
                                <td className="p-4 align-middle text-center">
                                  <Badge
                                    variant={
                                      transaction.active ? "default" : "outline"
                                    }>
                                    {transaction.active ? "Active" : "Paused"}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="flex items-center justify-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleEditRecurring(transaction.id)
                                      }>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleToggleRecurring(transaction.id)
                                      }>
                                      {transaction.active ? (
                                        <Pause className="h-4 w-4" />
                                      ) : (
                                        <Play className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleDeleteRecurring(transaction.id)
                                      }>
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={7}
                                className="p-4 text-center text-muted-foreground">
                                No recurring transactions found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* New Transaction Dialog */}
      <Dialog open={newTransactionOpen} onOpenChange={setNewTransactionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Enter the details of your transaction below.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            onSubmit={(data) => {
              // In a real app, you would save this data
              console.log("New transaction:", data);
              setNewTransactionOpen(false);
            }}
            categories={categories.filter((c) => c !== "All Categories")}
            paymentMethods={paymentMethods.filter((m) => m !== "All Methods")}
          />
        </DialogContent>
      </Dialog>

      {/* New/Edit Recurring Transaction Dialog */}
      <Dialog open={newRecurringOpen} onOpenChange={setNewRecurringOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editRecurringId
                ? "Edit Recurring Transaction"
                : "Add Recurring Transaction"}
            </DialogTitle>
            <DialogDescription>
              {editRecurringId
                ? "Update the details of your recurring transaction."
                : "Set up a new recurring transaction that will repeat automatically."}
            </DialogDescription>
          </DialogHeader>
          <RecurringTransactionForm
            onSubmit={(data) => {
              // In a real app, you would save this data
              console.log("Recurring transaction:", data);
              setNewRecurringOpen(false);
              setEditRecurringId(null);
            }}
            initialData={
              editRecurringId
                ? recurringTransactions.find((t) => t.id === editRecurringId)
                : null
            }
            categories={categories.filter((c) => c !== "All Categories")}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
