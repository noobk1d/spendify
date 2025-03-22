"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Profile/dialog";
import { Button } from "../ui/Profile/button";
import { Input } from "../ui/Profile/input";
import { Plus, Home, Utensils, Car, Film, ShoppingBag, X } from "lucide-react";

const icons = [
  { icon: Home, name: "Home" },
  { icon: Utensils, name: "Utensils" },
  { icon: Car, name: "Car" },
  { icon: Film, name: "Film" },
  { icon: ShoppingBag, name: "ShoppingBag" },
];

const colors = [
  { value: "hsl(262, 80%, 50%)", name: "Purple" },
  { value: "hsl(220, 70%, 50%)", name: "Blue" },
  { value: "hsl(10, 80%, 60%)", name: "Red" },
  { value: "hsl(40, 80%, 50%)", name: "Yellow" },
  { value: "hsl(142, 76%, 36%)", name: "Green" },
];

export function CategoryForm({
  mode = "create",
  category,
  onSubmit,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(
    category || {
      name: "",
      limit: "",
      icon: "Home",
      color: colors[0].value,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      limit: parseFloat(formData.limit),
      spent: category ? category.spent : 0,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="w-full h-8 text-sm gap-1">
            <Plus className="h-3 w-3" />
            Add Category
          </Button>
        ) : (
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Edit category</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Category name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Budget Limit</label>
            <Input
              required
              type="number"
              min="0"
              step="0.01"
              value={formData.limit}
              onChange={(e) =>
                setFormData({ ...formData, limit: e.target.value })
              }
              placeholder="Enter amount"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {icons.map(({ icon: Icon, name }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: name })}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    formData.icon === name
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}>
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map(({ value, name }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: value })}
                  className={`h-8 rounded-md border-2 ${
                    formData.color === value
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: value }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <Button type="submit" className="w-24">
              {mode === "create" ? "Add" : "Save"}
            </Button>
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                className="w-24"
                onClick={() => {
                  onDelete(category);
                  setOpen(false);
                }}>
                Delete
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
