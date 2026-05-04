'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  if (!user?.user_metadata?.is_admin) {
    router.push('/')
    return null
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Products', href: '/admin/products', icon: '📦' },
    { label: 'Categories', href: '/admin/categories', icon: '🏷️' },
    { label: 'Orders', href: '/admin/orders', icon: '📋' },
    { label: 'Coupons', href: '/admin/coupons', icon: '🎟️' },
    { label: 'Bulk Upload', href: '/admin/bulk-upload', icon: '📤' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-card-bg border-r border-border-dark transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-border-dark">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            {isSidebarOpen ? (
              <div className="text-2xl font-serif text-gradient">✦ AuraGems Admin</div>
            ) : (
              <div className="text-2xl">✦</div>
            )}
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-3 rounded-lg text-text-light hover:bg-border-dark hover:text-primary transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-dark">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 rounded-lg text-text-light hover:bg-red-600 transition-colors"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-card-bg border-b border-border-dark p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-2xl text-text-light hover:text-primary"
            >
              ☰
            </button>
            <div className="text-text-light">
              Welcome, {user?.user_metadata?.name || user?.email}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
