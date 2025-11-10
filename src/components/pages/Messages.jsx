import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Avatar from "@/components/atoms/Avatar"
import ConversationCard from "@/components/molecules/ConversationCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { messageService } from "@/services/api/messageService"
import { userService } from "@/services/api/userService"

const Messages = () => {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId)
    }
  }, [conversationId])

  const loadConversations = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await messageService.getConversations("1") // Current user ID
      setConversations(data)
    } catch (err) {
      setError("Failed to load conversations")
    } finally {
      setLoading(false)
    }
  }

  const loadConversation = async (convId) => {
    try {
      setMessagesLoading(true)
      const conversationMessages = await messageService.getByConversationId(convId)
      setMessages(conversationMessages)
      
      // Find conversation info
      const conv = conversations.find(c => c.conversationId === convId)
      if (conv) {
        setActiveConversation(conv)
        // Mark conversation as read
        await messageService.markConversationAsRead(convId, "1")
      } else {
        // Load conversation info if not in list
        const userIds = convId.split("-")
        const otherUserId = userIds.find(id => id !== "1")
        if (otherUserId) {
          const otherUser = await userService.getById(otherUserId)
          setActiveConversation({
            conversationId: convId,
            otherUser: {
              Id: otherUser.Id,
              username: otherUser.username,
              profilePicture: otherUser.profilePicture,
              online: otherUser.online
            }
          })
        }
      }
    } catch (err) {
      toast.error("Failed to load conversation")
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversationId) return

    try {
      const message = {
        conversationId,
        senderId: "1", // Current user ID
        content: newMessage.trim(),
        read: false,
        createdAt: new Date().toISOString()
      }

      const createdMessage = await messageService.create(message)
      setMessages(prev => [...prev, createdMessage])
      setNewMessage("")
      
      // Update conversation in list
      setConversations(prev => prev.map(conv => 
        conv.conversationId === conversationId 
          ? { ...conv, lastMessage: createdMessage, updatedAt: createdMessage.createdAt }
          : conv
      ))
    } catch (err) {
      toast.error("Failed to send message")
    }
  }

  const handleConversationClick = (conversation) => {
    navigate(`/messages/${conversation.conversationId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Conversations Sidebar */}
          <div className="w-80 bg-surface border-r border-gray-200/50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-gray-900">
                  Messages
                </h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                  <ApperIcon name="Edit3" className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {loading ? (
                <div className="p-4">
                  <Loading type="conversations" />
                </div>
              ) : error ? (
                <div className="p-4">
                  <Error message={error} onRetry={loadConversations} />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4">
                  <Empty
                    icon="MessageCircle"
                    title="No conversations yet"
                    description="Start messaging your friends!"
                    actionLabel="Find Friends"
                    onAction={() => navigate("/friends")}
                  />
                </div>
              ) : (
                <div className="py-2">
                  {conversations.map((conversation) => (
                    <ConversationCard
                      key={conversation.conversationId}
                      conversation={conversation}
                      isActive={conversationId === conversation.conversationId}
                      onClick={() => handleConversationClick(conversation)}
                      className="mx-2 mb-2"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {!conversationId ? (
              /* No Conversation Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <ApperIcon name="MessageCircle" className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a conversation from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                {activeConversation && (
                  <div className="p-4 border-b border-gray-200/50 bg-surface">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                          onClick={() => navigate("/messages")}
                        >
                          <ApperIcon name="ArrowLeft" className="h-5 w-5 text-gray-600" />
                        </button>
                        <Avatar
                          src={activeConversation.otherUser.profilePicture}
                          alt={activeConversation.otherUser.username}
                          size="md"
                          online={activeConversation.otherUser.online}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {activeConversation.otherUser.username}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {activeConversation.otherUser.online ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                          <ApperIcon name="Phone" className="h-5 w-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                          <ApperIcon name="Video" className="h-5 w-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                          <ApperIcon name="MoreVertical" className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                  {messagesLoading ? (
                    <div className="flex justify-center">
                      <ApperIcon name="Loader2" className="h-6 w-6 text-primary animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <ApperIcon name="MessageCircle" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.Id}
                        className={cn(
                          "flex",
                          message.senderId === "1" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-xs lg:max-w-md px-4 py-2 rounded-xl text-sm",
                            message.senderId === "1"
                              ? "bg-gradient-to-r from-primary to-primary/90 text-white rounded-br-sm"
                              : "bg-white text-gray-900 shadow-sm border border-gray-200/50 rounded-bl-sm"
                          )}
                        >
                          <p>{message.content}</p>
                          <p className={cn(
                            "text-xs mt-1",
                            message.senderId === "1" ? "text-white/70" : "text-gray-500"
                          )}>
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200/50 bg-surface">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                    >
                      <ApperIcon name="Paperclip" className="h-5 w-5 text-gray-600" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-4 py-3 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all duration-150"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-150"
                      >
                        <ApperIcon name="Smile" className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                    
                    <Button
                      type="submit"
                      size="md"
                      disabled={!newMessage.trim()}
                      className="rounded-full px-4"
                    >
                      <ApperIcon name="Send" className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages