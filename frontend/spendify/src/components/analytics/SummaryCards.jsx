import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"

export function SummaryCards({ timeframe }) {
  // Mock data based on timeframe
  const data =
    timeframe === "weekly"
      ? { income: 1250, expense: 850, savings: 400 }
      : { income: 5200, expense: 3800, savings: 1400 }

  return (
    <>
      <div className="col-span-1 transform transition-all hover:scale-105 hover:shadow-md rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-3">
        <div className="text-xs font-medium text-muted-foreground">Total Income</div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <DollarSign className="mr-1 h-3 w-3 text-blue-500" />
            <span className="text-lg font-bold">${data.income.toLocaleString()}</span>
          </div>
          <div className="flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            <ArrowUpIcon className="mr-1 h-2 w-2" />
            <span>12%</span>
          </div>
        </div>
      </div>

      <div className="col-span-1 transform transition-all hover:scale-105 hover:shadow-md rounded-lg bg-gradient-to-br from-red-50 to-red-100 p-3">
        <div className="text-xs font-medium text-muted-foreground">Total Expense</div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <DollarSign className="mr-1 h-3 w-3 text-red-500" />
            <span className="text-lg font-bold">${data.expense.toLocaleString()}</span>
          </div>
          <div className="flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
            <ArrowUpIcon className="mr-1 h-2 w-2" />
            <span>8%</span>
          </div>
        </div>
      </div>

      <div className="col-span-1 transform transition-all hover:scale-105 hover:shadow-md rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-3">
        <div className="text-xs font-medium text-muted-foreground">Net Savings</div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <DollarSign className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-lg font-bold">${data.savings.toLocaleString()}</span>
          </div>
          <div
            className={`
            flex items-center rounded-full px-2 py-0.5 text-xs font-medium
            ${data.savings > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          `}
          >
            {data.savings > 0 ? (
              <>
                <ArrowUpIcon className="mr-1 h-2 w-2" />
                <span>18%</span>
              </>
            ) : (
              <>
                <ArrowDownIcon className="mr-1 h-2 w-2" />
                <span>5%</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-1 transform transition-all hover:scale-105 hover:shadow-md rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-3">
        <div className="text-xs font-medium text-muted-foreground">Average Daily</div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <DollarSign className="mr-1 h-3 w-3 text-primary" />
            <span className="text-lg font-bold">
              ${Math.round(data.expense / (timeframe === "weekly" ? 7 : 30)).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
            <span>Daily</span>
          </div>
        </div>
      </div>
    </>
  )
}

