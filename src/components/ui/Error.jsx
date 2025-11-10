import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="AlertCircle" className="h-8 w-8 text-error" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            size="sm"
            icon="RefreshCw"
            className="mx-auto"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

export default Error