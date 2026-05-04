'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'
import Loader from '@/components/Loader'
import { formatCurrency, formatDate } from '@/lib/helpers'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/api/admin/dashboard')
        setStats(data.stats)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <Loader />
  }

  const chartData = {
    labels: stats?.revenueChart?.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    }) || [],
    datasets: [
      {
        label: 'Revenue',
        data: stats?.revenueChart?.map(item => item.revenue) || [],
        borderColor: '#d4af37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        tension: 0.4,
      },
    ],
  }

  return (
    <div>
      <h1 className="text-4xl font-serif text-gradient mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="admin-grid mb-12">
        {[
          { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: '💰' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📋' },
          { label: 'Total Products', value: stats?.totalProducts || 0, icon: '📦' },
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥' },
        ].map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-light text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-primary mt-2">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card mb-12">
        <h2 className="text-xl font-semibold text-text-light mb-6">Revenue Last 7 Days</h2>
        <Line data={chartData} options={{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: '#e0e0e0' },
            },
          },
          scales: {
            y: {
              ticks: { color: '#e0e0e0' },
              grid: { color: '#2a2a3e' },
            },
            x: {
              ticks: { color: '#e0e0e0' },
              grid: { color: '#2a2a3e' },
            },
          },
        }} />
      </div>

      {/* Recent Orders */}
      <div className="card">
        <h2 className="text-xl font-semibold text-text-light mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-dark">
                <th className="text-left text-text-light py-3">Order ID</th>
                <th className="text-left text-text-light py-3">Email</th>
                <th className="text-left text-text-light py-3">Amount</th>
                <th className="text-left text-text-light py-3">Status</th>
                <th className="text-left text-text-light py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((order) => (
                <tr key={order.id} className="border-b border-border-dark hover:bg-border-dark">
                  <td className="py-3 text-primary font-mono">{order.order_number}</td>
                  <td className="py-3 text-text-light">{order.email}</td>
                  <td className="py-3 text-primary font-semibold">{formatCurrency(order.total_amount)}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      order.order_status === 'delivered' ? 'bg-green-600' :
                      order.order_status === 'cancelled' ? 'bg-red-600' :
                      'bg-blue-600'
                    }`}>
                      {order.order_status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-text-light">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
