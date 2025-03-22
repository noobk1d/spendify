"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"

export function SpendingHeatmap({ timeframe }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Generate random spending data
  const generateSpendingData = () => {
    const data = {}
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())

    for (let i = 1; i <= daysInMonth; i++) {
      // Random spending between $0 and $200
      data[i] = Math.floor(Math.random() * 200)
    }

    return data
  }

  const spendingData = generateSpendingData()

  // Get color intensity based on spending amount
  const getColorIntensity = (amount) => {
    if (amount === 0) return "bg-gray-100"
    if (amount < 20) return "bg-green-100"
    if (amount < 50) return "bg-green-200"
    if (amount < 100) return "bg-green-300"
    if (amount < 150) return "bg-green-400"
    return "bg-green-500"
  }

  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Calendar rendering
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"]
  const monthName = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-6 w-6"></div>)
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const spending = spendingData[day] || 0
    calendarDays.push(
      <div key={day} className="relative flex h-6 w-6 items-center justify-center transition-transform hover:scale-110">
        <div
          className={`
            absolute inset-1 rounded-full transform transition-all duration-300
            ${getColorIntensity(spending)}
          `}
        ></div>
        <span className="relative z-10 text-[10px] font-medium">{day}</span>
      </div>,
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {monthName} {year}
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="icon" className="h-6 w-6" onClick={prevMonth}>
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-6 w-6" onClick={nextMonth}>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-[10px] font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {calendarDays}
      </div>

      <div className="flex justify-center flex-wrap gap-1 text-[10px]">
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-gray-100"></div>
          <span>$0</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-green-100"></div>
          <span>$1-20</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-green-200"></div>
          <span>$21-50</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-green-300"></div>
          <span>$51-100</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-green-400"></div>
          <span>$101-150</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>$150+</span>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

