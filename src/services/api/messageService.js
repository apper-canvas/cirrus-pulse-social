import messages from "@/services/mockData/messages.json"
import users from "@/services/mockData/users.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const messageService = {
  async getAll() {
    await delay(300)
    return [...messages]
  },

  async getById(id) {
    await delay(200)
    const message = messages.find(m => m.Id === parseInt(id))
    if (!message) {
      throw new Error("Message not found")
    }
    return { ...message }
  },

  async getByConversationId(conversationId) {
    await delay(250)
    const conversationMessages = messages.filter(m => m.conversationId === conversationId)
    
    // Enhance with sender information
    const enhancedMessages = conversationMessages.map(message => {
      const sender = users.find(u => u.Id === parseInt(message.senderId))
      return {
        ...message,
        sender: sender ? {
          Id: sender.Id,
          username: sender.username,
          profilePicture: sender.profilePicture
        } : null
      }
    })
    
    // Sort by creation date (oldest first)
    return enhancedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  },

  async getConversations(userId) {
    await delay(350)
    const userIdStr = userId.toString()
    
    // Group messages by conversation
    const conversationMap = new Map()
    
    messages.forEach(message => {
      const conversationId = message.conversationId
      const participants = conversationId.split("-")
      
      // Only include conversations where user is a participant
      if (participants.includes(userIdStr)) {
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, [])
        }
        conversationMap.get(conversationId).push(message)
      }
    })
    
    // Create conversation objects with metadata
    const conversations = []
    
    for (const [conversationId, msgs] of conversationMap) {
      const participants = conversationId.split("-")
      const otherUserId = participants.find(id => id !== userIdStr)
      const otherUser = users.find(u => u.Id === parseInt(otherUserId))
      
      if (otherUser) {
        const lastMessage = msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
        const unreadCount = msgs.filter(m => m.senderId !== userIdStr && !m.read).length
        
        conversations.push({
          Id: conversationId,
          conversationId,
          otherUser: {
            Id: otherUser.Id,
            username: otherUser.username,
            profilePicture: otherUser.profilePicture,
            online: otherUser.online
          },
          lastMessage,
          unreadCount,
          updatedAt: lastMessage.createdAt
        })
      }
    }
    
    // Sort by last message date (newest first)
    return conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  },

  async create(messageData) {
    await delay(300)
    const maxId = Math.max(...messages.map(m => m.Id))
    const newMessage = {
      ...messageData,
      Id: maxId + 1,
      read: false,
      createdAt: new Date().toISOString()
    }
    
    messages.push(newMessage)
    
    // Enhance with sender information
    const sender = users.find(u => u.Id === parseInt(newMessage.senderId))
    return {
      ...newMessage,
      sender: sender ? {
        Id: sender.Id,
        username: sender.username,
        profilePicture: sender.profilePicture
      } : null
    }
  },

  async update(id, updates) {
    await delay(250)
    const messageIndex = messages.findIndex(m => m.Id === parseInt(id))
    if (messageIndex === -1) {
      throw new Error("Message not found")
    }
    
    messages[messageIndex] = { ...messages[messageIndex], ...updates }
    return { ...messages[messageIndex] }
  },

  async delete(id) {
    await delay(300)
    const messageIndex = messages.findIndex(m => m.Id === parseInt(id))
    if (messageIndex === -1) {
      throw new Error("Message not found")
    }
    
    const deletedMessage = messages.splice(messageIndex, 1)[0]
    return { ...deletedMessage }
  },

  async markAsRead(id) {
    await delay(200)
    return this.update(id, { read: true })
  },

  async markConversationAsRead(conversationId, userId) {
    await delay(250)
    const userIdStr = userId.toString()
    const conversationMessages = messages.filter(
      m => m.conversationId === conversationId && m.senderId !== userIdStr && !m.read
    )
    
    conversationMessages.forEach(message => {
      message.read = true
    })
    
    return conversationMessages.length
  }
}