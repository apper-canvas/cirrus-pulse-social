import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { notificationService } from "@/services/api/notificationService"

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

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
      const updatedNotification = await notificationService.update(notificationId, { read: true })
      setNotifications(prev => 
        prev.map(n => n.Id === notificationId ? updatedNotification : n)
      )
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read)
      for (const notification of unreadNotifications) {
        await notificationService.update(notification.Id, { read: true })
      }
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err)
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

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read
    if (filter === "likes") return notification.type === "like"
    if (filter === "comments") return notification.type === "comment"
    if (filter === "friends") return notification.type === "friend_request"
    return true
  })

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 lg:w-96 bg-surface shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Bell" className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-gray-900">
              Notifications
            </h2>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full pulse-notification">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <ApperIcon name="X" className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 p-4 bg-gray-50/50">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "likes", label: "Likes" },
            { key: "comments", label: "Comments" },
            { key: "friends", label: "Friends" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-lg transition-all duration-150",
                filter === tab.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <ApperIcon name="AlertCircle" className="h-8 w-8 text-error mx-auto mb-2" />
              <p className="text-error text-sm mb-3">{error}</p>
              <Button size="sm" onClick={loadNotifications}>
                Try Again
              </Button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-6 text-center">
              <ApperIcon name="Bell" className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {filter === "all" ? "No notifications yet" : `No ${filter} notifications`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.Id}
                  className={cn(
                    "p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer",
                    !notification.read && "bg-primary/5 border-l-4 border-primary"
                  )}
                  onClick={() => !notification.read && markAsRead(notification.Id)}
                >
                  <div className="flex space-x-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      !notification.read ? "bg-primary/10" : "bg-gray-100"
                    )}>
                      <ApperIcon
                        name={getNotificationIcon(notification.type)}
                        className={cn("h-5 w-5", getNotificationColor(notification.type))}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm",
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NotificationPanel