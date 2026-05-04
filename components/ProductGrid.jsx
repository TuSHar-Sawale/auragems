'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="product-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="bg-border-dark h-64 rounded-lg mb-4"></div>
            <div className="h-4 bg-border-dark rounded mb-2"></div>
            <div className="h-4 bg-border-dark rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-border-dark rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl text-text-light mb-4">No products found</p>
        <p className="text-text-light">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
