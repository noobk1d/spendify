import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

export function BudgetActualChart({ timeframe }) {
  // Mock data based on timeframe - now based on days/months as requested
  const data =
    timeframe === "weekly"
      ? [
          { day: "Mon", budget: 120, actual: 110 },
          { day: "Tue", budget: 120, actual: 130 },
          { day: "Wed", budget: 120, actual: 140 },
          { day: "Thu", budget: 120, actual: 100 },
          { day: "Fri", budget: 150, actual: 170 },
          { day: "Sat", budget: 200, actual: 190 },
          { day: "Sun", budget: 150, actual: 120 },
        ]
      : [
          { month: "Jan", budget: 3000, actual: 2800 },
          { month: "Feb", budget: 3000, actual: 3200 },
          { month: "Mar", budget: 3000, actual: 2900 },
          { month: "Apr", budget: 3000, actual: 3100 },
          { month: "May", budget: 3500, actual: 3400 },
          { month: "Jun", budget: 3500, actual: 3700 },
          { month: "Jul", budget: 3500, actual: 3300 },
          { month: "Aug", budget: 3500, actual: 3600 },
          { month: "Sep", budget: 4000, actual: 3800 },
          { month: "Oct", budget: 4000, actual: 4200 },
          { month: "Nov", budget: 4000, actual: 3900 },
          { month: "Dec", budget: 4500, actual: 4700 },
        ]

  const dataKey = timeframe === "weekly" ? "day" : "month"

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <XAxis dataKey={dataKey} tickLine={false} axisLine={false} tickMargin={10} />
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
          <Bar
            dataKey="budget"
            fill="hsl(220, 70%, 50%)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            className="transition-all hover:opacity-80"
            animationDuration={1500}
          />
          <Bar
            dataKey="actual"
            fill="hsl(160, 80%, 40%)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            className="transition-all hover:opacity-80"
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

