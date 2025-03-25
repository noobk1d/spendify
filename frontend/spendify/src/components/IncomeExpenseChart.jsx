"use client";

import React from "react";

export function IncomeExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  // Transform the data into arrays for the chart
  const dates = Object.keys(data || {}).map((date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  );
  const incomeData = Object.values(data || {}).map(
    (values) => values.income || 0
  );
  const expenseData = Object.values(data || {}).map(
    (values) => values.expense || 0
  );

  // Calculate min and max values for scaling
  const minValue = Math.min(...incomeData, ...expenseData) * 0.96;
  const maxValue = Math.max(...incomeData, ...expenseData) * 1.02;

  // Function to calculate Y position with more space at bottom
  const getPointY = (value) =>
    85 - ((value - minValue) / (maxValue - minValue)) * 65;

  // Function to generate line path
  const generateLinePath = (data) =>
    data
      .map((value, index) => {
        const x = (index * 80) / (data.length - 1) + 15;
        const y = getPointY(value);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  // Generate Y-axis labels
  const yAxisLabels = [];
  const numLabels = 5;
  for (let i = 0; i < numLabels; i++) {
    const value = minValue + ((maxValue - minValue) * i) / (numLabels - 1);
    yAxisLabels.push(value);
  }

  return (
    <div className="relative h-full">
      <div className="flex justify-center gap-8 mb-4">
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
      <div className="relative w-full md:w-[85%] lg:w-[75%] mx-auto h-[150px] md:h-[170px] lg:h-[190px]">
        {/* Y-axis Labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-[10px] text-slate-500">
          {yAxisLabels.map((value, index) => (
            <div key={index} className="transform -translate-y-1/2">
              ${value.toFixed(0)}
            </div>
          ))}
        </div>

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none">
          {/* Grid Lines */}
          {yAxisLabels.map((_, index) => {
            const y = 85 - (index * 65) / (numLabels - 1);
            return (
              <line
                key={`grid-${index}`}
                x1="15"
                y1={y}
                x2="95"
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="0.5"
                className="opacity-50"
              />
            );
          })}

          {/* Income & Expense Paths */}
          <path
            d={generateLinePath(incomeData)}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-line"
          />
          <path
            d={generateLinePath(expenseData)}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-line"
          />

          {/* Income & Expense Dots */}
          {[incomeData, expenseData].map((data, dataIndex) =>
            data.map((value, index) => {
              const x = (index * 80) / (data.length - 1) + 15;
              const y = getPointY(value);
              return (
                <circle
                  key={`${dataIndex}-${index}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={dataIndex === 0 ? "#a855f7" : "#60a5fa"}
                  stroke="white"
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
              );
            })
          )}
        </svg>

        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-[15%] right-0 flex justify-between text-[10px] text-slate-500 mt-2">
          {dates.map((date) => (
            <div key={date} className="transform -translate-x-1/2">
              {date}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section - Slightly Bigger Cards */}
      <div className="flex justify-center gap-6 mt-4 px-2">
        <div className="flex-1 max-w-[180px] bg-white p-3 rounded-lg border border-slate-100 text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total Income</span>
            <span className="text-sm text-green-600">+12%</span>
          </div>
          <p className="text-base font-semibold text-slate-800 mt-2">
            ${incomeData.reduce((a, b) => a + b, 0).toFixed(2)}
          </p>
        </div>
        <div className="flex-1 max-w-[180px] bg-white p-3 rounded-lg border border-slate-100 text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total Expense</span>
            <span className="text-sm text-red-600">+8%</span>
          </div>
          <p className="text-base font-semibold text-slate-800 mt-2">
            ${expenseData.reduce((a, b) => a + b, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
