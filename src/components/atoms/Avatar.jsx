import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Avatar = forwardRef(({ 
  src, 
  alt, 
  size = "md", 
  className,
  fallback,
  online = false,
  ...props 
}, ref) => {
  const sizes = {
    xs: "h-6 w-6",
    sm: "h-8 w-8", 
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-20 w-20"
  }

  const iconSizes = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6",
    xl: "h-8 w-8",
    "2xl": "h-10 w-10"
  }

  const onlineIndicatorSizes = {
    xs: "h-2 w-2",
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-3 w-3", 
    xl: "h-4 w-4",
    "2xl": "h-5 w-5"
  }

  return (
    <div className={cn("relative inline-block", className)} ref={ref} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "rounded-full object-cover border-2 border-primary/20 transition-all duration-200 hover:scale-110",
            sizes[size]
          )}
        />
      ) : (
        <div className={cn(
          "rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-primary/20",
          sizes[size]
        )}>
          {fallback ? (
            <span className={cn(
              "text-gray-600 font-medium",
              size === "xs" ? "text-xs" : 
              size === "sm" ? "text-xs" :
              size === "md" ? "text-sm" :
              size === "lg" ? "text-base" :
              size === "xl" ? "text-lg" : "text-xl"
            )}>
              {fallback}
            </span>
          ) : (
            <ApperIcon 
              name="User" 
              className={cn("text-gray-400", iconSizes[size])} 
            />
          )}
        </div>
      )}
      
      {online && (
        <div className={cn(
          "absolute bottom-0 right-0 bg-success rounded-full border-2 border-white",
          onlineIndicatorSizes[size]
        )} />
      )}
    </div>
  )
})

Avatar.displayName = "Avatar"

export default Avatar