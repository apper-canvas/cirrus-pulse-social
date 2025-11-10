import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/utils/cn"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Avatar from "@/components/atoms/Avatar"
import Button from "@/components/atoms/Button"

const PostCard = ({ post, onLike, onComment, className }) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes("1")) // Current user ID is "1"
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [likesCount, setLikesCount] = useState(post.likes.length)

  const handleLike = async () => {
    try {
      const newLikedState = !isLiked
      setIsLiked(newLikedState)
      setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)
      
      if (onLike) {
        await onLike(post.Id, newLikedState)
      }
      
      if (newLikedState) {
        toast.success("Post liked!", { autoClose: 1000 })
      }
    } catch (error) {
      // Revert optimistic update
      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1)
      toast.error("Failed to like post")
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      if (onComment) {
        await onComment(post.Id, commentText.trim())
      }
      setCommentText("")
      toast.success("Comment added!", { autoClose: 1000 })
    } catch (error) {
      toast.error("Failed to add comment")
    }
  }

  return (
    <div className={cn(
      "bg-surface rounded-xl shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200 hover:-translate-y-1",
      className
    )}>
      {/* Post Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center space-x-3">
          <Avatar
            src={post.author?.profilePicture}
            alt={post.author?.username}
            size="md"
            online={true}
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{post.author?.username}</h3>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
            {post.author?.bio && (
              <p className="text-xs text-gray-500 mt-1">{post.author.bio}</p>
            )}
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
            <ApperIcon name="MoreHorizontal" className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        {post.content && (
          <p className="text-gray-900 leading-relaxed">{post.content}</p>
        )}
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="px-4 pb-3">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full rounded-lg object-cover max-h-96 hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center space-x-2 transition-all duration-200 hover:scale-105",
                isLiked ? "text-primary" : "text-gray-500 hover:text-primary"
              )}
            >
              <ApperIcon
                name={isLiked ? "Heart" : "Heart"}
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isLiked ? "fill-current heart-pop" : ""
                )}
              />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-secondary transition-all duration-200 hover:scale-105"
            >
              <ApperIcon name="MessageCircle" className="h-5 w-5" />
              <span className="text-sm font-medium">{post.commentCount}</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-500 hover:text-accent transition-all duration-200 hover:scale-105">
              <ApperIcon name="Share" className="h-5 w-5" />
            </button>
          </div>

          <button className="text-gray-400 hover:text-gray-600 transition-colors duration-150">
            <ApperIcon name="Bookmark" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* Add Comment */}
          <form onSubmit={handleComment} className="mt-3">
            <div className="flex space-x-3">
              <Avatar size="sm" fallback="Y" />
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!commentText.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          </form>

          {/* Sample Comments */}
          <div className="mt-4 space-y-3">
            <div className="flex space-x-3">
              <Avatar size="sm" fallback="J" />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">jane_smith</span>
                    <span className="text-xs text-gray-500">2h</span>
                  </div>
                  <p className="text-sm text-gray-800">Great post! Thanks for sharing.</p>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <button className="text-xs text-gray-500 hover:text-primary font-medium">Like</button>
                  <button className="text-xs text-gray-500 hover:text-secondary font-medium">Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard