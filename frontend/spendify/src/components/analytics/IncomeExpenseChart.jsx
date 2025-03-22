import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

export function IncomeExpenseChart({ timeframe }) {
  // Mock data based on timeframe
  const data =
    timeframe === "weekly"
      ? [
          { date: "Mon", income: 180, expense: 120 },
          { date: "Tue", income: 200, expense: 140 },
          { date: "Wed", income: 250, expense: 180 },
          { date: "Thu", income: 280, expense: 200 },
          { date: "Fri", income: 220, expense: 160 },
          { date: "Sat", income: 150, expense: 100 },
          { date: "Sun", income: 100, expense: 80 },
        ]
      : [
          { date: "Jan", income: 1200, expense: 900 },
          { date: "Feb", income: 1400, expense: 1000 },
          { date: "Mar", income: 1600, expense: 1200 },
          { date: "Apr", income: 1800, expense: 1400 },
          { date: "May", income: 2000, expense: 1500 },
          { date: "Jun", income: 2200, expense: 1600 },
          { date: "Jul", income: 2400, expense: 1800 },
          { date: "Aug", income: 2600, expense: 2000 },
          { date: "Sep", income: 2800, expense: 2200 },
          { date: "Oct", income: 3000, expense: 2400 },
          { date: "Nov", income: 3200, expense: 2600 },
          { date: "Dec", income: 3400, expense: 2800 },
        ]

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickFormatter={(value) => `$${value}`} tickLine={false} axisLine={false} tickMargin={10} />
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
            stroke="hsl(262, 80%, 50%)"
            strokeWidth={2}
            activeDot={{ r: 6, fill: "hsl(262, 80%, 50%)", className: "animate-pulse" }}
            dot={{ r: 4, fill: "hsl(262, 80%, 50%)" }}
            className="animate-float-slow"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="hsl(10, 80%, 60%)"
            strokeWidth={2}
            activeDot={{ r: 6, fill: "hsl(10, 80%, 60%)", className: "animate-pulse" }}
            dot={{ r: 4, fill: "hsl(10, 80%, 60%)" }}
            className="animate-float"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

