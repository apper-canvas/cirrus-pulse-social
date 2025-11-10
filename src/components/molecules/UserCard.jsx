import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Avatar from "@/components/atoms/Avatar"
import Button from "@/components/atoms/Button"

const UserCard = ({ user, relationship = "none", onFriendAction, onMessage, className }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentRelationship, setCurrentRelationship] = useState(relationship)
  const navigate = useNavigate()

  const handleFriendAction = async (action) => {
    setIsLoading(true)
    try {
      if (onFriendAction) {
        await onFriendAction(user.Id, action)
      }

      // Update local state based on action
      if (action === "add") {
        setCurrentRelationship("pending")
        toast.success("Friend request sent!")
      } else if (action === "accept") {
        setCurrentRelationship("friends")
        toast.success("Friend request accepted!")
      } else if (action === "reject" || action === "remove") {
        setCurrentRelationship("none")
        toast.success("Friend removed")
      } else if (action === "cancel") {
        setCurrentRelationship("none")
        toast.success("Friend request cancelled")
      }
    } catch (error) {
      toast.error("Failed to update friendship")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMessage = () => {
    if (onMessage) {
      onMessage(user.Id)
    }
    navigate(`/messages/1-${user.Id}`)
  }

  const getFriendButton = () => {
    switch (currentRelationship) {
      case "friends":
        return (
          <Button
            variant="outline"
            size="sm"
            icon="Check"
            onClick={() => handleFriendAction("remove")}
            loading={isLoading}
            className="text-success border-success hover:bg-success hover:text-white"
          >
            Friends
          </Button>
        )
      case "pending":
        return (
          <Button
            variant="outline"
            size="sm"
            icon="Clock"
            onClick={() => handleFriendAction("cancel")}
            loading={isLoading}
            className="text-accent border-accent hover:bg-accent hover:text-white"
          >
            Pending
          </Button>
        )
      case "incoming":
        return (
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              icon="Check"
              onClick={() => handleFriendAction("accept")}
              loading={isLoading}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="X"
              onClick={() => handleFriendAction("reject")}
              loading={isLoading}
            >
              Decline
            </Button>
          </div>
        )
      default:
        return (
          <Button
            variant="primary"
            size="sm"
            icon="UserPlus"
            onClick={() => handleFriendAction("add")}
            loading={isLoading}
          >
            Add Friend
          </Button>
        )
    }
  }

  return (
    <div className={cn(
      "bg-surface rounded-xl shadow-sm border border-gray-200/50 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-1",
      className
    )}>
      {/* User Info */}
      <div className="flex items-start space-x-3 mb-3">
        <Avatar
          src={user.profilePicture}
          alt={user.username}
          size="lg"
          online={user.online}
          className="cursor-pointer"
          onClick={() => navigate(`/profile/${user.Id}`)}
        />
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold text-gray-900 hover:text-primary cursor-pointer transition-colors duration-150"
            onClick={() => navigate(`/profile/${user.Id}`)}
          >
            {user.username}
          </h3>
          {user.bio && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
          )}
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center">
              <ApperIcon name="Users" className="h-3 w-3 mr-1" />
              {user.friendsCount || 0} friends
            </span>
            <span className="flex items-center">
              <ApperIcon name="MapPin" className="h-3 w-3 mr-1" />
              {user.location || "Unknown"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {getFriendButton()}
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon="MessageCircle"
            onClick={handleMessage}
            className="text-secondary hover:text-secondary hover:bg-secondary/10"
          >
            Message
          </Button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
            <ApperIcon name="MoreHorizontal" className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserCard