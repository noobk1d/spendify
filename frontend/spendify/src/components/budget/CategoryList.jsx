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

const iconMap = {
  Home,
  Utensils,
  Car,
  Film,
  ShoppingBag,
};

export function CategoryList({ categories, onEditCategory, onDeleteCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium capitalize">{category.category}</h3>
                <p className="text-sm text-gray-500">
                  {formatCurrency(category.spent)} /{" "}
                  {formatCurrency(category.limit)}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-full rounded-full ${
                  category.spent > category.limit
                    ? "bg-red-500"
                    : "bg-purple-500"
                }`}
                style={{
                  width: `${Math.min(
                    (category.spent / category.limit) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Spent: {formatCurrency(category.spent)}</span>
              <span>
                Remaining: {formatCurrency(category.limit - category.spent)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onEditCategory(category)}
              className="p-2 text-gray-500 hover:text-purple-600 rounded-full hover:bg-purple-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={() => onDeleteCategory(category.id)}
              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
