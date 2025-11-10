import { getApperClient } from "@/services/apperClient";
export const postService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

const response = await apperClient.fetchRecords('post_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "comment_count_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "reactions_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "username_c"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "profile_picture_c"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "bio_c"}}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: { limit: 20, offset: 0 }
      })

      if (!response.success) {
        console.error("Failed to fetch posts:", response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching posts:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

const response = await apperClient.getRecordById('post_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "comment_count_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "reactions_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "username_c"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "profile_picture_c"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "bio_c"}}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async getByUserId(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

const response = await apperClient.fetchRecords('post_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "comment_count_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "reactions_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "username_c"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "profile_picture_c"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "bio_c"}}}
        ],
        where: [{"FieldName": "author_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: { limit: 100, offset: 0 }
      })

      if (!response.success) {
        console.error("Failed to fetch user posts:", response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error?.response?.data?.message || error)
      return []
    }
  },

  async getFeedPosts(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      // For now, return all posts - in production, you'd filter by friends
const response = await apperClient.fetchRecords('post_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "comment_count_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "reactions_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "username_c"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "profile_picture_c"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "bio_c"}}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: { limit: 50, offset: 0 }
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error(`Error fetching feed posts for user ${userId}:`, error?.response?.data?.message || error)
      return []
    }
  },

  async create(postData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

const params = {
        records: [{
          content_c: postData.content_c,
          Name: postData.Name || "Post",
          image_url_c: postData.image_url_c || postData.imageUrl || "",
          comment_count_c: 0,
          likes_c: "[]", // Empty array as string
          reactions_c: "{}",
          author_id_c: parseInt(postData.author_id_c || postData.authorId)
        }]
      }

      const response = await apperClient.createRecord('post_c', params)

      if (!response.success) {
        console.error("Failed to create post:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} posts:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`))
            if (record.message) console.error(record.message)
          })
        }
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error creating post:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      const updateData = { Id: parseInt(id) }
      
      // Only include updateable fields
      if (updates.Name !== undefined) updateData.Name = updates.Name
      if (updates.content_c !== undefined) updateData.content_c = updates.content_c
      if (updates.image_url_c !== undefined) updateData.image_url_c = updates.image_url_c
      if (updates.comment_count_c !== undefined) updateData.comment_count_c = updates.comment_count_c
      if (updates.likes_c !== undefined) updateData.likes_c = updates.likes_c
      if (updates.reactions_c !== undefined) updateData.reactions_c = updates.reactions_c

      const params = { records: [updateData] }
      const response = await apperClient.updateRecord('post_c', params)

      if (!response.success) {
        console.error("Failed to update post:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} posts:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`))
            if (record.message) console.error(record.message)
          })
        }
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error updating post:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      const params = { RecordIds: [parseInt(id)] }
      const response = await apperClient.deleteRecord('post_c', params)

      if (!response.success) {
        console.error("Failed to delete post:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} posts:`, failed)
          failed.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        return successful.length === 1
      }
      
      return false
    } catch (error) {
      console.error("Error deleting post:", error?.response?.data?.message || error)
      return false
    }
  },

  async addReaction(postId, userId, emoji) {
    try {
      // Get current post
      const post = await this.getById(postId)
      if (!post) {
        console.error("Post not found")
        return null
      }

      // Parse current reactions
      let reactions = {}
      try {
        reactions = JSON.parse(post.reactions_c || "{}")
      } catch (e) {
        reactions = {}
      }

      const userIdStr = userId.toString()

      // Remove user from all other reactions
      Object.keys(reactions).forEach(e => {
        reactions[e] = reactions[e].filter(id => id !== userIdStr)
        if (reactions[e].length === 0) {
          delete reactions[e]
        }
      })

      // Add user to selected emoji
      if (!reactions[emoji]) {
        reactions[emoji] = []
      }
      if (!reactions[emoji].includes(userIdStr)) {
        reactions[emoji].push(userIdStr)
      }

      // Update post
      return await this.update(postId, {
        reactions_c: JSON.stringify(reactions)
      })
    } catch (error) {
      console.error("Error adding reaction:", error?.response?.data?.message || error)
      return null
    }
  },

  async removeReaction(postId, userId) {
    try {
      // Get current post
      const post = await this.getById(postId)
      if (!post) {
        console.error("Post not found")
        return null
      }

      // Parse current reactions
      let reactions = {}
      try {
        reactions = JSON.parse(post.reactions_c || "{}")
      } catch (e) {
        reactions = {}
      }

      const userIdStr = userId.toString()

      // Remove user from all reactions
      Object.keys(reactions).forEach(emoji => {
        reactions[emoji] = reactions[emoji].filter(id => id !== userIdStr)
        if (reactions[emoji].length === 0) {
          delete reactions[emoji]
        }
      })

      // Update post
      return await this.update(postId, {
        reactions_c: JSON.stringify(reactions)
      })
    } catch (error) {
      console.error("Error removing reaction:", error?.response?.data?.message || error)
      return null
    }
  }
}

// Save post functionality
const savePost = async (postId, userId) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })

    const params = {
      records: [{
        Name: `Saved Post ${postId}`,
        post_id_c: parseInt(postId),
        user_id_c: parseInt(userId)
      }]
    }

    const response = await apperClient.createRecord('saved_post_c', params)

    if (!response.success) {
      console.error("Failed to save post:", response.message)
      throw new Error(response.message)
    }

    return response.results?.[0]?.data
  } catch (error) {
    console.error("Error saving post:", error?.response?.data?.message || error)
    throw error
  }
}

const unsavePost = async (postId, userId) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })

    // First find the saved post record
    const findResponse = await apperClient.fetchRecords('saved_post_c', {
      fields: [{"field": {"Name": "Id"}}],
      where: [
        {"FieldName": "post_id_c", "Operator": "EqualTo", "Values": [parseInt(postId)]},
        {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]}
      ]
    })

    if (findResponse.success && findResponse.data.length > 0) {
      const savedPostId = findResponse.data[0].Id
      const deleteResponse = await apperClient.deleteRecord('saved_post_c', {
        RecordIds: [savedPostId]
      })

      if (!deleteResponse.success) {
        throw new Error(deleteResponse.message)
      }

      return true
    }

    return false
  } catch (error) {
    console.error("Error unsaving post:", error?.response?.data?.message || error)
    throw error
  }
}

const checkSaveStatus = async (postId, userId) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })

    const response = await apperClient.fetchRecords('saved_post_c', {
      fields: [{"field": {"Name": "Id"}}],
      where: [
        {"FieldName": "post_id_c", "Operator": "EqualTo", "Values": [parseInt(postId)]},
        {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]}
      ]
    })

    return response.success && response.data.length > 0
  } catch (error) {
    console.error("Error checking save status:", error?.response?.data?.message || error)
    return false
  }
}

// Add save/unsave methods to the main service object
postService.savePost = savePost;
postService.unsavePost = unsavePost;
postService.checkSaveStatus = checkSaveStatus;

// Export the save/unsave functions
export { savePost, unsavePost, checkSaveStatus };