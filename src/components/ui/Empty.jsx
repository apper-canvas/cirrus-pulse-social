import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  icon = "FileText", 
  title = "Nothing here yet", 
  description = "Be the first to add something!", 
  actionLabel = "Get Started",
  onAction,
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} className="h-10 w-10 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-gray-600">
            {description}
          </p>
        </div>
        
        {onAction && (
          <Button
            onClick={onAction}
            variant="primary"
            size="md"
            className="mx-auto"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Empty