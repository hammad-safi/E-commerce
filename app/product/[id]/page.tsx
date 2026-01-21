'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { trackAddToCart } from '@/lib/fbPixel'
import Link from 'next/link'

interface Product {
  _id: string
  title: string
  description: string
  price: number
  images: string[]
  stock: number
  rating: number
  reviews: number
  category: string
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`)
      const data = await res.json()
      if (data.success) {
        setProduct(data.product)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.images?.[0] || 'https://via.placeholder.com/400x300',
    })
    trackAddToCart(product.price * quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Product not found</p>
          <Link href="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/products" className="text-primary hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={product.images?.[0] || 'https://via.placeholder.com/500x500'}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2 mt-4">
            {product.images?.slice(1, 4).map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={img}
                  alt={`Product ${idx + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-yellow-400 text-2xl">⭐</span>
            <span className="text-lg font-bold">{product.rating.toFixed(1)}</span>
            <span className="text-gray-500">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="bg-primary text-white p-6 rounded-lg mb-6">
            <p className="text-sm opacity-80 mb-2">Price</p>
            <p className="text-4xl font-bold">PKR {product.price.toLocaleString()}</p>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <p className={`text-lg font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `✅ In Stock (${product.stock} available)` : '❌ Out of Stock'}
            </p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-3">📋 Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                  className="w-16 text-center border border-gray-300 rounded-lg py-2"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 font-bold text-lg rounded-lg transition py-2 ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-secondary text-white hover:bg-primary'
                }`}
              >
                {added ? '✓ Added to Cart' : '🛒 Add to Cart'}
              </button>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <Link href="/cart" className="flex-1 btn-primary text-center">
              🛒 Go to Cart
            </Link>
            <Link href="/products" className="flex-1 btn-outline text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
