import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Avatar from "@/components/atoms/Avatar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { notificationService } from "@/services/api/notificationService"

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await notificationService.getAll()
      setNotifications(data)
    } catch (err) {
      setError("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.update(notificationId, { read: true })
      setNotifications(prev => 
        prev.map(n => n.Id === notificationId ? { ...n, read: true } : n)
      )
    } catch (err) {
      toast.error("Failed to mark notification as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead("1") // Current user ID
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success("All notifications marked as read")
    } catch (err) {
      toast.error("Failed to mark notifications as read")
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like": return "Heart"
      case "comment": return "MessageCircle"
      case "friend_request": return "UserPlus"
      case "post": return "FileText"
      case "message": return "Mail"
      default: return "Bell"
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "like": return "text-primary"
      case "comment": return "text-secondary"
      case "friend_request": return "text-accent"
      case "post": return "text-info"
      case "message": return "text-purple-500"
      default: return "text-gray-400"
    }
  }

  const getNotificationBgColor = (type) => {
    switch (type) {
      case "like": return "bg-primary/10"
      case "comment": return "bg-secondary/10"
      case "friend_request": return "bg-accent/10"
      case "post": return "bg-info/10"
      case "message": return "bg-purple-100"
      default: return "bg-gray-100"
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read
    if (filter === "likes") return notification.type === "like"
    if (filter === "comments") return notification.type === "comment"
    if (filter === "friends") return notification.type === "friend_request"
    if (filter === "messages") return notification.type === "message"
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Bell" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-gray-600 text-sm">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
          {[
            { key: "all", label: "All", count: notifications.length },
            { key: "unread", label: "Unread", count: unreadCount },
            { key: "likes", label: "Likes" },
            { key: "comments", label: "Comments" },
            { key: "friends", label: "Friends" },
            { key: "messages", label: "Messages" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex-1 min-w-0",
                filter === tab.key
                  ? "bg-surface text-primary shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface rounded-xl p-4 border border-gray-200/50 animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Error 
            message={error} 
            onRetry={loadNotifications}
          />
        ) : filteredNotifications.length === 0 ? (
          <Empty
            icon="Bell"
            title={filter === "all" ? "No notifications yet" : `No ${filter} notifications`}
            description={
              filter === "all" 
                ? "When you get notifications, they'll appear here" 
                : `You don't have any ${filter} notifications right now`
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.Id}
                className={cn(
                  "bg-surface rounded-xl p-4 border transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer",
                  !notification.read 
                    ? "border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5" 
                    : "border-gray-200/50"
                )}
                onClick={() => !notification.read && markAsRead(notification.Id)}
              >
                <div className="flex space-x-3">
                  {/* Notification Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    !notification.read 
                      ? getNotificationBgColor(notification.type)
                      : "bg-gray-100"
                  )}>
                    <ApperIcon
                      name={getNotificationIcon(notification.type)}
                      className={cn("h-5 w-5", getNotificationColor(notification.type))}
                    />
                  </div>
                  
                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm leading-relaxed",
                          !notification.read ? "font-semibold text-gray-900" : "text-gray-800"
                        )}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    
                    {/* Action Buttons for Friend Requests */}
                    {notification.type === "friend_request" && !notification.read && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Button size="xs" variant="primary">
                          Accept
                        </Button>
                        <Button size="xs" variant="outline">
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredNotifications.length > 0 && !loading && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load more notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications