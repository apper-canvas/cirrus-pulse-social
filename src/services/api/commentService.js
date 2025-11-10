import { getApperClient } from "@/services/apperClient";
import { likeService } from "./likeService";

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
      // Check if user has already liked this comment
      const existingLike = await likeService.getUserLikeForComment(commentId, userId);
      
      if (existingLike) {
        // Unlike: delete the existing like record
        const success = await likeService.deleteLike(existingLike.Id);
        
        if (success) {
          // Get updated like count
          const likes = await likeService.getLikesByComment(commentId);
          return {
            isLiked: false,
            likesCount: likes.length,
            commentId: parseInt(commentId)
          };
        }
        return null;
      } else {
        // Like: create a new like record
        const newLike = await likeService.createLike(commentId, userId);
        
        if (newLike) {
          // Get updated like count
          const likes = await likeService.getLikesByComment(commentId);
          return {
            isLiked: true,
            likesCount: likes.length,
            commentId: parseInt(commentId)
          };
        }
        return null;
      }
    } catch (error) {
      console.error("Error liking comment:", error?.response?.data?.message || error);
      return null;
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


  async getByPostId(postId) {
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
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "username_c"}}},
          {"field": {"Name": "author_id_c"}, "referenceField": {"field": {"Name": "profile_picture_c"}}},
          {"field": {"Name": "post_id_c"}},
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "post_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(postId)]
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error("Failed to fetch comments for post:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error?.response?.data?.message || error);
      return [];
    }
  }
}