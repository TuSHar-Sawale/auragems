'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid'
import productService from '@/services/productService'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getFeaturedProducts(8)
        setFeaturedProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-card-bg to-dark-bg py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-gradient mb-6">
            ✦ AuraGems ✦
          </h1>
          <p className="text-2xl text-text-light mb-8">
            Discover Premium Handmade Jewelry That Sparkles With Your Story
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="btn-primary">
              Shop Now
            </Link>
            <Link href="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-4xl font-serif text-gradient mb-12 text-center">
            Explore Our Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Rings', emoji: '💍' },
              { name: 'Necklaces', emoji: '✨' },
              { name: 'Bracelets', emoji: '💫' },
              { name: 'Earrings', emoji: '⭐' },
              { name: 'Anklets', emoji: '👣' },
              { name: 'Sets', emoji: '💎' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${category.name.toLowerCase()}`}
                className="card text-center hover:border-primary"
              >
                <div className="text-4xl mb-2">{category.emoji}</div>
                <h3 className="font-semibold text-text-light">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-card-bg">
        <div className="container-custom">
          <h2 className="text-4xl font-serif text-gradient mb-12 text-center">
            Featured Collection
          </h2>
          <ProductGrid products={featuredProducts} loading={loading} />
          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-4xl font-serif text-gradient mb-12 text-center">
            Why Choose AuraGems?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-text-light mb-3">
                Handcrafted Excellence
              </h3>
              <p className="text-text-light">
                Every piece is meticulously handcrafted by skilled artisans using premium materials.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="text-xl font-semibold text-text-light mb-3">
                Authentic Quality
              </h3>
              <p className="text-text-light">
                We guarantee authentic gemstones and precious metals with certification.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-text-light mb-3">
                Fast Delivery
              </h3>
              <p className="text-text-light">
                Quick and secure shipping across the country with tracking and insurance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-card-bg">
        <div className="container-custom max-w-2xl">
          <h2 className="text-3xl font-serif text-gradient mb-6 text-center">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-text-light text-center mb-6">
            Get exclusive offers, new collections, and styling tips delivered to your inbox.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 input-field"
              required
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
