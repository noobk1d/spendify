import { forwardRef } from "react"

const Button = forwardRef(({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-blue-200 text-blue-700 hover:bg-blue-50",
    ghost: "hover:bg-blue-100 hover:text-blue-700",
    link: "text-blue-700 underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10",
  }

  const variantStyle = variants[variant] || variants.default
  const sizeStyle = sizes[size] || sizes.default

  return (
    <button className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`} ref={ref} {...props}>
      {children}
    </button>
  )
})

Button.displayName = "Button"

export { Button }

