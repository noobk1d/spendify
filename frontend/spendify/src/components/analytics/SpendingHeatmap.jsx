"use client";

import { useState } from "react";

export function SpendingHeatmap({ data, timeframe }) {
  if (!data) return null;

  const [currentDate] = useState(new Date());

  // Get color intensity based on spending amount
  const getColorIntensity = (amount) => {
    if (amount === 0) return "bg-gray-100";
    if (amount < 100) return "bg-green-100";
    if (amount < 200) return "bg-green-200";
    if (amount < 300) return "bg-green-300";
    if (amount < 400) return "bg-green-400";
    return "bg-green-500";
  };

  const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  // Generate calendar days based on timeframe
  const renderDays = () => {
    if (timeframe === "weekly") {
      // For weekly view, show a single row of days
      return (
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className="flex h-6 w-6 items-center justify-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {Array.isArray(data.data) &&
            data.data.map((spending, index) => (
              <div
                key={index}
                className="relative flex h-6 w-6 items-center justify-center transition-transform hover:scale-110">
                <div
                  className={`
                  absolute inset-1 rounded-full transform transition-all duration-300
                  ${getColorIntensity(spending)}
                `}></div>
                <span className="relative z-10 text-[10px] font-medium">
                  {index + 1}
                </span>
              </div>
            ))}
        </div>
      );
    } else {
      // For monthly view, show 4 weeks of data
      return (
        <div className="space-y-1">
          {Array.isArray(data.data) &&
            data.data.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {Array.isArray(week) &&
                  week.map((spending, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="relative flex h-6 w-6 items-center justify-center transition-transform hover:scale-110">
                      <div
                        className={`
                      absolute inset-1 rounded-full transform transition-all duration-300
                      ${getColorIntensity(spending)}
                    `}></div>
                      <span className="relative z-10 text-[10px] font-medium">
                        {weekIndex * 7 + dayIndex + 1}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">
        {monthName} {year}
      </div>
      {renderDays()}
    </div>
  );
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
