'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function OrderSuccessPage() {
  const params = useParams()
  const orderId = params.orderId

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom max-w-2xl">
        <div className="text-center">
          <div className="text-7xl mb-6">✓</div>
          <h1 className="text-4xl font-serif text-gradient mb-4">Order Placed Successfully!</h1>
          <p className="text-text-light text-lg mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="card bg-card-bg border border-primary mb-8">
            <h3 className="text-text-light text-sm mb-2">Order Number</h3>
            <p className="text-3xl font-bold text-primary font-mono mb-4">{orderId}</p>
            <p className="text-text-light text-sm">
              Check your email for detailed order information and tracking details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card">
              <p className="text-text-light text-sm mb-1">Estimated Delivery</p>
              <p className="text-xl font-semibold text-primary">5-7 Days</p>
            </div>
            <div className="card">
              <p className="text-text-light text-sm mb-1">Order Status</p>
              <p className="text-xl font-semibold text-primary">Confirmed</p>
            </div>
            <div className="card">
              <p className="text-text-light text-sm mb-1">Support</p>
              <p className="text-xl font-semibold text-primary">24/7 Available</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/orders" className="btn-primary">
              View Orders
            </Link>
            <Link href="/products" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-border-dark">
            <h3 className="text-text-light font-semibold mb-4">What's Next?</h3>
            <div className="space-y-2 text-text-light text-sm">
              <p>✓ You'll receive an order confirmation email shortly</p>
              <p>✓ We'll update you with tracking information once it ships</p>
              <p>✓ You can track your order from your account</p>
              <p>✓ 7-day return policy applies to all orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
