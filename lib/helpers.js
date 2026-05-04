import crypto from 'crypto'

// Verify Razorpay payment signature
export const verifyPaymentSignature = (orderId, paymentId, signature, secret) => {
  const message = `${orderId}|${paymentId}`
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex')
  
  return generatedSignature === signature
}

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

// Slug generation
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Image compression placeholder
export const compressImage = async (file) => {
  return file // In production, use sharp or other compression library
}

// JWT token verification
export const verifyAdminToken = (token, secret) => {
  try {
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64'))
    return decoded.isAdmin === true
  } catch {
    return false
  }
}

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Calculate discount
export const calculateDiscount = (price, mrp) => {
  if (!mrp || mrp === 0) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate phone
export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/
  return re.test(phone.replace(/\D/g, ''))
}

// Validate pincode
export const validatePincode = (pincode) => {
  return /^[0-9]{6}$/.test(pincode)
}

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// Calculate cart total
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}
