'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  _id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  rating: number
  reviews: number
}

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Digital Products', 'Home & Garden', 'Sports', 'Other']

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'Electronics',
    stock: 0,
    images: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        category: selectedCategory === 'All' ? '' : selectedCategory,
      })

      const res = await fetch(`/api/admin/products?${params}`)
      const data = await res.json()

      if (data.success) {
        setProducts(data.products)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const images = formData.images
      .split('\n')
      .map(url => url.trim())
      .filter(url => url)

    const payload = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price.toString()),
      category: formData.category,
      stock: parseInt(formData.stock.toString()),
      images,
      ...(editingId && { productId: editingId }),
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        alert(editingId ? 'Product updated!' : 'Product created!')
        setFormData({ title: '', description: '', price: 0, category: 'Electronics', stock: 0, images: '' })
        setIsAdding(false)
        setEditingId(null)
        fetchProducts()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images.join('\n'),
    })
    setEditingId(product._id)
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        alert('Product deleted!')
        fetchProducts()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8">📦 Manage Products</h1>

      {/* Add Product Button */}
      <button
        onClick={() => {
          setIsAdding(!isAdding)
          if (isAdding) {
            setFormData({ title: '', description: '', price: 0, category: 'Electronics', stock: 0, images: '' })
            setEditingId(null)
          }
        }}
        className="mb-6 btn-primary"
      >
        {isAdding ? '✕ Cancel' : '+ Add New Product'}
      </button>

      {/* Add/Edit Product Form */}
      {isAdding && (
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Product Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Price (PKR) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Image URLs (one per line)</label>
              <textarea
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                className="w-full px-4 py-2 border rounded-lg h-24 font-mono text-sm"
              />
              <p className="text-sm text-gray-600 mt-1">
                Tip: Use Cloudinary URLs or local paths like /products/image.jpg
              </p>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setEditingId(null)
                  setFormData({ title: '', description: '', price: 0, category: 'Electronics', stock: 0, images: '' })
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2 border rounded-lg"
          />

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="card p-8 text-center">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-500">No products found. Create one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="card p-6 hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex gap-4 flex-wrap">
                    <span className="text-primary font-bold">PKR {product.price.toLocaleString()}</span>
                    <span className="bg-blue-100 px-3 py-1 rounded text-sm">{product.category}</span>
                    <span className="text-sm">📦 Stock: {product.stock}</span>
                    <span className="text-sm">⭐ {product.rating} ({product.reviews} reviews)</span>
                  </div>
                  {product.images.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">🖼️ {product.images.length} image(s)</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            ← Previous
          </button>
          <div className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
