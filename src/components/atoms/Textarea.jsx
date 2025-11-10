import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Textarea = forwardRef(({ 
  className, 
  error = false,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <textarea
      rows={rows}
      className={cn(
        "flex w-full px-3 py-2 text-sm bg-white border rounded-lg transition-all duration-200",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none",
        error
          ? "border-error focus:border-error focus:ring-error/20"
          : "border-gray-200 focus:border-secondary focus:ring-secondary/20",
        "hover:border-gray-300",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export default Textarea