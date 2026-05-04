'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-toastify'
import { validateLoginForm } from '@/lib/validations/auth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    const { isValid, errors: validationErrors } = validateLoginForm(
      formData.email,
      formData.password
    )

    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    try {
      setLoading(true)
      await login(formData.email, formData.password)
      toast.success('Logged in successfully!')
      router.push('/')
    } catch (error) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-serif text-gradient mb-2 text-center">Welcome Back</h1>
        <p className="text-text-light text-center mb-8">Sign in to your AuraGems account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="border-t border-border-dark my-6"></div>

        <p className="text-text-light text-center text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:text-yellow-400">
            Sign up
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
