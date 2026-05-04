'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { toast } from 'react-toastify'
import orderService from '@/services/orderService'
import { formatCurrency, validateEmail, validatePhone, validatePincode } from '@/lib/helpers'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name?.trim()) newErrors.name = 'Name is required'
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required'
    if (!validatePhone(formData.phone)) newErrors.phone = 'Valid 10-digit phone is required'
    if (!formData.address_line1?.trim()) newErrors.address_line1 = 'Address is required'
    if (!formData.city?.trim()) newErrors.city = 'City is required'
    if (!formData.state?.trim()) newErrors.state = 'State is required'
    if (!validatePincode(formData.pincode)) newErrors.pincode = 'Valid 6-digit pincode is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    try {
      setLoading(true)

      const orderData = {
        items,
        shipping: formData,
        paymentMethod: formData.paymentMethod,
        totalAmount: getTotalPrice(),
      }

      const response = await orderService.createOrder(orderData)

      if (formData.paymentMethod === 'razorpay' && response.razorpay_order_id) {
        // Razorpay payment
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: getTotalPrice() * 100,
          currency: 'INR',
          order_id: response.razorpay_order_id,
          name: 'AuraGems',
          description: 'Premium Handmade Jewelry',
          handler: async (paymentResponse) => {
            try {
              const verifyResponse = await orderService.verifyPayment({
                order_id: response.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              })

              clearCart()
              toast.success('Order placed successfully!')
              router.push(`/order-success/${verifyResponse.order_id}`)
            } catch (error) {
              toast.error('Payment verification failed')
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
        }

        const Razorpay = window.Razorpay
        if (!Razorpay) {
          // Load Razorpay script
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => {
            new window.Razorpay(options).open()
          }
          document.body.appendChild(script)
        } else {
          new Razorpay(options).open()
        }
      } else {
        // COD
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/order-success/${response.id}`)
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = getTotalPrice()
  const shippingCost = totalPrice > 499 ? 0 : 99
  const finalTotal = totalPrice + shippingCost

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-serif text-gradient mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Shipping Address */}
              <div className="card">
                <h3 className="text-xl font-semibold text-text-light mb-6">Shipping Address</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-text-light mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-text-light mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-text-light mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="9876543210"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-text-light mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    className={`input-field ${errors.address_line1 ? 'border-red-500' : ''}`}
                    placeholder="Street address"
                  />
                  {errors.address_line1 && (
                    <p className="text-red-500 text-sm mt-1">{errors.address_line1}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-text-light mb-2">Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-text-light mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                      placeholder="Mumbai"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-text-light mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                      placeholder="Maharashtra"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-text-light mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={`input-field ${errors.pincode ? 'border-red-500' : ''}`}
                      placeholder="400001"
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card">
                <h3 className="text-xl font-semibold text-text-light mb-6">Payment Method</h3>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-border-dark rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === 'razorpay'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-text-light">Razorpay (Cards, UPI, Wallet)</span>
                  </label>

                  <label className="flex items-center p-4 border border-border-dark rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-text-light">Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-xl font-semibold text-text-light mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-text-light">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-dark pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-text-light">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-text-light">
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-primary">
                  <span>Total:</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <Link href="/cart" className="btn-secondary w-full text-center">
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
