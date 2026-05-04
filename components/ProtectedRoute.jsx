'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loader from './Loader'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
    if (!loading && adminOnly && !user?.user_metadata?.is_admin) {
      router.push('/')
    }
  }, [user, loading, router, adminOnly])

  if (loading) {
    return <Loader />
  }

  if (!user) {
    return null
  }

  if (adminOnly && !user.user_metadata?.is_admin) {
    return null
  }

  return children
}
