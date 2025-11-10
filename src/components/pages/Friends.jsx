import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchInput from "@/components/molecules/SearchInput"
import UserCard from "@/components/molecules/UserCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { userService } from "@/services/api/userService"

const Friends = () => {
  const [users, setUsers] = useState([])
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("discover")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Load all users
      const allUsers = await userService.getAll()
      const filteredUsers = allUsers.filter(user => user.Id !== 1) // Exclude current user
      setUsers(filteredUsers)
      
      // Load current user's friends
      const userFriends = await userService.getFriends("1") // Current user ID
      setFriends(userFriends)
      
      // Load pending friend requests
      const pending = await userService.getPendingRequests("1")
      setPendingRequests(pending)
    } catch (err) {
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleFriendAction = async (userId, action) => {
    try {
      if (action === "add") {
        await userService.sendFriendRequest("1", userId.toString())
        toast.success("Friend request sent!")
      } else if (action === "accept") {
        await userService.acceptFriendRequest("1", userId.toString())
        // Move from pending to friends
        const acceptedUser = pendingRequests.find(u => u.Id === userId)
        if (acceptedUser) {
          setPendingRequests(prev => prev.filter(u => u.Id !== userId))
          setFriends(prev => [...prev, acceptedUser])
        }
        toast.success("Friend request accepted!")
      } else if (action === "reject") {
        await userService.rejectFriendRequest("1", userId.toString())
        setPendingRequests(prev => prev.filter(u => u.Id !== userId))
        toast.success("Friend request declined")
      } else if (action === "remove") {
        await userService.removeFriend("1", userId.toString())
        setFriends(prev => prev.filter(u => u.Id !== userId))
        toast.success("Friend removed")
      }
    } catch (err) {
      toast.error("Failed to update friendship")
      throw err // Re-throw to let UserCard handle the error state
    }
  }

  const handleMessage = (userId) => {
    // This would typically open a message conversation
    console.log("Message user:", userId)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const getUserRelationship = (user) => {
    if (friends.some(f => f.Id === user.Id)) return "friends"
    if (pendingRequests.some(p => p.Id === user.Id)) return "incoming"
    // Check if user has pending outgoing request (simplified)
    return "none"
  }

  const filterUsers = (userList) => {
    if (!searchQuery.trim()) return userList
    return userList.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  const getTabContent = () => {
    switch (activeTab) {
      case "discover":
        const discoverUsers = users.filter(user => !friends.some(f => f.Id === user.Id))
        const filteredDiscover = filterUsers(discoverUsers)
        
        return {
          users: filteredDiscover,
          emptyTitle: searchQuery ? "No users found" : "No new people to discover",
          emptyDescription: searchQuery 
            ? "Try adjusting your search terms" 
            : "You've discovered everyone! Check back later for new users.",
          emptyIcon: "Users"
        }
        
      case "friends":
        const filteredFriends = filterUsers(friends)
        
        return {
          users: filteredFriends,
          emptyTitle: searchQuery ? "No friends found" : "No friends yet",
          emptyDescription: searchQuery 
            ? "None of your friends match your search" 
            : "Start adding friends to build your network!",
          emptyIcon: "UserCheck"
        }
        
      case "requests":
        const filteredRequests = filterUsers(pendingRequests)
        
        return {
          users: filteredRequests,
          emptyTitle: searchQuery ? "No requests found" : "No pending requests",
          emptyDescription: searchQuery 
            ? "No friend requests match your search" 
            : "You don't have any pending friend requests right now.",
          emptyIcon: "UserPlus"
        }
        
      default:
        return { users: [], emptyTitle: "", emptyDescription: "", emptyIcon: "Users" }
    }
  }

  const tabContent = getTabContent()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="w-10 h-10 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Users" className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Friends
              </h1>
              <p className="text-gray-600 text-sm">
                Connect and stay in touch with your network
              </p>
            </div>
          </div>
          
          <div className="w-full sm:w-80">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search people..."
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary font-medium">Friends</p>
                <p className="text-2xl font-bold text-primary">{friends.length}</p>
              </div>
              <ApperIcon name="UserCheck" className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent font-medium">Pending Requests</p>
                <p className="text-2xl font-bold text-accent">{pendingRequests.length}</p>
              </div>
              <ApperIcon name="UserPlus" className="h-8 w-8 text-accent" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4 border border-secondary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary font-medium">Discover</p>
                <p className="text-2xl font-bold text-secondary">
                  {users.filter(u => !friends.some(f => f.Id === u.Id)).length}
                </p>
              </div>
              <ApperIcon name="Users" className="h-8 w-8 text-secondary" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 p-1 bg-gray-100 rounded-xl">
          {[
            { key: "discover", label: "Discover People", count: users.filter(u => !friends.some(f => f.Id === u.Id)).length },
            { key: "friends", label: "My Friends", count: friends.length },
            { key: "requests", label: "Friend Requests", count: pendingRequests.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150",
                activeTab === tab.key
                  ? "bg-surface text-primary shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <Loading type="users" />
        ) : error ? (
          <Error 
            message={error} 
            onRetry={loadData}
          />
        ) : tabContent.users.length === 0 ? (
          <Empty
            icon={tabContent.emptyIcon}
            title={tabContent.emptyTitle}
            description={tabContent.emptyDescription}
            actionLabel={activeTab === "discover" ? "Refresh" : undefined}
            onAction={activeTab === "discover" ? loadData : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tabContent.users.map((user) => (
              <UserCard
                key={user.Id}
                user={user}
                relationship={
                  activeTab === "requests" ? "incoming" : getUserRelationship(user)
                }
                onFriendAction={handleFriendAction}
                onMessage={handleMessage}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {tabContent.users.length > 0 && !loading && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load more people
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Friends