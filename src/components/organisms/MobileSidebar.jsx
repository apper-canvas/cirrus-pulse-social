import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navigationItems = [
    {
      name: "Home Feed",
      path: "/",
      icon: "Home",
      exact: true
    },
    {
      name: "Messages",
      path: "/messages",
      icon: "MessageCircle",
      badge: 2
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: "Bell",
      badge: 5
    },
    {
      name: "Friends",
      path: "/friends",
      icon: "Users"
    },
    {
      name: "Profile",
      path: "/profile/1",
      icon: "User"
    }
  ]

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-80 bg-surface z-50 transform transition-transform duration-300 ease-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Pulse
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            <ApperIcon name="X" className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-6 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive(item.path, item.exact)
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center space-x-3">
                <ApperIcon
                  name={item.icon}
                  className={cn(
                    "h-5 w-5",
                    isActive(item.path, item.exact) ? "text-primary" : "text-gray-400"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full pulse-notification">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-t border-gray-200/50">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <ApperIcon name="Plus" className="h-4 w-4 mr-3 text-gray-400" />
              Create Post
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <ApperIcon name="UserPlus" className="h-4 w-4 mr-3 text-gray-400" />
              Find Friends
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default MobileSidebar