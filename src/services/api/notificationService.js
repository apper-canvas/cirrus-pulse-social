import { getApperClient } from "@/services/apperClient"

export const notificationService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords('notification_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "actor_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "target_id_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: { limit: 100, offset: 0 }
      })

      if (!response.success) {
        console.error("Failed to fetch notifications:", response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching notifications:", error?.response?.data?.message || error)
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

      const response = await apperClient.getRecordById('notification_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "actor_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "target_id_c"}}
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch notification:", response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error?.response?.data?.message || error)
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

      const response = await apperClient.fetchRecords('notification_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "actor_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "target_id_c"}}
        ],
        where: [{"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: { limit: 100, offset: 0 }
      })

      if (!response.success) {
        console.error("Failed to fetch user notifications:", response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error?.response?.data?.message || error)
      return []
    }
  },

  async getUnreadCount(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return 0
      }

      const response = await apperClient.fetchRecords('notification_c', {
        fields: [{"field": {"Name": "Name"}}],
        where: [
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]},
          {"FieldName": "read_c", "Operator": "EqualTo", "Values": [false]}
        ],
        pagingInfo: { limit: 1, offset: 0 }
      })

      if (!response.success) {
        console.error("Failed to fetch unread count:", response.message)
        return 0
      }

      return response.total || 0
    } catch (error) {
      console.error(`Error fetching unread count for user ${userId}:`, error?.response?.data?.message || error)
      return 0
    }
  },

  async create(notificationData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      const params = {
        records: [{
          Name: "Notification",
          message_c: notificationData.message_c || notificationData.message,
          type_c: notificationData.type_c || notificationData.type,
          read_c: false,
          actor_id_c: parseInt(notificationData.actor_id_c || notificationData.actorId),
          user_id_c: parseInt(notificationData.user_id_c || notificationData.userId),
          target_id_c: notificationData.target_id_c ? parseInt(notificationData.target_id_c) : null
        }]
      }

      const response = await apperClient.createRecord('notification_c', params)

      if (!response.success) {
        console.error("Failed to create notification:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} notifications:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`))
            if (record.message) console.error(record.message)
          })
        }
        
        const createdNotification = successful.length > 0 ? successful[0].data : null
        if (createdNotification) {
          // Transform to expected format
          return {
            ...createdNotification,
            message: createdNotification.message_c,
            type: createdNotification.type_c,
            read: createdNotification.read_c,
            actorId: createdNotification.actor_id_c?.Id || createdNotification.actor_id_c,
            userId: createdNotification.user_id_c?.Id || createdNotification.user_id_c,
            createdAt: createdNotification.CreatedOn
          }
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating notification:", error?.response?.data?.message || error)
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
      if (updates.message_c !== undefined) updateData.message_c = updates.message_c
      if (updates.type_c !== undefined) updateData.type_c = updates.type_c
      if (updates.read_c !== undefined) updateData.read_c = updates.read_c
      if (updates.read !== undefined) updateData.read_c = updates.read

      const params = { records: [updateData] }
      const response = await apperClient.updateRecord('notification_c', params)

      if (!response.success) {
        console.error("Failed to update notification:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} notifications:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`))
            if (record.message) console.error(record.message)
          })
        }
        
        const updatedNotification = successful.length > 0 ? successful[0].data : null
        if (updatedNotification) {
          // Transform to expected format
          return {
            ...updatedNotification,
            message: updatedNotification.message_c,
            type: updatedNotification.type_c,
            read: updatedNotification.read_c,
            actorId: updatedNotification.actor_id_c?.Id || updatedNotification.actor_id_c,
            userId: updatedNotification.user_id_c?.Id || updatedNotification.user_id_c,
            createdAt: updatedNotification.CreatedOn
          }
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating notification:", error?.response?.data?.message || error)
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
      const response = await apperClient.deleteRecord('notification_c', params)

      if (!response.success) {
        console.error("Failed to delete notification:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} notifications:`, failed)
          failed.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        return successful.length === 1
      }
      
      return false
    } catch (error) {
      console.error("Error deleting notification:", error?.response?.data?.message || error)
      return false
    }
  },

  async markAsRead(id) {
    return this.update(id, { read_c: true })
  },

  async markAllAsRead(userId) {
    try {
      // Get all unread notifications for user
      const notifications = await this.getByUserId(userId)
      const unreadNotifications = notifications.filter(n => !n.read_c)
      
      // Mark each as read
      let markedCount = 0
      for (const notification of unreadNotifications) {
        const updated = await this.update(notification.Id, { read_c: true })
        if (updated) markedCount++
      }
      
      return markedCount
    } catch (error) {
      console.error(`Error marking all notifications as read for user ${userId}:`, error?.response?.data?.message || error)
      return 0
    }
  }
}