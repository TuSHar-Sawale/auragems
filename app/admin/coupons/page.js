'use client'

import { useEffect, useState } from 'react'
import api from '@/services/api'
import Loader from '@/components/Loader'
import { formatCurrency, formatDate } from '@/lib/helpers'
import { toast } from 'react-toastify'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 0,
    expiryDate: '',
    description: '',
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/api/admin/coupons')
      setCoupons(data.coupons || [])
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCoupon = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/admin/coupons', formData)
      setCoupons([...coupons, data.coupon])
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        usageLimit: 0,
        expiryDate: '',
        description: '',
      })
      setShowForm(false)
      toast.success('Coupon added successfully')
    } catch (error) {
      toast.error('Failed to add coupon')
    }
  }

  const handleDeleteCoupon = async (id) => {
    try {
      await api.delete(`/api/admin/coupons/${id}`)
      setCoupons(coupons.filter(c => c.id !== id))
      toast.success('Coupon deleted')
    } catch (error) {
      toast.error('Failed to delete coupon')
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-serif text-gradient">Coupons</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? '✕ Cancel' : '+ Add Coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddCoupon} className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Coupon Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="input-field"
              required
            />
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              className="input-field"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
            <input
              type="number"
              placeholder="Discount Value"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="number"
              placeholder="Min Order Amount"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Max Discount"
              value={formData.maxDiscount}
              onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Usage Limit"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="input-field"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
            />
          </div>

          <button type="submit" className="btn-primary">
            Add Coupon
          </button>
        </form>
      )}

      {coupons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl text-text-light mb-4">No coupons yet</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-dark">
                <th className="text-left text-text-light py-3 px-4">Code</th>
                <th className="text-left text-text-light py-3 px-4">Discount</th>
                <th className="text-left text-text-light py-3 px-4">Min Order</th>
                <th className="text-left text-text-light py-3 px-4">Used</th>
                <th className="text-left text-text-light py-3 px-4">Expiry</th>
                <th className="text-left text-text-light py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-border-dark hover:bg-border-dark">
                  <td className="py-3 px-4 text-primary font-bold">{coupon.code}</td>
                  <td className="py-3 px-4 text-text-light">
                    {coupon.discount_type === 'percentage' ? 
                      `${coupon.discount_value}%` : 
                      formatCurrency(coupon.discount_value)
                    }
                  </td>
                  <td className="py-3 px-4 text-text-light">
                    {coupon.min_order_amount ? formatCurrency(coupon.min_order_amount) : '-'}
                  </td>
                  <td className="py-3 px-4 text-text-light">{coupon.usage_count}/{coupon.usage_limit || '∞'}</td>
                  <td className="py-3 px-4 text-text-light">
                    {coupon.expiry_date ? formatDate(coupon.expiry_date) : 'Never'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      🗑️ Delete
                    </button>
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
