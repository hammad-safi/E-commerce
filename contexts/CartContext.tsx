'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
  productId: string
  title: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalPrice: number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, mounted])

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === newItem.productId)

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      }

      return [...prevCart, newItem]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
