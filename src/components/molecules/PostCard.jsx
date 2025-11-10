import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { commentService } from "@/services/api/commentService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const PostCard = ({ post, onUpdate, className }) => {
  const { user } = useSelector((state) => state.user)
  const currentUserId = user?.userId || user?.Id || "1"
  
  // State for post interactions
  const parseLikes = (likesData) => {
    try {
      return JSON.parse(likesData || "[]")
    } catch {
      return Array.isArray(likesData) ? likesData : []
    }
  }
  
  const postLikes = parseLikes(post.likes_c || post.likes)
  const [isLiked, setIsLiked] = useState(postLikes.includes(currentUserId.toString()))
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
const [likesCount, setLikesCount] = useState((post.likes || []).length)
  const [comments, setComments] = useState([])
  const [commentLikes, setCommentLikes] = useState({})
  const [replyForms, setReplyForms] = useState({})
  const [replyTexts, setReplyTexts] = useState({})
  const handleLike = async () => {
    try {
      const newLikedState = !isLiked
      setIsLiked(newLikedState)
setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)
      
      if (onUpdate?.onLike) {
        await onUpdate.onLike(post.Id, newLikedState)
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

useEffect(() => {
    // Fetch comments on component mount to ensure they're available after page refresh
    fetchComments()
  }, [post.Id])

  // Separate effect to handle comments visibility toggle
  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments()
    }
  }, [showComments])

  const fetchComments = async () => {
    try {
      const postComments = await commentService.getByPostId(post.Id)
      setComments(postComments)
      
      // Initialize comment likes state
      const likesState = {}
      postComments.forEach(comment => {
likesState[comment.Id] = {
          isLiked: (comment.likes || []).includes("1"),
          count: (comment.likes || []).length
        }
      })
      setCommentLikes(likesState)
    } catch (error) {
      toast.error("Failed to load comments")
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

try {
      const newComment = await commentService.create({
        post_id_c: post.Id,
        author_id_c: currentUserId,
        content_c: commentText.trim()
      })
      
      setComments(prev => [...prev, newComment])
      setCommentLikes(prev => ({
        ...prev,
        [newComment.Id]: { isLiked: false, count: 0 }
      }))
      setCommentText("")
      toast.success("Comment added!", { autoClose: 1000 })
      
      if (onUpdate?.onComment) {
        await onUpdate.onComment(post.Id, commentText.trim())
      }
    } catch (error) {
      toast.error("Failed to add comment")
    }
  }

  const handleCommentLike = async (commentId) => {
    try {
const result = await commentService.likeComment(commentId, currentUserId)
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: {
          isLiked: result.isLiked,
          count: result.likesCount
        }
      }))
      
      // Update the comment in comments array
      setComments(prev => prev.map(comment => 
        comment.Id === parseInt(commentId) 
          ? { ...comment, likes: result.likes }
          : comment
      ))
      
      toast.success(result.isLiked ? "Comment liked!" : "Comment unliked!", { autoClose: 800 })
    } catch (error) {
      toast.error("Failed to like comment")
    }
  }

  const handleReply = async (parentCommentId, replyText) => {
    if (!replyText.trim()) return

    try {
const newReply = await commentService.replyToComment(parentCommentId, {
        post_id_c: post.Id,
        author_id_c: currentUserId,
        content_c: replyText.trim()
      })
      
      setComments(prev => [...prev, newReply])
      setCommentLikes(prev => ({
        ...prev,
        [newReply.Id]: { isLiked: false, count: 0 }
      }))
      
      // Close reply form and clear text
      setReplyForms(prev => ({ ...prev, [parentCommentId]: false }))
      setReplyTexts(prev => ({ ...prev, [parentCommentId]: "" }))
      
      toast.success("Reply added!", { autoClose: 1000 })
    } catch (error) {
      toast.error("Failed to add reply")
    }
  }

  const toggleReplyForm = (commentId) => {
    setReplyForms(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

const renderComment = (comment, isReply = false) => {
    const likes = commentLikes[comment.Id] || { isLiked: false, count: 0 }
    const replies = comments.filter(c => c.parentId === comment.Id)
    const showReplyForm = replyForms[comment.Id]
    const replyText = replyTexts[comment.Id] || ""

    return (
      <div key={comment.Id} className={cn("flex space-x-3", isReply && "ml-12")}>
        <div className="flex-shrink-0">
        <Avatar 
          size="sm" 
          src={comment.author_id_c?.profile_picture_c}
          fallback={comment.author_id_c?.Name?.[0]?.toUpperCase() || comment.author_id_c?.username_c?.[0]?.toUpperCase() || "U"}
        />
        </div>
        <div className="flex-1 min-w-0">
<div className="bg-gray-100 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm text-gray-900">
{comment.author_id_c?.Name || comment.author_id_c?.username_c || 'Unknown User'}
              </span>
              <span className="text-xs text-gray-500">
              </span>
            </div>
            <p className="text-sm text-gray-800">{comment.content_c || comment.content}</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-2">
            <button 
              onClick={() => handleCommentLike(comment.Id)}
              className={cn(
                "flex items-center space-x-1 text-xs font-medium transition-colors",
                likes.isLiked 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-primary"
              )}
            >
              <ApperIcon 
                name="Heart" 
                size={12} 
                className={cn(likes.isLiked && "fill-current heart-pop")} 
              />
              <span>{likes.count > 0 ? likes.count : "Like"}</span>
            </button>
            
            {!isReply && (
              <button 
                onClick={() => toggleReplyForm(comment.Id)}
                className="text-xs text-gray-500 hover:text-secondary font-medium transition-colors"
              >
                Reply
              </button>
            )}
          </div>

          {showReplyForm && (
            <div className="mt-3 ml-4">
              <div className="flex space-x-2">
                <Avatar size="sm" fallback="Y" />
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment.Id]: e.target.value }))}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleReply(comment.Id, replyText)
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    disabled={!replyText.trim()}
                    onClick={() => handleReply(comment.Id, replyText)}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {replies.length > 0 && (
            <div className="mt-3 space-y-2">
              {replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "bg-surface rounded-xl shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200 hover:-translate-y-1",
      className
    )}>
      {/* Post Header */}
<div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar
              src={post.author_id_c?.profile_picture_c || ""}
              alt={post.author_id_c?.username_c || post.author_id_c?.Name}
              size="md"
              online={true}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.author_id_c?.Name || 'Unknown User'}</h3>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                   {formatDistanceToNow(new Date(post.CreatedOn || post.createdAt), { addSuffix: true })}
                </span>
              </div>
              {post.author_id_c?.bio_c && (
                <p className="text-xs text-gray-500 mt-1">{post.author_id_c.bio_c}</p>
              )}
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ApperIcon name="MoreHorizontal" className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
{(post.content_c || post.content) && (
           <p className="text-gray-900 leading-relaxed">{post.content_c || post.content}</p>
        )}
      </div>

{/* Post Image */}
      {(post.image_url_c || post.imageUrl) && (
        <div className="px-4 pb-3">
          <img
            src={post.image_url_c || post.imageUrl}
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
<span className="text-sm font-medium">{post.comment_count_c || 0}</span>
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
            {comments
              .filter(comment => !comment.parentId)
              .map(comment => renderComment(comment))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard