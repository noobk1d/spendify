"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Progress } from "../ui/Profile/progress";
import {
  DollarSign,
  Home,
  Utensils,
  Car,
  Film,
  ShoppingBag,
} from "lucide-react";
import { CategoryForm } from "./CategoryForm";

const iconMap = {
  Home,
  Utensils,
  Car,
  Film,
  ShoppingBag,
};

const initialCategories = [
  {
    name: "Housing",
    limit: 1500,
    spent: 1200,
    color: "hsl(262, 80%, 50%)",
    icon: "Home",
  },
  {
    name: "Food & Dining",
    limit: 800,
    spent: 650,
    color: "hsl(262, 80%, 50%)",
    icon: "Utensils",
  },
  {
    name: "Transportation",
    limit: 600,
    spent: 520,
    color: "hsl(220, 70%, 50%)",
    icon: "Car",
  },
  {
    name: "Entertainment",
    limit: 400,
    spent: 380,
    color: "hsl(10, 80%, 60%)",
    icon: "Film",
  },
  {
    name: "Shopping",
    limit: 300,
    spent: 320,
    color: "hsl(40, 80%, 50%)",
    icon: "ShoppingBag",
  },
];

export function CategoryList() {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const handleUpdateCategory = (updatedCategory) => {
    setCategories(
      categories.map((cat) =>
        cat.name === updatedCategory.name ? updatedCategory : cat
      )
    );
  };

  const handleDeleteCategory = (categoryToDelete) => {
    setCategories(
      categories.filter((cat) => cat.name !== categoryToDelete.name)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <div className="w-32">
          <CategoryForm mode="create" onSubmit={handleAddCategory} />
        </div>
      </div>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {categories.map((category) => {
          const Icon = iconMap[category.icon];
          const remaining = category.limit - category.spent;
          const percentSpent = (category.spent / category.limit) * 100;
          const isOverBudget = category.spent > category.limit;

          return (
            <div
              key={category.name}
              className={`
                rounded-lg border p-3 transition-all duration-300 hover:shadow-md cursor-pointer
                ${
                  selectedCategory === category.name
                    ? "ring-2 ring-[hsl(262,80%,50%)]"
                    : ""
                }
              `}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )
              }>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: category.color }} />
                  <h3 className="font-medium">{category.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`
                    text-xs font-medium
                    ${isOverBudget ? "text-red-500" : "text-green-500"}
                  `}>
                    {isOverBudget
                      ? "Over budget"
                      : `${remaining > 0 ? "$" + remaining : "$0"} remaining`}
                  </span>
                  <CategoryForm
                    mode="edit"
                    category={category}
                    onSubmit={handleUpdateCategory}
                    onDelete={handleDeleteCategory}
                  />
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between text-xs">
                <span>Limit: ${category.limit}</span>
                <span>Spent: ${category.spent}</span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`
                    h-full transition-all duration-1000
                    ${isOverBudget ? "bg-red-500" : ""}
                  `}
                  style={{
                    width: `${Math.min(percentSpent, 100)}%`,
                    backgroundColor: isOverBudget ? "" : category.color,
                  }}></div>
              </div>

              {selectedCategory === category.name && (
                <div className="mt-3 h-[120px] animate-float-slow">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Limit", value: category.limit },
                        { name: "Spent", value: category.spent },
                        {
                          name: "Remaining",
                          value: Math.max(0, category.limit - category.spent),
                        },
                      ]}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <Bar
                        dataKey="value"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}>
                        {[
                          <Cell key="cell-0" fill="hsl(var(--muted))" />,
                          <Cell key="cell-1" fill={category.color} />,
                          <Cell key="cell-2" fill="hsl(var(--secondary))" />,
                        ]}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
