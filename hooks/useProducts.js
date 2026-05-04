import { useState, useEffect } from 'react'
import productService from '@/services/productService'

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getProducts(filters)
        setProducts(data.products || [])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [JSON.stringify(filters)])

  return { products, loading, error }
}

export default useProducts
