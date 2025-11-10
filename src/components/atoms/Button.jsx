import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/90 text-white shadow-sm hover:shadow-md hover:scale-105 focus:ring-primary/50 border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary to-secondary/90 text-white shadow-sm hover:shadow-md hover:scale-105 focus:ring-secondary/50 border border-secondary/20",
    accent: "bg-gradient-to-r from-accent to-accent/90 text-gray-900 shadow-sm hover:shadow-md hover:scale-105 focus:ring-accent/50 border border-accent/20",
    outline: "border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-200",
    danger: "bg-gradient-to-r from-error to-error/90 text-white shadow-sm hover:shadow-md hover:scale-105 focus:ring-error/50 border border-error/20"
  }
  
  const sizes = {
    xs: "px-2 py-1 text-xs rounded-md",
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl",
    xl: "px-8 py-4 text-lg rounded-xl"
  }

  const iconSizes = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6"
  }

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon
          name="Loader2"
          className={cn("animate-spin", iconSizes[size], children ? "mr-2" : "")}
        />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon
          name={icon}
          className={cn(iconSizes[size], children ? "mr-2" : "")}
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon
          name={icon}
          className={cn(iconSizes[size], children ? "ml-2" : "")}
        />
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button