import comments from "@/services/mockData/comments.json"
import users from "@/services/mockData/users.json"
import posts from "@/services/mockData/posts.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const commentService = {
  async getAll() {
    await delay(300)
    return [...comments]
  },

  async getById(id) {
    await delay(200)
    const comment = comments.find(c => c.Id === parseInt(id))
    if (!comment) {
      throw new Error("Comment not found")
    }
    return { ...comment }
  },

  async getByPostId(postId) {
    await delay(250)
    const postComments = comments.filter(c => c.postId === postId.toString())
    
    // Enhance with author information
    const enhancedComments = postComments.map(comment => {
      const author = users.find(u => u.Id === parseInt(comment.authorId))
      return {
        ...comment,
        author: author ? {
          Id: author.Id,
          username: author.username,
          profilePicture: author.profilePicture
        } : null
      }
    })
    
    // Sort by creation date (oldest first for comments)
    return enhancedComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  },

  async create(commentData) {
    await delay(400)
    const maxId = Math.max(...comments.map(c => c.Id))
    const newComment = {
      ...commentData,
      Id: maxId + 1,
      likes: [],
      createdAt: new Date().toISOString()
    }
    
    comments.push(newComment)
    
    // Update post comment count
    const post = posts.find(p => p.Id === parseInt(commentData.postId))
    if (post) {
      post.commentCount = (post.commentCount || 0) + 1
    }
    
    // Enhance with author information
    const author = users.find(u => u.Id === parseInt(newComment.authorId))
    return {
      ...newComment,
      author: author ? {
        Id: author.Id,
        username: author.username,
        profilePicture: author.profilePicture
      } : null
    }
  },

  async update(id, updates) {
    await delay(300)
    const commentIndex = comments.findIndex(c => c.Id === parseInt(id))
    if (commentIndex === -1) {
      throw new Error("Comment not found")
    }
    
    comments[commentIndex] = { ...comments[commentIndex], ...updates }
    return { ...comments[commentIndex] }
  },

  async delete(id) {
    await delay(300)
    const commentIndex = comments.findIndex(c => c.Id === parseInt(id))
    if (commentIndex === -1) {
      throw new Error("Comment not found")
    }
    
    const deletedComment = comments.splice(commentIndex, 1)[0]
    
    // Update post comment count
    const post = posts.find(p => p.Id === parseInt(deletedComment.postId))
    if (post && post.commentCount > 0) {
      post.commentCount = post.commentCount - 1
    }
    
    return { ...deletedComment }
  },

  async likeComment(commentId, userId) {
    await delay(200)
    const comment = comments.find(c => c.Id === parseInt(commentId))
    if (!comment) {
      throw new Error("Comment not found")
    }
    
    const userIdStr = userId.toString()
    if (!comment.likes.includes(userIdStr)) {
      comment.likes.push(userIdStr)
    }
    
    return { ...comment }
  },

  async unlikeComment(commentId, userId) {
    await delay(200)
    const comment = comments.find(c => c.Id === parseInt(commentId))
    if (!comment) {
      throw new Error("Comment not found")
    }
    
    const userIdStr = userId.toString()
    comment.likes = comment.likes.filter(id => id !== userIdStr)
    
    return { ...comment }
  }
}