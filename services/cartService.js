import api from './api'

export const cartService = {
  // Apply coupon
  applyCoupon: async (couponCode, cartTotal) => {
    try {
      const response = await api.post('/api/coupons/validate', {
        code: couponCode,
        cartTotal,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Fetch all coupons (admin)
  getCoupons: async () => {
    try {
      const response = await api.get('/api/admin/coupons')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create coupon (admin)
  createCoupon: async (couponData) => {
    try {
      const response = await api.post('/api/admin/coupons', couponData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update coupon (admin)
  updateCoupon: async (id, couponData) => {
    try {
      const response = await api.put(`/api/admin/coupons/${id}`, couponData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete coupon (admin)
  deleteCoupon: async (id) => {
    try {
      const response = await api.delete(`/api/admin/coupons/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default cartService
