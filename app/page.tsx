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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=8')
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            🛍️ Universal Online Store
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Shop the best digital & physical products. No login required. Instant checkout.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="btn-primary">
              🛒 Shop Now
            </Link>
            <Link href="/cart" className="btn-outline">
              📦 View Cart
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="font-bold text-lg mb-2">Multiple Payment Options</h3>
              <p className="text-gray-600">COD, Card, and more payment methods available</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold text-lg mb-2">Install as App</h3>
              <p className="text-gray-600">Use on your phone and desktop like an app</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Featured Products */}
      <section className="py-5">
        <div className="max-w-7xl mx-auto px-4">
          {/* <h2 className="text-3xl font-bold mb-8 text-center">
            ⭐ Featured Products
          </h2> */}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      ...product,
                      image: product.images?.[0] || 'https://via.placeholder.com/400x300',
                    }}
                  />
                ))}
              </div>
              <div className="text-center">
                <Link href="/products" className="btn-secondary">
                  View All Products →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products available yet.</p>
              <p className="text-gray-400">Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to shop?</h2>
          <p className="text-lg mb-6 opacity-90">
            Browse our collection of amazing products today!
          </p>
          <Link href="/products" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Start Shopping
          </Link>
        </div>
      </section>
    </>
  )
}
