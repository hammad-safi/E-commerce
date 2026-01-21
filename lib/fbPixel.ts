export function trackFBPixelEvent(eventName: string, data?: any) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, data)
  }
}

export function trackPageView() {
  trackFBPixelEvent('PageView')
}

export function trackAddToCart(value: number, currency: string = 'PKR') {
  trackFBPixelEvent('AddToCart', {
    value,
    currency,
  })
}

export function trackPurchase(value: number, currency: string = 'PKR', orderId?: string) {
  trackFBPixelEvent('Purchase', {
    value,
    currency,
    order_id: orderId,
  })
}
