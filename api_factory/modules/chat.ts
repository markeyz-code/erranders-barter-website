import axios from 'axios'

const ERRANDERS_CORE = axios.create({ baseURL: 'https://api.erranders.org' })
const ERRANDERS_CORE_WITH_AUTH = axios.create({ baseURL: 'https://api.erranders.org' })

// Add interceptor to ERRANDERS_CORE_WITH_AUTH
ERRANDERS_CORE_WITH_AUTH.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('barter_token') || localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const chat_api = {
  createRoom: (payload: {
    userId: string
    userName: string
    userEmail?: string
    userPhone?: string
    businessId?: string
    subdomain?: string
    isGuest?: boolean
    guestInfo?: any
  }) => {
    const url = '/chat/rooms/create'
    return ERRANDERS_CORE.post(url, payload)
  },

  getRoomMessages: (roomId: string, params: {
    userId: string
    page?: number
    limit?: number
    beforeMessageId?: string
  }) => {
    const url = `/chat/rooms/${roomId}/messages`
    return ERRANDERS_CORE.get(url, { params })
  },

  sendMessage: (roomId: string, payload: {
    senderId: string
    senderType: 'customer' | 'staff' | 'system' | 'bot'
    senderName: string
    content: string
    messageType?: string
    attachments?: string[]
    replyToMessageId?: string
  }) => {
    const url = `/chat/rooms/${roomId}/messages`
    return ERRANDERS_CORE.post(url, payload)
  },

  markMessagesAsRead: (roomId: string, userId: string) => {
    const url = `/chat/rooms/${roomId}/messages/read`
    return ERRANDERS_CORE.put(url, { userId })
  },

  getBusinessRooms: (params?: {
    roomType?: string
    isActive?: boolean
    priority?: string
    page?: number
    limit?: number
  }) => {
    const url = '/chat/rooms'
    return ERRANDERS_CORE_WITH_AUTH.get(url, { params })
  },

  getFaqs: (businessId: string) => {
    const url = '/chat/faqs'
    return ERRANDERS_CORE.get(url, { params: { businessId } })
  },

  getAutoResponses: (businessId: string) => {
    const url = '/chat/auto-responses'
    return ERRANDERS_CORE.get(url, { params: { businessId } })
  },
}
