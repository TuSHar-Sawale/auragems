'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import orderService from '@/services/orderService'
import Loader from '@/components/Loader'
import { formatCurrency, formatDate } from '@/lib/helpers'

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  )
}

function OrdersContent() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await orderService.getUserOrders()
        setOrders(data.orders || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-serif text-gradient mb-12">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-text-light mb-4">No orders yet</p>
            <Link href="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-text-light text-sm">Order Number</p>
                    <p className="font-semibold text-primary">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">Date</p>
                    <p className="font-semibold text-text-light">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">Status</p>
                    <p className={`font-semibold ${
                      order.order_status === 'delivered' ? 'text-green-400' :
                      order.order_status === 'cancelled' ? 'text-red-400' :
                      'text-primary'
                    }`}>
                      {order.order_status?.charAt(0).toUpperCase() + order.order_status?.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">Total</p>
                    <p className="font-semibold text-primary">{formatCurrency(order.total_amount)}</p>
                  </div>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="text-primary hover:text-yellow-400 text-sm font-semibold"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
