# 🛍️ Universal Online Store - Complete E-Commerce Platform

A 100% free, production-ready e-commerce platform built with Next.js, MongoDB, and Stripe. No login required - perfect for Facebook Ads and instant conversions!

## 🚀 Features

✅ **No Login Required** - Guest checkout only  
✅ **Product Catalog** - Browse, search, filter products  
✅ **Shopping Cart** - localStorage-based cart management  
✅ **Multiple Payment Options** - Cash on Delivery (COD) & Stripe  
✅ **Order Tracking** - Track orders by Order ID + phone  
✅ **PWA Support** - Install as app on browsers and mobile  
✅ **Facebook Pixel** - Ad tracking and conversion pixel  
✅ **Admin Dashboard** - Manage products and orders  
✅ **Responsive Design** - Mobile-first design  
✅ **Free Hosting** - Deploy on Vercel  

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas (Free Tier)
- **Payments**: Stripe + Cash on Delivery
- **Hosting**: Vercel (Free)
- **PWA**: Next.js PWA Support
- **Analytics**: Facebook Pixel

## 📋 Prerequisites

Before you start, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas)
- Stripe account (free at https://stripe.com)
- Facebook Business Manager (for Pixel)
- Vercel account (for hosting)

## 🚀 Quick Start

### 1. Clone or Download Project

```bash
cd e-commerce
npm install
```

### 2. Set Up MongoDB

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce`
5. Create a database user and allow all IP addresses

### 3. Configure Environment Variables

Create `.env.local` file in the root directory:

```
NEXT_PUBLIC_SITE_NAME="Universal Online Store"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_pixel_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
STRIPE_SECRET_KEY=sk_test_your_key_here

ADMIN_EMAIL=admin@universalstore.com
ADMIN_PASSWORD=admin123456
```

### 4. Get Your Keys

**Stripe Keys:**
1. Go to https://dashboard.stripe.com
2. In Developers > API keys, copy your Publishable Key and Secret Key
3. Use the TEST mode keys for development

**Facebook Pixel ID:**
1. Go to https://business.facebook.com
2. Create a new Property in Events Manager
3. Copy your Pixel ID

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 6. Seed Sample Products (Optional)

Run this script to add sample products to your database:

```bash
npm run seed
```

## 📦 Project Structure

```
e-commerce/
├── app/
│   ├── api/                 # API routes
│   │   ├── products/        # Product endpoints
│   │   ├── orders/          # Order endpoints
│   │   └── orders/track/    # Order tracking
│   ├── admin/               # Admin dashboard
│   ├── cart/                # Cart page
│   ├── checkout/            # Checkout page
│   ├── product/[id]/        # Product detail
│   ├── products/            # Products listing
│   ├── track-order/         # Order tracking
│   ├── order-success/       # Success page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── contexts/                # React contexts
│   └── CartContext.tsx      # Cart state
├── lib/
│   ├── db.ts                # MongoDB connection
│   ├── models/              # Database models
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Admin.ts
│   ├── utils.ts             # Utility functions
│   └── fbPixel.ts           # Facebook Pixel
├── public/                  # Static files
│   ├── manifest.json        # PWA manifest
│   ├── sw.ts                # Service worker
│   └── offline.html
├── .env.local               # Environment variables
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

## 🛒 User Flow

### Shopping

1. User visits website → Home page
2. Browse products → Search & filter
3. View product details
4. Add to cart (stored in localStorage)
5. View cart
6. Proceed to checkout (NO LOGIN)
7. Enter: Name, Phone, Address
8. Choose payment method: COD or Card
9. Order placed with unique Order ID
10. Order confirmation page

### Order Tracking

1. User visits `/track-order`
2. Enters Order ID + Phone number
3. View order status, items, and tracking

## 💳 Payment Integration

### Cash on Delivery (COD)

- Default payment method
- Orders start with status "Pending"
- Perfect for Pakistan, South Asia

### Stripe Card Payments

- Requires Stripe account
- Test cards: `4242 4242 4242 4242`
- Automatic payment processing

## 📱 PWA (Install as App)

Users can install your store as an app on:
- Chrome/Edge browsers
- Android devices
- iOS (PWA support)

Features:
- Offline support
- Push notifications
- Standalone mode
- Home screen icon

## 🔍 Facebook Ads Integration

### Setup Facebook Pixel

1. Go to https://business.facebook.com/events_manager
2. Create a new event (Property)
3. Copy Pixel ID
4. Add to `.env.local`: `NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_id`

### Tracked Events

- ✅ Page View
- ✅ Add to Cart
- ✅ Purchase

### Create Facebook Ads Campaign

1. Go to https://ads.facebook.com
2. Create new campaign for "Conversions"
3. Set pixel as conversion event
4. Target audience
5. Set budget and launch

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables (same as `.env.local`)
6. Click "Deploy"

### Domain Setup

1. Buy domain (optional)
2. In Vercel, go to Project Settings > Domains
3. Add your domain
4. Update DNS settings

## 📊 Admin Dashboard

Access admin features at `/admin`:

- View orders and revenue
- Manage products
- View analytics
- Order management

**Note**: Currently has basic UI. Add authentication for production.

## 🎨 Customization

### Change Colors

Edit `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      primary: '#FF6B35',    // Orange (CTAs)
      secondary: '#004E89',  // Dark blue (Header)
      accent: '#F7A072',     // Light peach
    }
  }
}
```

### Store Name

1. Edit `app/layout.tsx`
2. Change metadata and site name
3. Update `public/manifest.json`

### Categories

Edit `CATEGORIES` in `app/products/page.tsx`

## 🔒 Security

- ✅ Environment variables for secrets
- ✅ Stripe secure payment handling
- ✅ Input validation on checkout
- ✅ HTTPS on Vercel
- ✅ MongoDB connection pooling

**For Production:**
- Add rate limiting
- Implement CAPTCHA
- Add order authentication
- Use HTTPS
- Regular security audits

## 📧 Email Setup (Optional)

To send order confirmations:

1. Install: `npm install nodemailer`
2. Add email service (Gmail, SendGrid, etc.)
3. Create API endpoint: `POST /api/emails/send`
4. Call on successful order

Example with Nodemailer:

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

await transporter.sendMail({
  to: email,
  subject: `Order Confirmation - ${orderId}`,
  html: `<h1>Order ${orderId} placed!</h1>`,
})
```

## 🐛 Troubleshooting

### Products not showing?
- Check MongoDB connection in `.env.local`
- Run: `npm run seed` to add sample products
- Check browser console for errors

### Cart not saving?
- Check if localStorage is enabled
- Try different browser
- Check for console errors

### Stripe errors?
- Use test keys (pk_test_/sk_test_)
- Check test card numbers on Stripe docs
- Verify Stripe publishable key in `.env.local`

### PWA not installing?
- Use HTTPS (works on Vercel automatically)
- Check manifest.json is valid
- Clear browser cache

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PWA Basics](https://web.dev/progressive-web-apps/)
- [Facebook Pixel Guide](https://www.facebook.com/business/help/742478679120153)

## 💰 Monetization Ideas

1. **Affiliate Links** - Earn from partner products
2. **Commission** - Take % from seller products
3. **Premium Listings** - Charge for featured products
4. **Sponsored Ads** - Brands can advertise
5. **Subscription Plans** - Monthly seller fees

## 🤝 Contributing

Feel free to fork and improve!

## 📄 License

MIT License - Free to use commercially

## 📞 Support

📧 support@universalstore.com  
🌐 https://universalstore.com  

## 🎉 You're All Set!

Your e-commerce store is ready to go live!

### Next Steps:

1. ✅ Add your products
2. ✅ Test checkout process
3. ✅ Set up payment methods
4. ✅ Create Facebook Ads campaigns
5. ✅ Deploy to Vercel
6. ✅ Start selling!

---

**Remember**: This is a free, open-source project. For production use, consider:
- Enhanced security
- Professional hosting
- Customer support system
- Advanced analytics
- Email marketing integration

Happy selling! 🚀
