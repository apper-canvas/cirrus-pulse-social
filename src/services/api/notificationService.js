import notifications from "@/services/mockData/notifications.json"
import users from "@/services/mockData/users.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const notificationService = {
  async getAll() {
    await delay(300)
    // Return notifications for current user (ID: 1)
    const userNotifications = notifications.filter(n => n.userId === "1")
    
    // Enhance with actor information
    const enhancedNotifications = userNotifications.map(notification => {
      const actor = users.find(u => u.Id === parseInt(notification.actorId))
      return {
        ...notification,
        actor: actor ? {
          Id: actor.Id,
          username: actor.username,
          profilePicture: actor.profilePicture
        } : null
      }
    })
    
    // Sort by creation date (newest first)
    return enhancedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getById(id) {
    await delay(200)
    const notification = notifications.find(n => n.Id === parseInt(id))
    if (!notification) {
      throw new Error("Notification not found")
    }
    return { ...notification }
  },

  async getByUserId(userId) {
    await delay(250)
    const userNotifications = notifications.filter(n => n.userId === userId.toString())
    
    // Enhance with actor information
    const enhancedNotifications = userNotifications.map(notification => {
      const actor = users.find(u => u.Id === parseInt(notification.actorId))
      return {
        ...notification,
        actor: actor ? {
          Id: actor.Id,
          username: actor.username,
          profilePicture: actor.profilePicture
        } : null
      }
    })
    
    // Sort by creation date (newest first)
    return enhancedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getUnreadCount(userId) {
    await delay(150)
    const userNotifications = notifications.filter(
      n => n.userId === userId.toString() && !n.read
    )
    return userNotifications.length
  },

  async create(notificationData) {
    await delay(300)
    const maxId = Math.max(...notifications.map(n => n.Id))
    const newNotification = {
      ...notificationData,
      Id: maxId + 1,
      read: false,
      createdAt: new Date().toISOString()
    }
    
    notifications.unshift(newNotification)
    
    // Enhance with actor information
    const actor = users.find(u => u.Id === parseInt(newNotification.actorId))
    return {
      ...newNotification,
      actor: actor ? {
        Id: actor.Id,
        username: actor.username,
        profilePicture: actor.profilePicture
      } : null
    }
  },

  async update(id, updates) {
    await delay(250)
    const notificationIndex = notifications.findIndex(n => n.Id === parseInt(id))
    if (notificationIndex === -1) {
      throw new Error("Notification not found")
    }
    
    notifications[notificationIndex] = { ...notifications[notificationIndex], ...updates }
    return { ...notifications[notificationIndex] }
  },

  async delete(id) {
    await delay(300)
    const notificationIndex = notifications.findIndex(n => n.Id === parseInt(id))
    if (notificationIndex === -1) {
      throw new Error("Notification not found")
    }
    
    const deletedNotification = notifications.splice(notificationIndex, 1)[0]
    return { ...deletedNotification }
  },

  async markAsRead(id) {
    await delay(200)
    return this.update(id, { read: true })
  },

  async markAllAsRead(userId) {
    await delay(300)
    const userNotifications = notifications.filter(
      n => n.userId === userId.toString() && !n.read
    )
    
    userNotifications.forEach(notification => {
      notification.read = true
    })
    
    return userNotifications.length
  }
}