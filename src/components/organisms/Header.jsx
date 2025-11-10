import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchInput from "@/components/molecules/SearchInput"

const Header = ({ onMobileMenuClick, onNotificationClick, onChatOpen }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (query) => {
    console.log("Searching for:", query)
    // In a real app, this would trigger search functionality
  }

  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const currentUser = {
    id: "1",
    username: "john_doe",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-b border-gray-200/50 z-40">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <ApperIcon name="Menu" className="h-6 w-6 text-gray-600" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Pulse
              </span>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search Pulse..."
              className="w-full"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Search Icon for Mobile */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150">
              <ApperIcon name="Search" className="h-5 w-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <button
              onClick={onNotificationClick}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <ApperIcon name="Bell" className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center pulse-notification">
                3
              </span>
            </button>

            {/* Messages */}
            <button
              onClick={() => navigate("/messages")}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <ApperIcon name="MessageCircle" className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-secondary text-white text-xs rounded-full flex items-center justify-center pulse-notification">
                2
              </span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={handleProfileMenuToggle}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-all duration-150 hover:scale-105"
              >
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-full border-2 border-primary/20"
                />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-gray-200/50 py-2 z-50">
                  <Link
                    to={`/profile/${currentUser.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <ApperIcon name="User" className="h-4 w-4 mr-3 text-gray-400" />
                    Your Profile
                  </Link>
                  <Link
                    to="/friends"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <ApperIcon name="Users" className="h-4 w-4 mr-3 text-gray-400" />
                    Friends
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <ApperIcon name="Settings" className="h-4 w-4 mr-3 text-gray-400" />
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header