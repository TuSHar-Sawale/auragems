'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const cartCount = getTotalItems()

  return (
    <nav className="bg-card-bg border-b border-border-dark sticky top-0 z-40">
      <div className="container-custom flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-3xl font-serif text-gradient">✦ AuraGems</div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-text-light hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-text-light hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-text-light hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <Link href="/products" className="text-text-light hover:text-primary">
            🔍
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <div className="text-2xl hover:text-primary transition-colors">🛒</div>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-text-light hover:text-primary">
                👤
              </Link>
              {user.user_metadata?.is_admin && (
                <Link
                  href="/admin/dashboard"
                  className="btn-primary text-sm"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="btn-secondary text-sm">
                Login
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card-bg border-t border-border-dark p-4 space-y-4">
          <Link href="/products" className="block text-text-light hover:text-primary">
            Shop
          </Link>
          <Link href="/about" className="block text-text-light hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="block text-text-light hover:text-primary">
            Contact
          </Link>
        </div>
      )}
    </nav>
  )
}
