"use client";

import { useState, useEffect } from "react";
import {
  CalendarIcon,
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
import { Button } from "../components/ui/Profile/button";
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
import { DatePicker } from "../components/ui/Transactions/date-picker";
import { DateRangePicker } from "../components/ui/Transactions/date-range-picker";
import Sidebar from "./Sidebar";
import TransactionForm from "../components/TransactionManagement/TransactionForm";
import RecurringTransactionForm from "../components/TransactionManagement/RecurringTransactionForm";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { formatCurrency } from "../lib/utils";
import TransactionStatusAnimation from "../components/TransactionStatusAnimation";

// Mock data for recurring transactions
const mockRecurringTransactions = [
  {
    id: 1,
    description: "Netflix Subscription",
    category: "Entertainment",
    frequency: "Monthly",
    nextDate: "2024-04-15",
    amount: -14.99,
    active: true,
  },
  {
    id: 2,
    description: "Salary",
    category: "Income",
    frequency: "Monthly",
    nextDate: "2024-04-01",
    amount: 5000,
    active: true,
  },
  {
    id: 3,
    description: "Gym Membership",
    category: "Health",
    frequency: "Monthly",
    nextDate: "2024-04-10",
    amount: -29.99,
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
  const [recurringTransactions, setRecurringTransactions] = useState(
    mockRecurringTransactions
  );

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("All Methods");

  // State for date filtering
  const [dateFilterType, setDateFilterType] = useState("monthly");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // State for dialogs
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const [newRecurringOpen, setNewRecurringOpen] = useState(false);
  const [editRecurringId, setEditRecurringId] = useState(null);

  // State for status animation
  const [showStatusAnimation, setShowStatusAnimation] = useState(false);
  const [statusAnimation, setStatusAnimation] = useState({
    status: "",
    message: "",
  });

  // Load data with API call
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        let url = `http://127.0.0.1:3000/spendify/api/transaction/67cf12a40004818c2916?filterType=${dateFilterType}`;

        if (dateFilterType === "custom" && dateRange.from && dateRange.to) {
          url += `&startDate=${dateRange.from}&endDate=${dateRange.to}`;
        }

        if (selectedCategory !== "All Categories") {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        if (selectedPaymentMethod !== "All Methods") {
          url += `&paymentMethod=${encodeURIComponent(selectedPaymentMethod)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const result = await response.json();
        if (result.status === "success") {
          setTransactions(result.data);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [dateFilterType, selectedCategory, selectedPaymentMethod, dateRange]);

  // Handle date filter type change
  const handleDateFilterTypeChange = (value) => {
    setDateFilterType(value);

    // Reset to default date ranges based on selection
    if (value === "weekly") {
      setDateRange({
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date(),
      });
    } else if (value === "monthly") {
      setDateRange({
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        to: new Date(),
      });
    } else {
      // For custom and single, reset the range
      setDateRange({
        from: null,
        to: null,
      });
    }

    // Reset page when filter changes
    setCurrentPage(1);
  };

  // Filter transactions based on search, category, payment method, and date
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.note
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      transaction.category === selectedCategory;
    const matchesPaymentMethod =
      selectedPaymentMethod === "All Methods" ||
      transaction.paymentMethod === selectedPaymentMethod;

    // Date filtering
    let matchesDate = true;
    const transactionDate = new Date(transaction.date);

    if (dateFilterType === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      matchesDate = transactionDate >= oneWeekAgo;
    } else if (dateFilterType === "monthly") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      matchesDate = transactionDate >= oneMonthAgo;
    } else if (dateFilterType === "custom") {
      if (dateRange.from && dateRange.to) {
        const startDate = new Date(dateRange.from);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        matchesDate =
          transactionDate >= startDate && transactionDate <= endDate;
      } else if (dateRange.from) {
        const startDate = new Date(dateRange.from);
        startDate.setHours(0, 0, 0, 0);
        matchesDate = transactionDate >= startDate;
      }
    } else if (dateFilterType === "single" && selectedDate) {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = transactionDate >= start && transactionDate <= end;
    }

    return (
      matchesSearch && matchesCategory && matchesPaymentMethod && matchesDate
    );
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
    return format(date, "MMM d, yyyy");
  };

  // Get date filter description
  const getDateFilterDescription = () => {
    if (dateFilterType === "weekly") {
      return "Showing transactions from the past week";
    } else if (dateFilterType === "monthly") {
      return "Showing transactions from the past month";
    } else if (dateFilterType === "custom" && dateRange.from) {
      if (dateRange.to) {
        return `Showing transactions from ${format(
          dateRange.from,
          "MMM d, yyyy"
        )} to ${format(dateRange.to, "MMM d, yyyy")}`;
      }
      return `Showing transactions from ${format(
        dateRange.from,
        "MMM d, yyyy"
      )}`;
    } else if (dateFilterType === "single" && selectedDate) {
      return `Showing transactions for ${format(selectedDate, "MMM d, yyyy")}`;
    }
    return "";
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/spendify/api/transaction/67cf12a40004818c2916",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(transactionData.amount),
            type: transactionData.type,
            paymentMethod: transactionData.paymentMethod.toLowerCase(),
            category: transactionData.category.toLowerCase(),
            note: transactionData.description,
            date: transactionData.date,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Show success animation first
        setStatusAnimation({
          status: "success",
          message: data.message || "Transaction added successfully!",
        });
        setShowStatusAnimation(true);

        // Wait for animation to be visible before proceeding
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Close modal
        setNewTransactionOpen(false);

        // Refresh transactions list
        const refreshResponse = await fetch(
          `http://127.0.0.1:3000/spendify/api/transaction/67cf12a40004818c2916?filterType=${dateFilterType}`
        );
        const refreshData = await refreshResponse.json();
        if (refreshData.status === "success") {
          setTransactions(refreshData.data);
        }

        // Hide animation after 3 seconds
        setTimeout(() => {
          setShowStatusAnimation(false);
        }, 3000);
      } else {
        // Show error animation
        setStatusAnimation({
          status: "error",
          message:
            data.message || "Failed to add transaction. Please try again.",
        });
        setShowStatusAnimation(true);

        // Hide animation after 3 seconds
        setTimeout(() => {
          setShowStatusAnimation(false);
        }, 3000);
      }
    } catch (error) {
      // Show error animation
      setStatusAnimation({
        status: "error",
        message: "An error occurred. Please try again.",
      });
      setShowStatusAnimation(true);

      // Hide animation after 3 seconds
      setTimeout(() => {
        setShowStatusAnimation(false);
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Transactions
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your income and expenses
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
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
                      <Select
                        value={dateFilterType}
                        onValueChange={handleDateFilterTypeChange}>
                        <SelectTrigger className="w-[150px]">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                          <SelectItem value="single">Single Date</SelectItem>
                        </SelectContent>
                      </Select>

                      {dateFilterType === "custom" && (
                        <div className="w-[250px]">
                          <DateRangePicker
                            dateRange={dateRange}
                            onRangeChange={setDateRange}
                          />
                        </div>
                      )}

                      {dateFilterType === "single" && (
                        <div className="w-[200px]">
                          <DatePicker
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                          />
                        </div>
                      )}

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
                  <div className="mb-2 text-sm text-muted-foreground">
                    {getDateFilterDescription()}
                  </div>
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
                                className={`border-b transition-colors hover:bg-muted/50 ${
                                  transaction.type === "income"
                                    ? "bg-green-50/50"
                                    : "bg-red-50/50"
                                }`}>
                                <td className="p-4 align-middle text-sm">
                                  {formatDate(transaction.date)}
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="font-medium">
                                    {transaction.note}
                                  </div>
                                </td>
                                <td className="p-4 align-middle">
                                  <Badge
                                    variant={
                                      transaction.type === "income"
                                        ? "outline"
                                        : "secondary"
                                    }
                                    className={
                                      transaction.type === "income"
                                        ? "border-green-200 bg-green-100 text-green-700"
                                        : "border-red-200 bg-red-100 text-red-700"
                                    }>
                                    {transaction.category}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle text-sm">
                                  {transaction.paymentMethod}
                                </td>
                                <td
                                  className={`p-4 align-middle text-right font-medium ${
                                    transaction.type === "income"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}>
                                  {transaction.type === "income" ? "+" : "-"}
                                  {formatCurrency(Math.abs(transaction.amount))}
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
                          {recurringTransactions.map((transaction) => (
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
                                {transaction.amount >= 0 ? "+" : "-"}
                                {formatCurrency(Math.abs(transaction.amount))}
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
                          ))}
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
            onSubmit={handleAddTransaction}
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

      {/* Status Animation */}
      <TransactionStatusAnimation
        status={statusAnimation.status}
        message={statusAnimation.message}
        isVisible={showStatusAnimation}
      />
    </div>
  );
}
