import { forwardRef } from "react"

const Card = forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div ref={ref} className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
})

Card.displayName = "Card"

export { Card }

