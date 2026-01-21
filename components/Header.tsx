'use client'

import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

export default function Header() {
  const { totalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">🛍️</div>
            <span className="text-xl font-bold">Universal Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="hover:text-accent transition">
              Home
            </Link>
            <Link href="/products" className="hover:text-accent transition">
              Products
            </Link>
            <Link href="/track-order" className="hover:text-accent transition">
              Track Order
            </Link>
          </nav>

          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <div className="text-2xl hover:scale-110 transition">🛒</div>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-accent/30 pt-4 space-y-3">
            <Link href="/" className="block hover:text-accent transition">
              Home
            </Link>
            <Link href="/products" className="block hover:text-accent transition">
              Products
            </Link>
            <Link href="/track-order" className="block hover:text-accent transition">
              Track Order
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
