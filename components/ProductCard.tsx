'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { trackAddToCart } from '@/lib/fbPixel'
import { useState } from 'react'

interface ProductCardProps {
  product: {
    _id: string
    title: string
    price: number
    image: string
    rating: number
    category: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
    trackAddToCart(product.price)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Link href={`/product/${product._id}`}>
      <div className="card overflow-hidden group cursor-pointer">
        {/* Image Container */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <Image
            src={product.image || 'https://via.placeholder.com/400x300'}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
            {product.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 my-2">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>

          {/* Price & Button */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-bold text-primary">PKR {product.price.toLocaleString()}</span>
            <button
              onClick={handleAddToCart}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-secondary text-white hover:bg-primary'
              }`}
            >
              {added ? '✓ Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
