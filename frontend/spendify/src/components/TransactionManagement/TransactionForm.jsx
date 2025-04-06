"use client";

import { useState } from "react";
import { Button } from "../ui/Profile/button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Profile/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Profile/select";
import { RadioGroup, RadioGroupItem } from "../ui/Profile/radio-group";
import { toast } from "sonner";

export default function TransactionForm({ onClose, onSubmit }) {
  const [transactionType, setTransactionType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category || !description || !paymentMethod) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields",
        duration: 5000,
        className: "bg-red-50 border-red-200",
        style: {
          background: "rgb(254 242 242)",
          border: "1px solid rgb(254 202 202)",
          color: "rgb(185 28 28)",
        },
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = {
        amount,
        type: transactionType,
        category,
        description,
        date,
        paymentMethod,
      };

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Transaction Failed", {
        description: "Failed to submit transaction. Please try again.",
        duration: 5000,
        className: "bg-red-50 border-red-200",
        style: {
          background: "rgb(254 242 242)",
          border: "1px solid rgb(254 202 202)",
          color: "rgb(185 28 28)",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup
        defaultValue="expense"
        className="flex gap-4"
        onValueChange={setTransactionType}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="expense" id="expense" />
          <Label htmlFor="expense">Expense</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="income" id="income" />
          <Label htmlFor="income">Income</Label>
        </div>
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input
            id="amount"
            type="number"
            className="pl-7"
            placeholder="0.00"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {transactionType === "expense" ? (
              <>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="bills">Bills & Utilities</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="gifts">Gifts</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
            <SelectItem value="credit">Credit Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          autoComplete="off"
          placeholder="Transaction description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </div>
          ) : (
            "Add Transaction"
          )}
        </Button>
      </div>
    </form>
  );
}
