import api from './api'

export const productService = {
  // Fetch all products with filters
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    
    try {
      const response = await api.get(`/api/products?${params}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Fetch single product
  getProductById: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create product (admin)
  createProduct: async (productData) => {
    try {
      const response = await api.post('/api/admin/products', productData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/api/admin/products/${id}`, productData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/api/admin/products/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await api.get(`/api/products?featured=true&limit=${limit}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default productService
