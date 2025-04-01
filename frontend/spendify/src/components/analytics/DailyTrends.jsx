"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function DailyTrends({ data, timeframe }) {
  if (!data) return null;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % data.labels.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + data.labels.length) % data.labels.length
    );
  };

  const activeItem = {
    day: data.labels[activeIndex],
    amount: data.data[activeIndex].amount,
    categories: data.data[activeIndex].categories,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="text-xs bg-muted rounded-full w-5 h-5 flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
          &lt;
        </button>
        <div className="text-sm font-medium">{activeItem.day}</div>
        <button
          onClick={handleNext}
          className="text-xs bg-muted rounded-full w-5 h-5 flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
          &gt;
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex flex-col items-center p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg transform transition-all duration-300 hover:scale-105 animate-float-slow">
          <div className="text-2xl font-bold mt-1">${activeItem.amount}</div>

          {/* Categories */}
          {activeItem.categories.length > 0 && (
            <div className="mt-2 w-full">
              <div className="text-xs text-muted-foreground mb-1">
                Categories:
              </div>
              <div className="space-y-1">
                {activeItem.categories.map((category, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs">
                    <span className="capitalize">{category.category}</span>
                    <span className="text-muted-foreground">
                      ${category.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center mt-2 space-x-1">
            {data.labels.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 w-1 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? "bg-primary w-3" : "bg-muted"
                }`}></div>
            ))}
          </div>
        </div>

        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground/30">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
}
