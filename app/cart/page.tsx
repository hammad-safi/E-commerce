'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Add some amazing products to get started!</p>
          <Link href="/products" className="btn-primary text-lg px-8 py-3">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">🛒 Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.productId} className="card p-4 flex gap-4">
                {/* Image */}
                <div className="relative w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image || 'https://via.placeholder.com/200x200'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-primary font-bold text-lg">
                    PKR {item.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity & Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕ Remove
                  </button>

                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-200"
                    >
                      −
                    </button>
                    <span className="px-3 font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-bold text-secondary">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <Link href="/products" className="btn-outline flex-1 text-center">
              Continue Shopping
            </Link>
            <button onClick={clearCart} className="btn-outline flex-1">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">📊 Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">PKR {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-bold">Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="text-primary font-bold text-2xl">
                    PKR {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center py-3 text-lg block">
              💳 Proceed to Checkout
            </Link>

            <p className="text-center text-sm text-gray-500 mt-4">
              🔒 Your payment is secure & encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
