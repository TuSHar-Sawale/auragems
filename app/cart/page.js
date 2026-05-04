'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import CartItem from '@/components/CartItem'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/helpers'

export default function CartPage() {
  const { items, clearCart, getTotalPrice } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = getTotalPrice()
  const shippingCost = totalPrice > 499 ? 0 : 99
  const finalTotal = totalPrice + shippingCost

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="container-custom text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-4xl font-serif text-gradient mb-4">Your Cart is Empty</h1>
          <p className="text-text-light mb-8">Add some beautiful jewelry to get started</p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-serif text-gradient mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-2xl font-semibold text-text-light mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-border-dark">
                <div className="flex justify-between text-text-light">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-text-light">
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-gray-400">
                    Free shipping on orders above ₹499
                  </p>
                )}
              </div>

              <div className="flex justify-between text-2xl font-bold text-primary mb-6">
                <span>Total:</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>

              <Link href="/checkout" className="btn-primary w-full text-center mb-3">
                Proceed to Checkout
              </Link>
              <button
                onClick={clearCart}
                className="btn-secondary w-full"
              >
                Clear Cart
              </button>
            </div>

            {/* Promo Code */}
            <div className="card mt-6">
              <h4 className="font-semibold text-text-light mb-3">Apply Coupon</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 input-field"
                />
                <button className="btn-primary">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
