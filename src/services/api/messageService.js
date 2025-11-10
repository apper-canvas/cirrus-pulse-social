import { getApperClient } from "@/services/apperClient"

export const messageService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords('message_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "conversation_id_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "sender_id_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}],
        pagingInfo: { limit: 1000, offset: 0 }
      })

      if (!response.success) {
        console.error("Failed to fetch messages:", response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching messages:", error?.response?.data?.message || error)
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

      const response = await apperClient.getRecordById('message_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "conversation_id_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "sender_id_c"}}
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch message:", response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async getByConversationId(conversationId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords('message_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "conversation_id_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "sender_id_c"}}
        ],
        where: [{"FieldName": "conversation_id_c", "Operator": "EqualTo", "Values": [conversationId]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}],
        pagingInfo: { limit: 1000, offset: 0 }
      })

      if (!response.success) {
        console.error("Failed to fetch conversation messages:", response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error?.response?.data?.message || error)
      return []
    }
  },

  async getConversations(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      // Get all messages where user is involved
      const response = await apperClient.fetchRecords('message_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "conversation_id_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "sender_id_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: { limit: 1000, offset: 0 }
      })

      if (!response.success) {
        console.error("Failed to fetch messages for conversations:", response.message)
        return []
      }

      const messages = response.data || []
      const userIdStr = userId.toString()
      
      // Group messages by conversation
      const conversationMap = new Map()
      
      messages.forEach(message => {
        const conversationId = message.conversation_id_c
        const participants = conversationId.split("-")
        
        // Only include conversations where user is a participant
        if (participants.includes(userIdStr)) {
          if (!conversationMap.has(conversationId)) {
            conversationMap.set(conversationId, [])
          }
          conversationMap.get(conversationId).push(message)
        }
      })
      
      // Create conversation objects with metadata - simplified for now
      const conversations = []
      
      for (const [conversationId, msgs] of conversationMap) {
        const lastMessage = msgs[0] // Already sorted by CreatedOn DESC
        const unreadCount = msgs.filter(m => 
          m.sender_id_c?.Id ? m.sender_id_c.Id !== parseInt(userIdStr) && !m.read_c : 
          m.sender_id_c !== parseInt(userIdStr) && !m.read_c
        ).length
        
        conversations.push({
          Id: conversationId,
          conversationId,
          lastMessage: {
            ...lastMessage,
            content: lastMessage.content_c,
            createdAt: lastMessage.CreatedOn,
            senderId: lastMessage.sender_id_c?.Id || lastMessage.sender_id_c
          },
          unreadCount,
          updatedAt: lastMessage.CreatedOn
        })
      }
      
      // Sort by last message date (newest first)
      return conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    } catch (error) {
      console.error(`Error fetching conversations for user ${userId}:`, error?.response?.data?.message || error)
      return []
    }
  },

  async create(messageData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      const params = {
        records: [{
          Name: "Message",
          content_c: messageData.content_c || messageData.content,
          conversation_id_c: messageData.conversation_id_c || messageData.conversationId,
          read_c: false,
          sender_id_c: parseInt(messageData.sender_id_c || messageData.senderId)
        }]
      }

      const response = await apperClient.createRecord('message_c', params)

      if (!response.success) {
        console.error("Failed to create message:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} messages:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`))
            if (record.message) console.error(record.message)
          })
        }
        
        const createdMessage = successful.length > 0 ? successful[0].data : null
        if (createdMessage) {
          // Transform to expected format
          return {
            ...createdMessage,
            content: createdMessage.content_c,
            conversationId: createdMessage.conversation_id_c,
            read: createdMessage.read_c,
            senderId: createdMessage.sender_id_c?.Id || createdMessage.sender_id_c,
            createdAt: createdMessage.CreatedOn
          }
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating message:", error?.response?.data?.message || error)
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
      if (updates.conversation_id_c !== undefined) updateData.conversation_id_c = updates.conversation_id_c
      if (updates.read_c !== undefined) updateData.read_c = updates.read_c
      if (updates.read !== undefined) updateData.read_c = updates.read

      const params = { records: [updateData] }
      const response = await apperClient.updateRecord('message_c', params)

      if (!response.success) {
        console.error("Failed to update message:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} messages:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`))
            if (record.message) console.error(record.message)
          })
        }
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error updating message:", error?.response?.data?.message || error)
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
      const response = await apperClient.deleteRecord('message_c', params)

      if (!response.success) {
        console.error("Failed to delete message:", response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} messages:`, failed)
          failed.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        return successful.length === 1
      }
      
      return false
    } catch (error) {
      console.error("Error deleting message:", error?.response?.data?.message || error)
      return false
    }
  },

  async markAsRead(id) {
    return this.update(id, { read_c: true })
  },

  async markConversationAsRead(conversationId, userId) {
    try {
      // Get all unread messages in conversation not sent by current user
      const messages = await this.getByConversationId(conversationId)
      const userIdInt = parseInt(userId)
      
      const unreadMessages = messages.filter(m => {
        const senderId = m.sender_id_c?.Id || m.sender_id_c
        return senderId !== userIdInt && !m.read_c
      })
      
      // Mark each as read
      let markedCount = 0
      for (const message of unreadMessages) {
        const updated = await this.update(message.Id, { read_c: true })
        if (updated) markedCount++
      }
      
      return markedCount
    } catch (error) {
      console.error(`Error marking conversation ${conversationId} as read:`, error?.response?.data?.message || error)
      return 0
    }
  }
}