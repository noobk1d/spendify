"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

export function DailyTrends({ timeframe }) {
  // Mock data based on timeframe
  const data =
    timeframe === "weekly"
      ? [
          { day: "Mon", date: "Mar 4", spending: 45, category: "Food" },
          { day: "Tue", date: "Mar 5", spending: 35, category: "Transport" },
          { day: "Wed", date: "Mar 6", spending: 55, category: "Shopping" },
          { day: "Thu", date: "Mar 7", spending: 40, category: "Entertainment" },
          { day: "Fri", date: "Mar 8", spending: 70, category: "Dining" },
          { day: "Sat", date: "Mar 9", spending: 85, category: "Shopping" },
          { day: "Sun", date: "Mar 10", spending: 30, category: "Groceries" },
        ]
      : [
          { day: "Week 1", date: "Mar 1-7", spending: 250, category: "Mixed" },
          { day: "Week 2", date: "Mar 8-14", spending: 320, category: "Mixed" },
          { day: "Week 3", date: "Mar 15-21", spending: 280, category: "Mixed" },
          { day: "Week 4", date: "Mar 22-28", spending: 350, category: "Mixed" },
        ]

  const [activeIndex, setActiveIndex] = useState(0)

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % data.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + data.length) % data.length)
  }

  const activeItem = data[activeIndex]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="text-xs bg-muted rounded-full w-5 h-5 flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
        >
          &lt;
        </button>
        <div className="text-sm font-medium">{activeItem.day}</div>
        <button
          onClick={handleNext}
          className="text-xs bg-muted rounded-full w-5 h-5 flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
        >
          &gt;
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex flex-col items-center p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg transform transition-all duration-300 hover:scale-105 animate-float-slow">
          <div className="text-xs text-muted-foreground">{activeItem.date}</div>
          <div className="text-2xl font-bold mt-1">${activeItem.spending}</div>
          <div className="flex items-center mt-1 text-xs">
            <span className="px-2 py-0.5 bg-primary/20 rounded-full">{activeItem.category}</span>
          </div>

          <div className="flex items-center justify-center mt-2 space-x-1">
            {data.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 w-1 rounded-full transition-all duration-300 ${idx === activeIndex ? "bg-primary w-3" : "bg-muted"}`}
              ></div>
            ))}
          </div>
        </div>

        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground/30">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  )
}

