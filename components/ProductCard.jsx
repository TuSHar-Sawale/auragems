'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { toast } from 'react-toastify'
import { calculateDiscount, formatCurrency } from '@/lib/helpers'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  const discount = calculateDiscount(product.price, product.mrp)

  return (
    <div className="card group">
      {/* Image Container */}
      <div className="relative mb-4 overflow-hidden rounded-lg bg-border-dark">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-64 group-hover:scale-105 transition-transform duration-300">
            {product.images?.[0]?.image_url ? (
              <Image
                src={product.images[0].image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-border-dark flex items-center justify-center">
                <span className="text-4xl">💎</span>
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {product.is_featured && (
            <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded">
              Featured
            </span>
          )}
          {product.is_new && (
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <Link href={`/products/${product.id}`}>
        <h3 className="font-semibold text-lg text-text-light hover:text-primary truncate">
          {product.name}
        </h3>
      </Link>

      {/* Price */}
      <div className="flex items-center gap-3 my-3">
        <span className="text-2xl font-bold text-primary">
          {formatCurrency(product.price)}
        </span>
        {product.mrp && (
          <span className="text-sm text-gray-500 line-through">
            {formatCurrency(product.mrp)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-text-light text-sm mb-4 line-clamp-2">
        {product.description}
      </p>

      {/* Stock Status */}
      <div className="mb-4">
        {product.stock > 0 ? (
          <span className="text-green-400 text-sm font-medium">In Stock</span>
        ) : (
          <span className="text-red-400 text-sm font-medium">Out of Stock</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
        <Link href={`/products/${product.id}`} className="flex-1 btn-secondary text-sm text-center">
          View
        </Link>
      </div>
    </div>
  )
}
