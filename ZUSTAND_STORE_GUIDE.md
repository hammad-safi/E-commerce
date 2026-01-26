# Zustand Store - Global Product Management

## Overview

This Zustand store implements a **global, persistent state management** system for products that:
- ✅ Loads data **only once** from API
- ✅ Prevents refetching on route changes
- ✅ Persists data in localStorage
- ✅ Uses smart caching with expiration
- ✅ Prevents infinite loading states
- ✅ Works seamlessly with Next.js App Router

## Store Structure

### File: `lib/store.ts`

The store exports:
- `useProductStore()` - Zustand hook to access global state
- **State variables:**
  - `products[]` - All cached products
  - `loading` - Global loading state
  - `error` - Error message if fetch fails
  - `lastFetchTime` - Timestamp of last fetch

- **Actions:**
  - `fetchProducts()` - Fetch products with smart caching
  - `setProducts()` - Manually set products
  - `clearProducts()` - Clear cache

## How It Works

### 1. First Page Load
```
Component mounts → fetchProducts() called
  ↓
Check: Are products already cached? NO
Check: Is loading? NO
  ↓
Set loading = true
Fetch from /api/products?limit=10000
  ↓
Save to: Memory (global) + localStorage
Set loading = false
```

### 2. Route Change / Component Remount
```
Component mounts → fetchProducts() called
  ↓
Check: Are products cached? YES
Check: Is cache still valid (< 1 hour)? YES
  ↓
Return immediately - NO API CALL
(Data loads from memory/localStorage instantly)
```

### 3. Search/Filter Changes
```
User searches/filters
  ↓
Local state updates (search, category, priceRange)
  ↓
useMemo recalculates filtered results
  ↓
NO API CALL - filtering done in memory
```

## Usage Example

### In a Component
```tsx
'use client'

import { useProductStore } from '@/lib/store'

export default function MyComponent() {
  // Get store
  const { products, loading, fetchProducts } = useProductStore()

  // Fetch on mount (only calls API once)
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (loading && products.length === 0) return <div>Loading...</div>

  return (
    <div>
      {products.map(p => (
        <div key={p._id}>{p.title}</div>
      ))}
    </div>
  )
}
```

### Guard Mechanisms

**Guard 1: Check if cache exists**
```ts
if (state.products.length > 0 && now - state.lastFetchTime < CACHE_DURATION) {
  return // Don't fetch again
}
```

**Guard 2: Prevent multiple simultaneous fetches**
```ts
if (state.loading) {
  return // Don't fetch if already loading
}
```

## Performance Benefits

| Action | Before | After |
|--------|--------|-------|
| First load | ~500ms API call | ~500ms API call (first time only) |
| Route change | ~500ms API call | Instant (from cache) |
| Search | ~500ms per search | Instant (client-side filter) |
| Filter | ~500ms per filter | Instant (client-side filter) |
| Refresh page | ~500ms API call | Instant (from localStorage) |

## Persistence

The store persists **only**:
- `products[]` - The full product list
- `lastFetchTime` - Timestamp for cache validation

This keeps localStorage small while maintaining full functionality.

## Environment Variables

No special config needed. The store automatically:
- Uses localStorage if available
- Falls back to memory cache if localStorage unavailable
- Works on both client and server (hydrates properly)

## Cache Expiration

Default: **1 hour**

Change in `lib/store.ts`:
```ts
const CACHE_DURATION = 1000 * 60 * 60 // Change this value
```

## API Response Expected

```json
{
  "success": true,
  "products": [
    {
      "_id": "123",
      "title": "Product Name",
      "price": 5000,
      "images": ["url"],
      "rating": 4.5,
      "category": "Electronics"
    }
  ]
}
```

## Testing

### Test 1: Only fetches once
```
1. Open /products → See "Loading..." then products
2. Navigate away → products stay in store
3. Return to /products → Products show instantly
4. Check Network tab → No new API call
```

### Test 2: localStorage persistence
```
1. Load products
2. Hard refresh page (Ctrl+Shift+R)
3. Products show instantly (from localStorage)
4. No "Loading..." spinner
```

### Test 3: Search doesn't refetch
```
1. Type in search
2. Check Network tab → NO /api/products calls
3. Results filter instantly
```

## Common Issues & Solutions

### Issue: Products not appearing after refresh
**Solution:** Check browser localStorage is enabled and not full

### Issue: Cache never expires
**Solution:** Clear localStorage or change CACHE_DURATION

### Issue: Infinite loading state
**Solution:** The loading guard prevents this - each fetch sets loading = false

## Next Steps

1. Install dependencies:
```bash
npm install
```

2. Use in any component:
```tsx
import { useProductStore } from '@/lib/store'

const { products, loading, fetchProducts } = useProductStore()
```

3. That's it! No additional setup needed.

## Advanced: Invalidate Cache Manually

```tsx
// Force refetch (skip cache)
const { clearProducts, fetchProducts } = useProductStore()

// Clear and refetch
clearProducts()
fetchProducts()
```

---

**Result:** Your e-commerce app now loads products once and filters everything client-side! 🚀
