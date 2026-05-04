'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'
import Loader from '@/components/Loader'
import { formatCurrency, formatDate } from '@/lib/helpers'

export default function AdminProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/api/products?limit=100')
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-serif text-gradient">Products</h1>
        <Link href="/admin/products/add" className="btn-primary">
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl text-text-light mb-4">No products yet</p>
          <Link href="/admin/products/add" className="btn-primary">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-dark">
                <th className="text-left text-text-light py-3 px-4">Name</th>
                <th className="text-left text-text-light py-3 px-4">SKU</th>
                <th className="text-left text-text-light py-3 px-4">Price</th>
                <th className="text-left text-text-light py-3 px-4">Stock</th>
                <th className="text-left text-text-light py-3 px-4">Status</th>
                <th className="text-left text-text-light py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border-dark hover:bg-border-dark">
                  <td className="py-3 px-4 text-text-light">{product.name}</td>
                  <td className="py-3 px-4 text-text-light font-mono">{product.sku}</td>
                  <td className="py-3 px-4 text-primary font-semibold">{formatCurrency(product.price)}</td>
                  <td className="py-3 px-4 text-text-light">{product.stock}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.is_active ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-primary hover:text-yellow-400"
                      >
                        ✏️
                      </Link>
                      <button className="text-red-400 hover:text-red-600">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
