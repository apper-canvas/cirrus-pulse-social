import { formatDistanceToNow } from "date-fns"
import { cn } from "@/utils/cn"
import Avatar from "@/components/atoms/Avatar"

const ConversationCard = ({ conversation, isActive, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50",
        isActive && "bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary",
        className
      )}
    >
      <Avatar
src={conversation.otherUser?.profile_picture_c || ""}
         alt={conversation.otherUser?.username_c || "User"}
        size="md"
        online={conversation.otherUser.online}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={cn(
            "font-semibold truncate",
            conversation.unreadCount > 0 ? "text-gray-900" : "text-gray-800"
          )}>
{conversation.otherUser?.username_c || conversation.otherUser?.Name || "User"}
           </h3>
          <span className="text-xs text-gray-500">
{formatDistanceToNow(new Date(conversation.lastMessage?.createdAt || conversation.lastMessage?.CreatedOn), { addSuffix: true })}
           </span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-sm truncate",
            conversation.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-600"
          )}>
{(conversation.lastMessage?.senderId === conversation.currentUserId || conversation.lastMessage?.sender_id_c?.Id === conversation.currentUserId) && "You: "}
             {conversation.lastMessage?.content_c || conversation.lastMessage?.content}
          </p>
          
          {conversation.unreadCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full pulse-notification ml-2">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationCard