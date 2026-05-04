'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'
import Loader from '@/components/Loader'
import { formatCurrency, formatDate } from '@/lib/helpers'
import { toast } from 'react-toastify'

export default function AdminOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
  })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (filters.status) params.append('status', filters.status)
        
        const { data } = await api.get(`/api/admin/orders?${params}`)
        setOrders(data.orders || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [filters])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus })
      
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, order_status: newStatus } : order
      ))
      
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  if (loading) {
    return <Loader />
  }

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div>
      <h1 className="text-4xl font-serif text-gradient mb-8">Orders</h1>

      {/* Filters */}
      <div className="card mb-6">
        <label className="block text-sm text-text-light mb-2">Filter by Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="input-field"
        >
          <option value="">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl text-text-light">No orders found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-dark">
                <th className="text-left text-text-light py-3 px-4">Order ID</th>
                <th className="text-left text-text-light py-3 px-4">Customer</th>
                <th className="text-left text-text-light py-3 px-4">Amount</th>
                <th className="text-left text-text-light py-3 px-4">Payment</th>
                <th className="text-left text-text-light py-3 px-4">Status</th>
                <th className="text-left text-text-light py-3 px-4">Date</th>
                <th className="text-left text-text-light py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border-dark hover:bg-border-dark">
                  <td className="py-3 px-4 text-primary font-mono">{order.order_number}</td>
                  <td className="py-3 px-4 text-text-light">{order.shipping_email}</td>
                  <td className="py-3 px-4 text-primary font-semibold">{formatCurrency(order.total_amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.payment_status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-card-bg border border-border-dark rounded px-2 py-1 text-text-light text-xs"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-text-light">{formatDate(order.created_at)}</td>
                  <td className="py-3 px-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-primary hover:text-yellow-400">
                      View
                    </Link>
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
