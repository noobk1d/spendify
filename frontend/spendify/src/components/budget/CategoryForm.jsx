"use client";

import { useState } from "react";
import { Button } from "../ui/Profile/button";
import { Input } from "../ui/Profile/input";

export function CategoryForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/spendify/api/budget/category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            category: formData.category.toLowerCase(),
            limit: Number(formData.limit),
          }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        onSubmit(data.data);
        setFormData({ category: "", limit: "" });
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        required
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        placeholder="Category name"
        className="w-full"
      />
      <Input
        required
        type="number"
        min="0"
        step="0.01"
        value={formData.limit}
        onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
        placeholder="Budget limit"
        className="w-full"
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({ category: "", limit: "" });
            onCancel?.();
          }}>
          Cancel
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Add Category
        </Button>
      </div>
    </form>
  );
}
