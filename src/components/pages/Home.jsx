import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import PostComposer from "@/components/molecules/PostComposer"
import PostCard from "@/components/molecules/PostCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { postService } from "@/services/api/postService"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadFeedPosts()
  }, [])

  const loadFeedPosts = async () => {
    try {
      setLoading(true)
      setError("")
      // Load feed posts for current user (ID: 1)
      const data = await postService.getFeedPosts("1")
      setPosts(data)
    } catch (err) {
      setError("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (postData) => {
    try {
      const newPost = await postService.create(postData)
      setPosts(prev => [newPost, ...prev])
      toast.success("Post created successfully!")
    } catch (err) {
      toast.error("Failed to create post")
      throw err
    }
  }

  const handleLikePost = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await postService.likePost(postId, "1")
      } else {
        await postService.unlikePost(postId, "1")
      }
    } catch (err) {
      toast.error("Failed to update like")
      throw err
    }
  }

  const handleCommentPost = async (postId, content) => {
    try {
      // This would typically create a comment via commentService
      console.log("Comment on post", postId, ":", content)
      toast.success("Comment added!")
    } catch (err) {
      toast.error("Failed to add comment")
      throw err
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Stay connected with your friends and share what's happening in your world.
          </p>
        </div>

        {/* Post Composer */}
        <div className="mb-6">
          <PostComposer onCreatePost={handleCreatePost} />
        </div>

        {/* Feed Content */}
        {loading ? (
          <Loading type="posts" />
        ) : error ? (
          <Error 
            message={error} 
            onRetry={loadFeedPosts}
          />
        ) : posts.length === 0 ? (
          <Empty
            icon="FileText"
            title="No posts yet"
            description="Your feed is empty. Follow some friends or create your first post to get started!"
            actionLabel="Create First Post"
            onAction={() => {
              document.querySelector('textarea')?.focus()
            }}
          />
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.Id}
                post={post}
                onLike={handleLikePost}
                onComment={handleCommentPost}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {posts.length > 0 && !loading && (
          <div className="text-center mt-8">
            <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-150">
              Load more posts
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home