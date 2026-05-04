'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'
import Loader from '@/components/Loader'
import Link from 'next/link'
import { toast } from 'react-toastify'

export default function AdminCategoriesPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/api/categories')
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/admin/categories', formData)
      setCategories([...categories, data.category])
      setFormData({ name: '', slug: '', description: '' })
      setShowForm(false)
      toast.success('Category added successfully')
    } catch (error) {
      toast.error('Failed to add category')
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-serif text-gradient">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? '✕ Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddCategory} className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Slug (e.g., rings)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field mt-4"
            rows="3"
          />
          <button type="submit" className="btn-primary mt-4">
            Add Category
          </button>
        </form>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl text-text-light mb-4">No categories yet</p>
        </div>
      ) : (
        <div className="admin-grid">
          {categories.map((category) => (
            <div key={category.id} className="card">
              <h3 className="text-lg font-semibold text-text-light mb-2">{category.name}</h3>
              <p className="text-sm text-text-light mb-4">{category.description}</p>
              <p className="text-sm text-primary mb-4">Slug: {category.slug}</p>
              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-sm">Edit</button>
                <button className="flex-1 btn-danger text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
