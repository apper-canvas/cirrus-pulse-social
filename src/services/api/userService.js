import { getApperClient } from "@/services/apperClient";

export const userService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) return [];

      const response = await apperClient.fetchRecords('user_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "username_c"}},
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "profile_picture_c"}},
          {"field": {"Name": "cover_photo_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "online_c"}},
          {"field": {"Name": "friends_count_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: { limit: 50, offset: 0 }
      });

      if (!response.success) {
        console.error("Error fetching users:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching users:", error?.response?.data?.message || error);
      return [];
    }
  },
  },

  async getCurrentUserProfile(userEmail) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) return null;

      if (!userEmail) return null;

      // Search for user by email address
      const response = await apperClient.fetchRecords('user_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "username_c"}},
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "profile_picture_c"}},
          {"field": {"Name": "cover_photo_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "online_c"}},
          {"field": {"Name": "friends_count_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "email_c", "Operator": "EqualTo", "Values": [userEmail]}],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success) {
        console.error("Error fetching current user profile:", response.message);
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching current user profile:", error?.response?.data?.message || error);
      return null;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) return null;

      if (!id) return null;

      const response = await apperClient.getRecordById('user_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "username_c"}},
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "profile_picture_c"}},
          {"field": {"Name": "cover_photo_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "online_c"}},
          {"field": {"Name": "friends_count_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
console.error(`Error fetching user ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(userData) {
    try {
const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        records: [{
          Name: userData.Name || userData.username_c,
          username_c: userData.username_c,
          bio_c: userData.bio_c || "",
          email_c: userData.email_c,
          profile_picture_c: userData.profile_picture_c || "",
          cover_photo_c: userData.cover_photo_c || "",
          location_c: userData.location_c || "",
          online_c: true,
          friends_count_c: 0
        }]
      }

const response = await apperClient.createRecord('user_c', params);

      if (!response.success) {
        console.error("Failed to create user:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
console.error(`Failed to create ${failed.length} users:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
            if (record.message) console.error(record.message);
          });
        }
return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updates) {
    try {
const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

const updateData = { Id: parseInt(id) };
      
      // Only include updateable fields
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.username_c !== undefined) updateData.username_c = updates.username_c;
      if (updates.bio_c !== undefined) updateData.bio_c = updates.bio_c;
if (updates.email_c !== undefined) updateData.email_c = updates.email_c;
      if (updates.profile_picture_c !== undefined) updateData.profile_picture_c = updates.profile_picture_c;
      if (updates.cover_photo_c !== undefined) updateData.cover_photo_c = updates.cover_photo_c;
      if (updates.location_c !== undefined) updateData.location_c = updates.location_c;
      if (updates.online_c !== undefined) updateData.online_c = updates.online_c;
      if (updates.friends_count_c !== undefined) updateData.friends_count_c = updates.friends_count_c;

const params = { records: [updateData] };
      const response = await apperClient.updateRecord('user_c', params);

      if (!response.success) {
        console.error("Failed to update user:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
console.error(`Failed to update ${failed.length} users:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
            if (record.message) console.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
return null;
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord('user_c', params);

      if (!response.success) {
        console.error("Failed to delete user:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
console.error(`Failed to delete ${failed.length} users:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting user:", error?.response?.data?.message || error);
      return false;
    }
  }
};
}