'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import api from '@/services/api'

export default function BulkUploadPage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      toast.error('Please select a CSV file')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await api.post('/api/admin/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResults(data.results)
      toast.success('Bulk upload completed')
    } catch (error) {
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-serif text-gradient mb-8">Bulk Upload</h1>

      <div className="card max-w-2xl mb-8">
        <h3 className="text-xl font-semibold text-text-light mb-4">Upload CSV File</h3>
        <p className="text-text-light mb-4 text-sm">
          Required columns: name, description, category, price, stock
        </p>

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="input-field"
            required
          />
          <button
            type="submit"
            disabled={uploading}
            className="btn-primary disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </form>
      </div>

      {results && (
        <div className="card">
          <h3 className="text-xl font-semibold text-text-light mb-6">Upload Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-text-light text-sm">Total Rows</p>
              <p className="text-3xl font-bold text-primary">{results.totalRows}</p>
            </div>
            <div>
              <p className="text-text-light text-sm">Successfully Created</p>
              <p className="text-3xl font-bold text-green-400">{results.successful_inserts}</p>
            </div>
            <div>
              <p className="text-text-light text-sm">Updated</p>
              <p className="text-3xl font-bold text-blue-400">{results.updated_count}</p>
            </div>
            <div>
              <p className="text-text-light text-sm">Errors</p>
              <p className="text-3xl font-bold text-red-400">{results.error_count}</p>
            </div>
          </div>

          {results.error_details && Object.keys(results.error_details).length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-text-light mb-4">Errors</h4>
              <div className="bg-red-900/20 border border-red-600 rounded p-4">
                <pre className="text-red-400 text-sm overflow-auto">
                  {JSON.stringify(results.error_details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card mt-8 bg-border-dark">
        <h3 className="text-lg font-semibold text-text-light mb-4">CSV Format Example</h3>
        <pre className="text-text-light text-sm overflow-auto">
{`name,description,category,price,stock
Diamond Ring,Beautiful diamond ring,rings,15000,50
Gold Necklace,Elegant gold necklace,necklaces,25000,30`}
        </pre>
      </div>
    </div>
  )
}
