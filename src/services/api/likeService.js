import { getApperClient } from "@/services/apperClient";

export const likeService = {
  /**
   * Get all likes for a specific comment
   */
  async getLikesByComment(commentId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "comment_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "comment_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(commentId)]
        }],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      };

      const response = await apperClient.fetchRecords('like_c', params);
      
      if (!response.success) {
        console.error("Error fetching likes:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching likes for comment:", error?.response?.data?.message || error);
      return [];
    }
  },

  /**
   * Create a new like record
   */
  async createLike(commentId, userId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          comment_id_c: parseInt(commentId),
          user_id_c: parseInt(userId)
        }]
      };

      const response = await apperClient.createRecord('like_c', params);
      
      if (!response.success) {
        console.error("Error creating like:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} like records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating like:", error?.response?.data?.message || error);
      return null;
    }
  },

  /**
   * Delete a like record
   */
  async deleteLike(likeId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(likeId)]
      };

      const response = await apperClient.deleteRecord('like_c', params);
      
      if (!response.success) {
        console.error("Error deleting like:", response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} like records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting like:", error?.response?.data?.message || error);
      return false;
    }
  },

  /**
   * Check if a user has liked a specific comment
   */
  async getUserLikeForComment(commentId, userId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "comment_id_c"}},
          {"field": {"Name": "user_id_c"}}
        ],
        where: [
          {
            "FieldName": "comment_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(commentId)]
          },
          {
            "FieldName": "user_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(userId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('like_c', params);
      
      if (!response.success) {
        console.error("Error checking user like:", response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Error checking user like for comment:", error?.response?.data?.message || error);
      return null;
    }
  }
};