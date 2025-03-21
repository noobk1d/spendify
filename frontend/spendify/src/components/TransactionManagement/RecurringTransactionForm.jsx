"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Profile/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Profile/select";
import { DialogFooter } from "../ui/Profile/dialog";
import { Switch } from "../ui/Profile/switch";

export default function RecurringTransactionForm({
  onSubmit,
  initialData = null,
  categories = [],
}) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    frequency: "Monthly",
    nextDate: new Date(new Date().setDate(new Date().getDate() + 7))
      .toISOString()
      .split("T")[0],
    active: true,
  });

  const [errors, setErrors] = useState({});

  // If editing, populate form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description,
        amount: String(Math.abs(initialData.amount)),
        category: initialData.category,
        frequency: initialData.frequency,
        nextDate: initialData.nextDate,
        active: initialData.active,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(formData.amount))) {
      newErrors.amount = "Amount must be a number";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.frequency) {
      newErrors.frequency = "Frequency is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Convert amount to number and handle income/expense
      const amountValue =
        formData.category === "Income"
          ? Math.abs(Number(formData.amount))
          : -Math.abs(Number(formData.amount));

      onSubmit({
        ...formData,
        amount: amountValue,
        id: initialData?.id, // Pass the ID if editing
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Enter transaction description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
          {errors.amount && (
            <p className="text-sm text-destructive">{errors.amount}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            value={formData.frequency}
            onValueChange={(value) => handleChange("frequency", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Quarterly">Quarterly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.frequency && (
            <p className="text-sm text-destructive">{errors.frequency}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="nextDate">Next Date</Label>
          <Input
            id="nextDate"
            type="date"
            value={formData.nextDate}
            onChange={(e) => handleChange("nextDate", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => handleChange("active", checked)}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">
          {initialData ? "Update" : "Save"} Recurring Transaction
        </Button>
      </DialogFooter>
    </form>
  );
}
