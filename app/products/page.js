'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/ProductGrid'
import productService from '@/services/productService'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getProducts(filters)
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [JSON.stringify(filters)])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-serif text-gradient mb-12">Our Collection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-xl font-semibold text-text-light mb-6">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm text-text-light mb-2">Search</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                  className="input-field"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm text-text-light mb-2">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  <option value="rings">Rings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="earrings">Earrings</option>
                  <option value="anklets">Anklets</option>
                  <option value="sets">Sets</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm text-text-light mb-2">Min Price (₹)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="0"
                  className="input-field"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-text-light mb-2">Max Price (₹)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="100000"
                  className="input-field"
                />
              </div>

              {/* Clear Filters */}
              <button
                onClick={() =>
                  setFilters({
                    search: '',
                    category: '',
                    minPrice: '',
                    maxPrice: '',
                  })
                }
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
