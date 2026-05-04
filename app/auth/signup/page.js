'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-toastify'
import { validateSignupForm } from '@/lib/validations/auth'

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { isValid, errors: validationErrors } = validateSignupForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword
    )

    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    try {
      setLoading(true)
      await signup(formData.email, formData.password, formData.name)
      toast.success('Account created successfully!')
      router.push('/')
    } catch (error) {
      toast.error(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-serif text-gradient mb-2 text-center">Join AuraGems</h1>
        <p className="text-text-light text-center mb-8">Create your account to start shopping</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-light mb-2">Full Name</label>
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
            <label className="block text-sm text-text-light mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-light mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-light mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="border-t border-border-dark my-6"></div>

        <p className="text-text-light text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:text-yellow-400">
            Sign in
          </Link>
        </p>

        <p className="text-text-light text-center text-sm mt-4">
          <Link href="/" className="text-primary hover:text-yellow-400">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
