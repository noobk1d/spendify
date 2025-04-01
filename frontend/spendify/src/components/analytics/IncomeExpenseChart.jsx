import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export function IncomeExpenseChart({ data, timeframe }) {
  if (!data) return null;

  // Transform the API data into the format expected by the chart
  const chartData = data.labels.map((label, index) => ({
    date: label,
    income: data.income[index],
    expense: data.expenses[index],
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <Tooltip
            formatter={(value) => [`$${value}`, undefined]}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              animation: "float 0.3s ease-out",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="hsl(262, 80%, 50%)"
            strokeWidth={2}
            activeDot={{
              r: 6,
              fill: "hsl(262, 80%, 50%)",
              className: "animate-pulse",
            }}
            dot={{ r: 4, fill: "hsl(262, 80%, 50%)" }}
            className="animate-float-slow"
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="hsl(10, 80%, 60%)"
            strokeWidth={2}
            activeDot={{
              r: 6,
              fill: "hsl(10, 80%, 60%)",
              className: "animate-pulse",
            }}
            dot={{ r: 4, fill: "hsl(10, 80%, 60%)" }}
            className="animate-float"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
