import api from './api'

export const orderService = {
  // Create order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/api/orders/create-order', orderData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/api/orders/verify-payment', paymentData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Fetch user orders
  getUserOrders: async () => {
    try {
      const response = await api.get('/api/orders')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Fetch order details
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/api/orders/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Get all orders
  getAllOrders: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.page) params.append('page', filters.page)
    
    try {
      const response = await api.get(`/api/admin/orders?${params}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`/api/admin/orders/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default orderService
