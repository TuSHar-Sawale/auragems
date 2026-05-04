'use client'

import { useEffect, useState } from 'react'
import api from '@/services/api'
import Loader from '@/components/Loader'
import { formatDate } from '@/lib/helpers'
import { toast } from 'react-toastify'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/api/admin/users')
        setUsers(data.users || [])
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await api.put(`/api/admin/users/${userId}/block`, { is_blocked: !isBlocked })
      setUsers(users.map(u =>
        u.id === userId ? { ...u, is_blocked: !isBlocked } : u
      ))
      toast.success(`User ${!isBlocked ? 'blocked' : 'unblocked'}`)
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <h1 className="text-4xl font-serif text-gradient mb-8">Users</h1>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl text-text-light">No users found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-dark">
                <th className="text-left text-text-light py-3 px-4">Name</th>
                <th className="text-left text-text-light py-3 px-4">Email</th>
                <th className="text-left text-text-light py-3 px-4">Phone</th>
                <th className="text-left text-text-light py-3 px-4">Joined</th>
                <th className="text-left text-text-light py-3 px-4">Status</th>
                <th className="text-left text-text-light py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border-dark hover:bg-border-dark">
                  <td className="py-3 px-4 text-text-light">{user.name}</td>
                  <td className="py-3 px-4 text-text-light">{user.email}</td>
                  <td className="py-3 px-4 text-text-light">{user.phone || '-'}</td>
                  <td className="py-3 px-4 text-text-light">{formatDate(user.created_at)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.is_blocked ? 'bg-red-600' : 'bg-green-600'
                    }`}>
                      {user.is_blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleBlockUser(user.id, user.is_blocked)}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        user.is_blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {user.is_blocked ? 'Unblock' : 'Block'}
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
