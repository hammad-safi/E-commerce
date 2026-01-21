'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-gray-300 text-sm">
              Universal Online Store - Your trusted destination for digital and physical products.
              Shop with confidence, no login required!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-accent transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-accent transition">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm mb-2">📧 support@universalstore.com</p>
            <p className="text-gray-300 text-sm mb-2">📱 +1 (555) 123-4567</p>
            <p className="text-gray-300 text-sm">🏪 Open 24/7</p>
          </div>
        </div>

        <div className="border-t border-accent/30 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {currentYear} Universal Online Store. All rights reserved.</p>
          <p className="mt-2">✨ Built with Next.js, Stripe & MongoDB</p>
        </div>
      </div>
    </footer>
  )
}
