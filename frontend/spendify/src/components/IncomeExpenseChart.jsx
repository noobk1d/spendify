"use client";

export function IncomeExpenseChart() {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const incomeData = [3200, 3500, 3700, 3400, 3800, 4200];
  const expenseData = [2700, 2900, 3100, 2800, 3200, 3400];

  // Increase minValue slightly to push lines upward, creating space below
  const minValue = Math.min(...incomeData, ...expenseData) * 0.96; // More space below
  const maxValue = Math.max(...incomeData, ...expenseData) * 1.02; // Keeps slight top spacing

  const getPointY = (value) =>
    92 - ((value - minValue) / (maxValue - minValue)) * 70; // Adjusted for gap below

  const generateLinePath = (data) =>
    data
      .map((value, index) => {
        const x = (index * 85) / (data.length - 1) + 8; // Keeps proper width
        const y = getPointY(value);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  return (
    <div className="h-full w-full flex flex-col">
      {/* Legend */}
      <div className="flex justify-center space-x-4 mb-2 text-xs text-slate-600">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
          <span>Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div>
          <span>Expense</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-[75%] mx-auto h-[190px] max-h-[200px]">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none">
          {/* Income & Expense Paths */}
          <path
            d={generateLinePath(incomeData)}
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={generateLinePath(expenseData)}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Income & Expense Dots */}
          {[incomeData, expenseData].map((data, dataIndex) =>
            data.map((value, index) => {
              const x = (index * 85) / (data.length - 1) + 8;
              const y = getPointY(value);
              return (
                <circle
                  key={`${dataIndex}-${index}`}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill={dataIndex === 0 ? "#a855f7" : "#60a5fa"}
                  stroke="white"
                  strokeWidth="0.8"
                />
              );
            })
          )}
        </svg>

        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 text-[10px] text-slate-500">
          {months.map((month) => (
            <div key={month}>{month}</div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white p-2 rounded-lg shadow text-center">
          <p className="text-slate-500">Total Income</p>
          <p className="text-lg font-bold text-slate-800">$21,800</p>
          <p className="text-green-600">+12% from last period</p>
        </div>
        <div className="bg-white p-2 rounded-lg shadow text-center">
          <p className="text-slate-500">Total Expense</p>
          <p className="text-lg font-bold text-slate-800">$18,100</p>
          <p className="text-red-600">+8% from last period</p>
        </div>
      </div>
    </div>
  );
}
