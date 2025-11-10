import { getApperClient } from "@/services/apperClient";

export const commentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('comment_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "username_c"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "profile_picture_c"}}},
          {"field": {"Name": "post_id_c"}},
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error("Failed to fetch all comments:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching all comments:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      const response = await apperClient.getRecordById('comment_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "post_id_c"}},
          {"field": {"Name": "parent_id_c"}}
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch comment:", response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },


  async create(commentData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      const params = {
        records: [{
          Name: "Comment",
          content_c: commentData.content_c || commentData.content,
          likes_c: "[]", // Empty array as string
          author_id_c: parseInt(commentData.author_id_c || commentData.authorId),
          post_id_c: parseInt(commentData.post_id_c || commentData.postId),
          parent_id_c: commentData.parent_id_c ? parseInt(commentData.parent_id_c) : null
        }]
      }

      const response = await apperClient.createRecord('comment_c', params)

      if (!response.success) {
        console.error("Failed to create comment:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} comments:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`))
            if (record.message) console.error(record.message)
          })
        }
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error creating comment:", error?.response?.data?.message || error)
      return null
    }
  },

  async likeComment(commentId, userId) {
    try {
      // Get current comment
      const comment = await this.getById(commentId)
      if (!comment) {
        console.error("Comment not found")
        return null
      }

      // Parse current likes
      let likes = []
      try {
        likes = JSON.parse(comment.likes_c || "[]")
      } catch (e) {
        likes = []
      }

      const userIdStr = userId.toString()
      const isLiked = likes.includes(userIdStr)

      if (isLiked) {
        likes = likes.filter(id => id !== userIdStr)
      } else {
        likes.push(userIdStr)
      }

      // Update comment
      const updatedComment = await this.update(commentId, {
        likes_c: JSON.stringify(likes)
      })

      return {
        ...updatedComment,
        isLiked: !isLiked,
        likesCount: likes.length,
        likes: likes
      }
    } catch (error) {
      console.error("Error liking comment:", error?.response?.data?.message || error)
      return null
    }
  },

  async replyToComment(parentCommentId, replyData) {
    try {
      const parentComment = await this.getById(parentCommentId)
      if (!parentComment) {
        console.error("Parent comment not found")
        return null
      }

      return await this.create({
        ...replyData,
        parent_id_c: parseInt(parentCommentId)
      })
    } catch (error) {
      console.error("Error replying to comment:", error?.response?.data?.message || error)
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
      if (updates.likes_c !== undefined) updateData.likes_c = updates.likes_c

      const params = { records: [updateData] }
      const response = await apperClient.updateRecord('comment_c', params)

      if (!response.success) {
        console.error("Failed to update comment:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} comments:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`))
            if (record.message) console.error(record.message)
          })
        }
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error updating comment:", error?.response?.data?.message || error)
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
      const response = await apperClient.deleteRecord('comment_c', params)

      if (!response.success) {
        console.error("Failed to delete comment:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} comments:`, failed)
          failed.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        return successful.length === 1
      }
      
      return false
    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error)
      return false
    }
  },

  async unlikeComment(commentId, userId) {
    try {
      // Get current comment
      const comment = await this.getById(commentId)
      if (!comment) {
        console.error("Comment not found")
        return null
      }

      // Parse current likes
      let likes = []
      try {
        likes = JSON.parse(comment.likes_c || "[]")
      } catch (e) {
        likes = []
      }

      const userIdStr = userId.toString()
      likes = likes.filter(id => id !== userIdStr)

      // Update comment
      return await this.update(commentId, {
        likes_c: JSON.stringify(likes)
      })
    } catch (error) {
      console.error("Error unliking comment:", error?.response?.data?.message || error)
      return null
    }
  }
}