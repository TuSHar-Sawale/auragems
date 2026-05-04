'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { toast } from 'react-toastify'
import productService from '@/services/productService'
import Loader from '@/components/Loader'
import { calculateDiscount, formatCurrency } from '@/lib/helpers'

export default function ProductDetailPage() {
  const params = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await productService.getProductById(params.id)
        setProduct(data.product || data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return <Loader />
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gradient mb-4">Product Not Found</h1>
          <Link href="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images || []
  const selectedImage = images[selectedImageIndex]?.image_url || '/placeholder.png'
  const discount = calculateDiscount(product.price, product.mrp)

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`${product.name} added to cart!`)
    setQuantity(1)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-8 text-text-light text-sm">
          <Link href="/" className="hover:text-primary">Home</Link>
          {' / '}
          <Link href="/products" className="hover:text-primary">Products</Link>
          {' / '}
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden bg-border-dark">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex ? 'border-primary' : 'border-border-dark'
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-serif text-text-light mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-primary text-lg mb-4">By {product.brand}</p>
            )}

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-400">★ ★ ★ ★ ★</span>
              <span className="text-text-light">(124 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-border-dark">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
                {product.mrp && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.mrp)}
                  </span>
                )}
              </div>
              <p className="text-text-light">
                Inclusive of all taxes
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-light mb-3">Description</h3>
              <p className="text-text-light leading-relaxed">{product.description}</p>
            </div>

            {/* Details */}
            <div className="mb-6 pb-6 border-b border-border-dark">
              <div className="grid grid-cols-2 gap-4">
                {product.sku && (
                  <div>
                    <p className="text-text-light text-sm">SKU</p>
                    <p className="text-primary font-semibold">{product.sku}</p>
                  </div>
                )}
                <div>
                  <p className="text-text-light text-sm">Stock</p>
                  <p className={`font-semibold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {product.stock > 0 ? `${product.stock} Available` : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border-dark rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 hover:bg-border-dark transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center bg-transparent border-0 text-text-light"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 hover:bg-border-dark transition-colors disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  Add to Cart
                </button>
                <button className="flex-1 btn-secondary">
                  ❤️ Wishlist
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-2 text-sm text-text-light">
              {product.cod_available && (
                <p className="flex items-center gap-2">✓ Cash on Delivery Available</p>
              )}
              <p className="flex items-center gap-2">✓ 100% Original Products</p>
              <p className="flex items-center gap-2">✓ 7 Days Return Policy</p>
              <p className="flex items-center gap-2">✓ Free Shipping on Orders Above ₹499</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20 pt-12 border-t border-border-dark">
          <h2 className="text-3xl font-serif text-gradient mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Related products would go here */}
          </div>
        </div>
      </div>
    </div>
  )
}
