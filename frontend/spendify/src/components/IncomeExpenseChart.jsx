"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function IncomeExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  // Transform the data into the format Recharts expects
  const chartData = Object.entries(data).map(([date, values]) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    income: values.income || 0,
    expense: values.expense || 0,
  }));

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
          <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  entry.name === "income" ? "bg-purple-500" : "bg-blue-500"
                }`}
              />
              <span className="text-sm text-slate-600 capitalize">
                {entry.name}:
              </span>
              <span className="text-sm font-medium text-slate-700">
                ${entry.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate totals
  const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = chartData.reduce((sum, item) => sum + item.expense, 0);

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-center gap-8 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-sm text-gray-600">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">Expense</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full md:w-[95%] lg:w-[90%] mx-auto h-[110px] md:h-[130px] lg:h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#8b5cf6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              fillOpacity={1}
              fill="url(#incomeGradient)"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#3b82f6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              fillOpacity={1}
              fill="url(#expenseGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Section - Enhanced Cards */}
      <div className="flex justify-center gap-8 mt-6 px-4">
        <div className="flex-1 max-w-[200px] bg-white p-4 rounded-xl border border-slate-100 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-100 group">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-slate-600">
                Total Income
              </span>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-xl font-semibold text-slate-800 mt-2 group-hover:text-purple-600 transition-colors">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="flex-1 max-w-[200px] bg-white p-4 rounded-xl border border-slate-100 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-100 group">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-slate-600">
                Total Expense
              </span>
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              +8%
            </span>
          </div>
          <p className="text-xl font-semibold text-slate-800 mt-2 group-hover:text-blue-600 transition-colors">
            ${totalExpense.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
