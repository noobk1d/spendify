import { useState } from "react";
import TransactionStatusAnimation from "./TransactionStatusAnimation";
import TransactionForm from "./TransactionManagement/TransactionForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/Dashboard/dialog";

export default function DashboardContent() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showStatusAnimation, setShowStatusAnimation] = useState(false);
  const [statusAnimation, setStatusAnimation] = useState({
    status: "",
    message: "",
  });

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
        setShowAddTransaction(false);

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
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowAddTransaction(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add Transaction
        </button>
      </div>

      {/* Transaction Form Dialog */}
      <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Enter the details of your transaction below.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleAddTransaction}
            categories={[
              "shopping",
              "groceries",
              "entertainment",
              "bills",
              "transportation",
              "health",
              "education",
              "salary",
              "freelance",
              "investments",
              "gifts",
              "other",
            ]}
            paymentMethods={["cash", "bank", "credit"]}
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
