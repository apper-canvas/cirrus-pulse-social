import { NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { postService } from "@/services/api/postService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Friends from "@/components/pages/Friends";
import PostComposer from "@/components/molecules/PostComposer";

const Sidebar = () => {
  const navigate = useNavigate()
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)

  const handleCreatePost = async (postData) => {
    try {
      await postService.create(postData)
      toast.success('Post created successfully!')
      setIsPostModalOpen(false)
      navigate('/') // Navigate to home to see the new post
    } catch (error) {
      toast.error('Failed to create post. Please try again.')
    }
  }
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

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-surface border-r border-gray-200/50 overflow-y-auto scrollbar-hide">
      <div className="p-6 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105",
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
<button 
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150"
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-3 text-gray-400" />
            Create Post
          </button>

          {/* Post Creation Modal */}
          {isPostModalOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setIsPostModalOpen(false)}
            >
              <div 
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Create Post</h2>
                    <button
                      onClick={() => setIsPostModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ApperIcon name="X" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <PostComposer 
                    onCreatePost={handleCreatePost}
                    className="border-0 shadow-none"
                  />
                </div>
              </div>
            </div>
          )}
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150">
            <ApperIcon name="UserPlus" className="h-4 w-4 mr-3 text-gray-400" />
            Find Friends
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200/50">
        <p className="text-xs text-gray-400 text-center">
          © 2024 Pulse. Stay connected.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar