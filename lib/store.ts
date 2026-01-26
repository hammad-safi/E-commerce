import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  _id: string
  title: string
  price: number
  images: string[]
  rating: number
  category: string
}

interface ProductStore {
  products: Product[]
  loading: boolean
  error: string | null
  lastFetchTime: number
  fetchProducts: () => Promise<void>
  setProducts: (products: Product[]) => void
  clearProducts: () => void
}

const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      lastFetchTime: 0,

      // Fetch products - only if cache is expired or empty
      fetchProducts: async () => {
        const state = get()
        const now = Date.now()

        // Guard: Check if data exists and cache is still valid
        if (state.products.length > 0 && now - state.lastFetchTime < CACHE_DURATION) {
          return
        }

        // Guard: Prevent multiple simultaneous fetches
        if (state.loading) {
          return
        }

        set({ loading: true, error: null })

        try {
          const response = await fetch('/api/products?limit=10000')
          const data = await response.json()

          if (data.success && data.products) {
            set({
              products: data.products,
              lastFetchTime: Date.now(),
              loading: false,
            })
          } else {
            set({
              error: 'Failed to load products',
              loading: false,
            })
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error fetching products',
            loading: false,
          })
        }
      },

      // Manually set products
      setProducts: (products) => {
        set({
          products,
          lastFetchTime: Date.now(),
        })
      },

      // Clear products and reset state
      clearProducts: () => {
        set({
          products: [],
          loading: false,
          error: null,
          lastFetchTime: 0,
        })
      },
    }),
    {
      name: 'product-store', // localStorage key
      partialize: (state) => ({
        products: state.products,
        lastFetchTime: state.lastFetchTime,
      }), // Persist only products and timestamp
    }
  )
)
