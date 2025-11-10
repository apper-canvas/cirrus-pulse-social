import posts from "@/services/mockData/posts.json"
import users from "@/services/mockData/users.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const postService = {
  async getAll() {
    await delay(400)
    // Enhance posts with author information
    const enhancedPosts = posts.map(post => {
      const author = users.find(u => u.Id === parseInt(post.authorId))
      return {
        ...post,
        author: author ? {
          Id: author.Id,
          username: author.username,
          profilePicture: author.profilePicture,
          bio: author.bio
        } : null
      }
    })
    
    // Sort by creation date (newest first)
    return enhancedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getById(id) {
    await delay(200)
    const post = posts.find(p => p.Id === parseInt(id))
    if (!post) {
      throw new Error("Post not found")
    }
    
    // Enhance with author information
    const author = users.find(u => u.Id === parseInt(post.authorId))
    return {
      ...post,
      author: author ? {
        Id: author.Id,
        username: author.username,
        profilePicture: author.profilePicture,
        bio: author.bio
      } : null
    }
  },

  async getByUserId(userId) {
    await delay(300)
    const userPosts = posts.filter(p => p.authorId === userId.toString())
    
    // Enhance with author information
    const author = users.find(u => u.Id === parseInt(userId))
    return userPosts.map(post => ({
      ...post,
      author: author ? {
        Id: author.Id,
        username: author.username,
        profilePicture: author.profilePicture,
        bio: author.bio
      } : null
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getFeedPosts(userId) {
    await delay(350)
    const user = users.find(u => u.Id === parseInt(userId))
    if (!user) {
      throw new Error("User not found")
    }
    
    // Get posts from friends and user
    const friendIds = [...user.friends, userId.toString()]
    const feedPosts = posts.filter(p => friendIds.includes(p.authorId))
    
    // Enhance with author information
    const enhancedPosts = feedPosts.map(post => {
      const author = users.find(u => u.Id === parseInt(post.authorId))
      return {
        ...post,
        author: author ? {
          Id: author.Id,
          username: author.username,
          profilePicture: author.profilePicture,
          bio: author.bio
        } : null
      }
    })
    
    // Sort by creation date (newest first)
    return enhancedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

async create(postData) {
    await delay(500)
    const maxId = Math.max(...posts.map(p => p.Id))
    const newPost = {
      ...postData,
      Id: maxId + 1,
      likes: [],
      reactions: {},
      commentCount: 0,
      createdAt: new Date().toISOString()
    }
    
    posts.unshift(newPost)
    
    // Enhance with author information
    const author = users.find(u => u.Id === parseInt(newPost.authorId))
    return {
      ...newPost,
      author: author ? {
        Id: author.Id,
        username: author.username,
        profilePicture: author.profilePicture,
        bio: author.bio
      } : null
    }
  },

  async update(id, updates) {
    await delay(300)
    const postIndex = posts.findIndex(p => p.Id === parseInt(id))
    if (postIndex === -1) {
      throw new Error("Post not found")
    }
    
    posts[postIndex] = { ...posts[postIndex], ...updates }
    
    // Enhance with author information
    const author = users.find(u => u.Id === parseInt(posts[postIndex].authorId))
    return {
      ...posts[postIndex],
      author: author ? {
        Id: author.Id,
        username: author.username,
        profilePicture: author.profilePicture,
        bio: author.bio
      } : null
    }
  },

  async delete(id) {
    await delay(300)
    const postIndex = posts.findIndex(p => p.Id === parseInt(id))
    if (postIndex === -1) {
      throw new Error("Post not found")
    }
    
    const deletedPost = posts.splice(postIndex, 1)[0]
    return { ...deletedPost }
  },

async addReaction(postId, userId, emoji) {
    await delay(250)
    const post = posts.find(p => p.Id === parseInt(postId))
    if (!post) {
      throw new Error("Post not found")
    }
    
    // Initialize reactions if not present
    if (!post.reactions) {
      post.reactions = {}
    }
    
    const userIdStr = userId.toString()
    
    // Remove user from all other reactions
    Object.keys(post.reactions).forEach(e => {
      post.reactions[e] = post.reactions[e].filter(id => id !== userIdStr)
      if (post.reactions[e].length === 0) {
        delete post.reactions[e]
      }
    })
    
    // Add user to selected emoji
    if (!post.reactions[emoji]) {
      post.reactions[emoji] = []
    }
    if (!post.reactions[emoji].includes(userIdStr)) {
      post.reactions[emoji].push(userIdStr)
    }
    
    return { ...post }
  },

  async removeReaction(postId, userId) {
    await delay(250)
    const post = posts.find(p => p.Id === parseInt(postId))
    if (!post) {
      throw new Error("Post not found")
    }
    
    if (!post.reactions) {
      return { ...post }
    }
    
    const userIdStr = userId.toString()
    
    // Remove user from all reactions
    Object.keys(post.reactions).forEach(emoji => {
      post.reactions[emoji] = post.reactions[emoji].filter(id => id !== userIdStr)
      if (post.reactions[emoji].length === 0) {
        delete post.reactions[emoji]
      }
    })
    
    return { ...post }
  }
}