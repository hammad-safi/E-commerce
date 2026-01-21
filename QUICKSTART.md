# 🚀 Quick Start Guide

## 30-Second Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your keys
# (See INSTALLATION.md for details)

# 3. Start development server
npm run dev

# 4. Add sample products
npm run seed

# 5. Visit http://localhost:3000
```

## File Overview

| File/Folder | Purpose |
|---|---|
| `app/` | All pages and API routes |
| `components/` | React components (Header, Footer, ProductCard) |
| `contexts/` | Cart state management |
| `lib/` | Database models, utilities, config |
| `public/` | Static files (manifest, service worker) |
| `.env.local` | Environment variables (create this!) |
| `tailwind.config.ts` | Styling configuration |

## Quick Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Database
npm run seed            # Add 12 sample products

# Production
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Check for code errors
```

## Pages & Features

| Page | URL | Purpose |
|---|---|---|
| Home | `/` | Hero section + featured products |
| Products | `/products` | Browse all products with search & filter |
| Product Detail | `/product/[id]` | Single product view |
| Cart | `/cart` | View & manage cart items |
| Checkout | `/checkout` | Guest checkout (no login!) |
| Order Success | `/order-success/[id]` | Confirmation page |
| Track Order | `/track-order` | Order lookup by ID + phone |
| Admin | `/admin` | Admin dashboard |

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | Fetch all products (with search) |
| GET | `/api/products/[id]` | Fetch single product |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/track` | Track order by ID + phone |

## Environment Variables Required

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# Facebook
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Key Features ✅

- ✅ No login required (guest checkout)
- ✅ Shopping cart with localStorage
- ✅ Multiple payment methods (COD + Stripe)
- ✅ Order tracking without login
- ✅ Mobile-responsive design
- ✅ PWA support (install as app)
- ✅ Facebook Pixel integration
- ✅ Product search & filtering
- ✅ Admin dashboard
- ✅ Free & open source

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Payments**: Stripe, COD
- **Hosting**: Vercel (free)
- **Analytics**: Facebook Pixel

## Common Tasks

### Add a Product Manually

```javascript
// POST /api/admin/products
{
  "title": "Product Name",
  "description": "Description",
  "price": 2999,
  "category": "Electronics",
  "images": ["url1", "url2"],
  "stock": 100
}
```

### Change Store Name

Edit `app/layout.tsx` and `public/manifest.json`

### Change Colors

Edit `tailwind.config.ts`:
```ts
colors: {
  primary: '#FF6B35',    // Change these
  secondary: '#004E89',
  accent: '#F7A072'
}
```

### Enable Stripe Payments

1. Get Stripe test keys
2. Add to `.env.local`
3. In checkout, select "Card Payment"

## Deployment Checklist

- [ ] MongoDB Atlas set up
- [ ] Stripe account created
- [ ] `.env.local` configured
- [ ] Local testing complete
- [ ] Products added (via seed or manually)
- [ ] GitHub repo created
- [ ] Vercel account created
- [ ] Deployed to Vercel
- [ ] Domain configured (optional)
- [ ] Facebook Pixel installed

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Docs](https://vercel.com/docs)

## Support Resources

- 📖 Read `README.md` for detailed guide
- 📋 Follow `INSTALLATION.md` for step-by-step setup
- 💬 Check code comments for explanations
- 🔍 Search error messages in documentation

## What's Included

✅ Complete e-commerce frontend  
✅ Backend API (Next.js routes)  
✅ Database models  
✅ Cart management  
✅ Order system  
✅ Payment integration  
✅ PWA setup  
✅ Admin dashboard  
✅ Facebook Pixel tracking  
✅ Sample data  

## What You Need to Add

- Your own product data
- Stripe keys (for card payments)
- MongoDB connection
- Facebook Pixel ID (for tracking)
- Custom domain (optional)
- Email setup (optional)

## Pro Tips

1. **Test locally first** before deploying
2. **Use test mode** for Stripe in development
3. **Add IP whitelist** in MongoDB for security
4. **Use environment variables** for all secrets
5. **Deploy on Vercel** for free hosting
6. **Backup MongoDB** regularly
7. **Monitor orders** in admin dashboard

## Next Features to Add

- [ ] User accounts & login
- [ ] Product reviews
- [ ] Wishlist
- [ ] Email confirmations
- [ ] Advanced analytics
- [ ] Blog section
- [ ] Multi-vendor support
- [ ] Subscription products

---

**You're ready to launch! 🎉**

Start with `npm run dev` and visit http://localhost:3000

Questions? Check README.md or INSTALLATION.md
