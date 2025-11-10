import users from "@/services/mockData/users.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const userService = {
  async getAll() {
    await delay(300)
    return [...users]
  },

  async getById(id) {
    await delay(200)
    const user = users.find(u => u.Id === parseInt(id))
    if (!user) {
      throw new Error("User not found")
    }
    return { ...user }
  },

  async create(userData) {
    await delay(400)
    const maxId = Math.max(...users.map(u => u.Id))
    const newUser = {
      ...userData,
      Id: maxId + 1,
      friends: [],
      pendingRequests: [],
      friendsCount: 0,
      online: true,
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    return { ...newUser }
  },

  async update(id, updates) {
    await delay(300)
    const userIndex = users.findIndex(u => u.Id === parseInt(id))
    if (userIndex === -1) {
      throw new Error("User not found")
    }
    
    users[userIndex] = { ...users[userIndex], ...updates }
    return { ...users[userIndex] }
  },

  async delete(id) {
    await delay(300)
    const userIndex = users.findIndex(u => u.Id === parseInt(id))
    if (userIndex === -1) {
      throw new Error("User not found")
    }
    
    const deletedUser = users.splice(userIndex, 1)[0]
    return { ...deletedUser }
  },

  async getFriends(userId) {
    await delay(250)
    const user = users.find(u => u.Id === parseInt(userId))
    if (!user) {
      throw new Error("User not found")
    }
    
    const friends = users.filter(u => user.friends.includes(u.Id.toString()))
    return friends.map(f => ({ ...f }))
  },

  async getPendingRequests(userId) {
    await delay(250)
    const user = users.find(u => u.Id === parseInt(userId))
    if (!user) {
      throw new Error("User not found")
    }
    
    const pendingUsers = users.filter(u => user.pendingRequests.includes(u.Id.toString()))
    return pendingUsers.map(u => ({ ...u }))
  },

  async sendFriendRequest(fromUserId, toUserId) {
    await delay(300)
    const fromUser = users.find(u => u.Id === parseInt(fromUserId))
    const toUser = users.find(u => u.Id === parseInt(toUserId))
    
    if (!fromUser || !toUser) {
      throw new Error("User not found")
    }
    
    if (!toUser.pendingRequests.includes(fromUserId.toString())) {
      toUser.pendingRequests.push(fromUserId.toString())
    }
    
    return true
  },

  async acceptFriendRequest(userId, requesterId) {
    await delay(300)
    const user = users.find(u => u.Id === parseInt(userId))
    const requester = users.find(u => u.Id === parseInt(requesterId))
    
    if (!user || !requester) {
      throw new Error("User not found")
    }
    
    // Remove from pending requests
    user.pendingRequests = user.pendingRequests.filter(id => id !== requesterId.toString())
    
    // Add to friends list for both users
    if (!user.friends.includes(requesterId.toString())) {
      user.friends.push(requesterId.toString())
      user.friendsCount = user.friends.length
    }
    
    if (!requester.friends.includes(userId.toString())) {
      requester.friends.push(userId.toString())
      requester.friendsCount = requester.friends.length
    }
    
    return true
  },

  async rejectFriendRequest(userId, requesterId) {
    await delay(300)
    const user = users.find(u => u.Id === parseInt(userId))
    
    if (!user) {
      throw new Error("User not found")
    }
    
    user.pendingRequests = user.pendingRequests.filter(id => id !== requesterId.toString())
    return true
  },

  async removeFriend(userId, friendId) {
    await delay(300)
    const user = users.find(u => u.Id === parseInt(userId))
    const friend = users.find(u => u.Id === parseInt(friendId))
    
    if (!user || !friend) {
      throw new Error("User not found")
    }
    
    // Remove from both users' friends lists
    user.friends = user.friends.filter(id => id !== friendId.toString())
    user.friendsCount = user.friends.length
    
    friend.friends = friend.friends.filter(id => id !== userId.toString())
    friend.friendsCount = friend.friends.length
    
    return true
  }
}