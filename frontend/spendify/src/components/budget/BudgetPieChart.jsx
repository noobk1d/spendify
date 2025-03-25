"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";
import { DollarSign } from "lucide-react";

const totalBudget = 2900;
const totalSpent = 2400;
const remainingBudget = totalBudget - totalSpent;
const spentPercentage = Math.round((totalSpent / totalBudget) * 100);

const pieData = [
  { name: "Spent", value: totalSpent },
  { name: "Remaining", value: remainingBudget },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

const CustomLabel = ({ viewBox, value1, value2 }) => {
  const { cx, cy } = viewBox;
  return (
    <>
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        className="text-2xl font-bold fill-foreground">
        ${value1}
      </text>
      <text
        x={cx}
        y={cy + 15}
        textAnchor="middle"
        className="text-sm fill-muted-foreground">
        {value2}
      </text>
    </>
  );
};

export function BudgetPieChart() {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex items-center gap-12">
        <div className="w-[300px] h-[300px] -ml-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="90%"
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationBegin={200}
                animationDuration={1500}
                className="animate-float-slow">
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={activeIndex === index ? "#fff" : "transparent"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                    className="transition-all duration-300 hover:opacity-90"
                  />
                ))}
                <Label
                  content={
                    <CustomLabel
                      value1={totalSpent}
                      value2={`${spentPercentage}% spent`}
                    />
                  }
                  position="center"
                />
              </Pie>
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  animation: "float 0.3s ease-out",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-lg font-bold">${totalBudget}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-lg font-bold">${totalSpent}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-lg font-bold">${remainingBudget}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
