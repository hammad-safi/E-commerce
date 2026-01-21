'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

interface Product {
  _id: string
  title: string
  price: number
  images: string[]
  rating: number
  category: string
}

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Digital Products', 'Home & Garden', 'Sports']
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under 5,000', min: 0, max: 5000 },
  { label: '5,000 - 10,000', min: 5000, max: 10000 },
  { label: '10,000 - 50,000', min: 10000, max: 50000 },
  { label: 'Above 50,000', min: 50000, max: Infinity },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [search, category, page])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let url = `/api/products?page=${page}&limit=12`
      if (category !== 'All') url += `&category=${category}`
      if (search) url += `&search=${search}`

      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (p) => p.price >= priceRange.min && p.price <= priceRange.max
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">🛍️ Our Products</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          <button type="submit" className="btn-primary px-6">
            🔍 Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">📂 Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat)
                      setPage(1)
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                      category === cat
                        ? 'bg-primary text-white font-bold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-bold text-lg mb-4">💰 Price</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPriceRange(range)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                      priceRange === range
                        ? 'bg-primary text-white font-bold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearch('')
                setCategory('All')
                setPriceRange(PRICE_RANGES[0])
                setPage(1)
              }}
              className="w-full mt-6 btn-outline"
            >
              🔄 Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">⏳ Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      ...product,
                      image: product.images?.[0] || 'https://via.placeholder.com/400x300',
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <span className="py-2 px-4 font-bold">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">😞 No products found</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
              <button
                onClick={() => {
                  setSearch('')
                  setCategory('All')
                  setPriceRange(PRICE_RANGES[0])
                }}
                className="btn-primary mt-4"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
