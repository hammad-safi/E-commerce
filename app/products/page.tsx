'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Fetch all products for suggestions
    fetchAllProducts()
    fetchProducts()

    // Close suggestions on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchAllProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=1000')
      const data = await res.json()
      if (data.success) {
        setAllProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching all products:', error)
    }
  }

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
    setShowSuggestions(false)
    fetchProducts()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    setPage(1)

    if (value.trim()) {
      const matches = allProducts.filter((p) =>
        p.title.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(matches.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (product: Product) => {
    setSearch(product.title)
    setShowSuggestions(false)
  }

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        setInstallPrompt(null)
        setShowInstall(false)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">🛍️ Our Products</h1>

      {/* Install PWA Button on Mobile */}
      {showInstall && (
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg flex justify-between items-center md:hidden">
          <div>
            <p className="font-bold text-blue-900">📱 Install App</p>
            <p className="text-sm text-blue-700">Get our store on your home screen</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="btn-primary px-4 py-2 text-sm"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className="btn-outline px-4 py-2 text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Search Bar with Suggestions */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative" ref={suggestionsRef}>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                onFocus={() => search.trim() && setShowSuggestions(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50 max-h-64 overflow-y-auto">
                  {suggestions.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 border-b last:border-b-0 flex items-start gap-3"
                    >
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/40x40'}
                        alt={product.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.title}</p>
                        <p className="text-xs text-gray-500">PKR {product.price.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="btn-primary px-6">
              🔍 Search
            </button>
          </div>
        </form>

        {/* Collapsible Category & Price Filter - Mobile Only */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg font-bold transition"
          >
            <span>📂 Filters</span>
            <span className="text-lg">{showCategoryFilter ? '▾' : '▸'}</span>
          </button>

          {showCategoryFilter && (
            <div className="mt-3 bg-white p-4 rounded-lg border-2 border-gray-300">
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
                        setShowCategoryFilter(false)
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
                  setShowCategoryFilter(false)
                }}
                className="w-full mt-6 btn-outline"
              >
                🔄 Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters - Desktop Only */}
        <div className="hidden lg:block lg:col-span-1">
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
