import { useState, useEffect, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { messageService } from "@/services/api/messageService"
import { userService } from "@/services/api/userService"

const ChatWindow = ({ conversationId, onClose }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [otherUser, setOtherUser] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadConversation()
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversation = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Load messages for this conversation
      const allMessages = await messageService.getAll()
      const conversationMessages = allMessages.filter(msg => msg.conversationId === conversationId)
      setMessages(conversationMessages)

      // Load other user info (assuming conversationId format like "user1-user2")
      const userIds = conversationId.split("-")
      const otherUserId = userIds.find(id => id !== "1") // Current user is ID 1
      if (otherUserId) {
        const user = await userService.getById(otherUserId)
        setOtherUser(user)
      }
    } catch (err) {
      setError("Failed to load conversation")
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

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
    } catch (err) {
      setError("Failed to send message")
    }
  }

  return (
    <div className={cn(
      "fixed bottom-0 right-4 w-80 bg-surface rounded-t-xl shadow-2xl border border-gray-200/50 z-50 transition-all duration-300",
      isMinimized ? "h-12" : "h-96"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200/50 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-t-xl">
        <div className="flex items-center space-x-2">
          {otherUser && (
            <>
              <img
                src={otherUser.profilePicture}
                alt={otherUser.username}
                className="w-8 h-8 rounded-full border-2 border-secondary/20"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{otherUser.username}</p>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-gray-100 transition-colors duration-150"
          >
            <ApperIcon
              name={isMinimized ? "Maximize2" : "Minimize2"}
              className="h-4 w-4 text-gray-600"
            />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors duration-150"
          >
            <ApperIcon name="X" className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 h-72 scrollbar-hide">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-2 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <ApperIcon name="AlertCircle" className="h-6 w-6 text-error mx-auto mb-2" />
                <p className="text-error text-sm">{error}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="MessageCircle" className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Start your conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.Id}
                    className={cn(
                      "flex",
                      message.senderId === "1" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs px-3 py-2 rounded-lg text-sm",
                        message.senderId === "1"
                          ? "bg-gradient-to-r from-primary to-primary/90 text-white"
                          : "bg-gray-100 text-gray-900"
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
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200/50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!newMessage.trim()}
                className="px-3"
              >
                <ApperIcon name="Send" className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default ChatWindow