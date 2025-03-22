import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "../../../lib/utils";

function Calendar({
  selected,
  onSelect,
  className,
  mode = "single",
  showOutsideDays = true,
  ...props
}) {
  const isRangeMode = mode === "range";

  const handleDateChange = (dates) => {
    if (isRangeMode) {
      const [start, end] = dates;
      onSelect({ from: start, to: end });
    } else {
      onSelect(dates);
    }
  };

  return (
    <div className={cn("calendar-wrapper", className)}>
      <DatePicker
        selected={isRangeMode ? selected?.from : selected}
        onChange={handleDateChange}
        startDate={isRangeMode ? selected?.from : null}
        endDate={isRangeMode ? selected?.to : null}
        selectsRange={isRangeMode}
        inline
        monthsShown={isRangeMode ? 2 : 1}
        showPopperArrow={false}
        calendarClassName="shadow-lg border border-gray-200 rounded-lg"
        dateFormat="MMMM d, yyyy"
        {...props}
      />
      <style jsx global>{`
        .calendar-wrapper .react-datepicker {
          font-family: inherit;
          border: none;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .calendar-wrapper .react-datepicker__month-container {
          float: none;
          background: white;
        }
        .calendar-wrapper .react-datepicker__header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding-top: 1rem;
        }
        .calendar-wrapper .react-datepicker__day-name {
          color: #6b7280;
          font-weight: 500;
          width: 2.5rem;
          margin: 0;
        }
        .calendar-wrapper .react-datepicker__day {
          width: 2.5rem;
          height: 2.5rem;
          line-height: 2.5rem;
          margin: 0;
          color: #374151;
          border-radius: 9999px;
        }
        .calendar-wrapper .react-datepicker__day:hover {
          background-color: #f3f4f6;
        }
        .calendar-wrapper .react-datepicker__day--selected,
        .calendar-wrapper .react-datepicker__day--in-selecting-range,
        .calendar-wrapper .react-datepicker__day--in-range {
          background-color: #6366f1;
          color: white;
        }
        .calendar-wrapper .react-datepicker__day--keyboard-selected {
          background-color: #e0e7ff;
          color: #4f46e5;
        }
        .calendar-wrapper
          .react-datepicker__day--in-selecting-range:not(
            .react-datepicker__day--in-range
          ) {
          background-color: rgba(99, 102, 241, 0.3);
        }
        .calendar-wrapper .react-datepicker__day--outside-month {
          color: #9ca3af;
        }
        .calendar-wrapper .react-datepicker__navigation {
          top: 1rem;
        }
        .calendar-wrapper .react-datepicker__navigation-icon::before {
          border-color: #6b7280;
        }
        .calendar-wrapper .react-datepicker__current-month {
          color: #111827;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
