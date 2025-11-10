import ApperIcon from "@/components/ApperIcon"

const Loading = ({ type = "default", className = "" }) => {
  if (type === "posts") {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl shadow-sm border border-gray-200/50 p-4 animate-pulse">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-2 bg-gray-200 rounded w-1/6" />
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            
            {/* Image placeholder */}
            <div className="h-48 bg-gray-200 rounded-lg mb-4" />
            
            {/* Actions */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-8" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "users") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl shadow-sm border border-gray-200/50 p-4 animate-pulse">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "conversations") {
    return (
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-2 bg-gray-200 rounded w-12" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center space-y-4">
        <ApperIcon
          name="Loader2"
          className="h-8 w-8 text-primary mx-auto animate-spin"
        />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  )
}

export default Loading