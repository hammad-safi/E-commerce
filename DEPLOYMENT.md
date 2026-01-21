# 🚀 Deployment Guide - Deploy Your Store Live

## Deploy to Vercel (Easiest - 5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free)
- Your project on GitHub

### Step 1: Push to GitHub

```bash
cd c:\Users\Hammad\OneDrive\Desktop\e-commerce

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Universal Online Store - Initial commit"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/e-commerce.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Find your e-commerce repository
5. Click "Import"

### Step 3: Configure Environment Variables

On the import screen:

1. Scroll to "Environment Variables"
2. Add each variable:

```
NEXT_PUBLIC_SITE_NAME=Universal Online Store
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=xxx

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
STRIPE_SECRET_KEY=sk_test_xxx
ADMIN_EMAIL=admin@universalstore.com
ADMIN_PASSWORD=xxx
```

3. Click "Deploy"

**Wait 2-3 minutes for deployment...**

### Step 4: Access Your Store

Vercel will give you a URL like:
```
https://ecommerce-xyz.vercel.app
```

Your store is now **LIVE** 🎉

### Step 5: Custom Domain (Optional)

1. Buy domain from Namecheap, GoDaddy, etc.
2. In Vercel Dashboard:
   - Select your project
   - Go to "Settings" → "Domains"
   - Add your domain
   - Follow DNS setup

3. Update `.env.local`:
   ```
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. Commit and push:
   ```bash
   git add .env.local
   git commit -m "Update app URL to custom domain"
   git push origin main
   ```

Vercel will auto-redeploy!

## Deployment Checklist

Before deploying, verify:

- [ ] `.env.local` configured with all keys
- [ ] MongoDB URI is correct
- [ ] Stripe keys are TEST mode (pk_test_, sk_test_)
- [ ] Local testing works (`npm run dev`)
- [ ] Sample products added (`npm run seed`)
- [ ] GitHub repository created
- [ ] All files committed and pushed

## Environment Variables for Production

When deploying to Vercel:

```
NEXT_PUBLIC_SITE_NAME=Universal Online Store
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_123456  (TEST MODE)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
STRIPE_SECRET_KEY=sk_test_123456  (TEST MODE)
ADMIN_EMAIL=admin@universalstore.com
ADMIN_PASSWORD=your_secure_password
```

## Monitoring After Deployment

### In Vercel Dashboard

1. **Deployments** - See all deployments
2. **Analytics** - View page views and performance
3. **Functions** - Monitor API route performance
4. **Logs** - Check for errors

### Monitor in Real Time

```bash
# View deployment logs
vercel logs

# Check specific function
vercel logs /api/products
```

## Database Optimization for Production

### MongoDB Performance

1. Create indexes on frequently queried fields:
```javascript
db.products.createIndex({ category: 1 })
db.orders.createIndex({ orderId: 1, customerPhone: 1 })
```

2. Enable backups:
   - MongoDB Atlas → Project Settings → Backup
   - Enable daily backups

3. Monitor connections:
   - MongoDB Atlas → Metrics
   - Check connection limit usage

### Scaling Tips

- Use MongoDB connection pooling
- Cache frequently accessed data
- Enable CDN for images (Cloudinary)
- Use Vercel's Edge Caching

## Stripe Production Setup

### Switch to Live Keys

1. Go to https://dashboard.stripe.com
2. Click toggle "View test data" to OFF
3. Go to Developers → API keys
4. Copy LIVE keys (starts with pk_live_, sk_live_)
5. Update Vercel environment variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   STRIPE_SECRET_KEY=sk_live_xxx
   ```

### Important Security

- ⚠️ Never commit live keys to GitHub
- ⚠️ Always use environment variables
- ⚠️ Enable Stripe webhook signing
- ⚠️ Monitor Stripe dashboard for fraud

## Facebook Ads Production

### Verify Pixel

1. Install Facebook Pixel Helper
2. Visit your live site
3. See if pixel fires correctly

### Track Conversions

Your pixel will track:
- ✅ Page views
- ✅ Add to cart
- ✅ Purchases

View in Facebook Events Manager.

## SSL/HTTPS

✅ Automatically enabled on Vercel  
✅ Free SSL certificate  
✅ Auto-renews every 90 days

Your store is secure! 🔒

## Performance Optimization

### Image Optimization

```tsx
// Use Next.js Image component
import Image from 'next/image'

<Image 
  src={url}
  alt="Product"
  width={400}
  height={300}
  quality={80}
  priority={false}
/>
```

### Lazy Loading

```tsx
// Images load only when visible
import dynamic from 'next/dynamic'

const ProductCard = dynamic(() => import('@/components/ProductCard'), {
  loading: () => <p>Loading...</p>,
})
```

### Cache Strategy

Next.js automatically caches:
- Static pages (24 hours)
- API responses (configurable)
- Images (optimized)

## Error Monitoring (Optional)

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

Configure in `next.config.ts`:

```ts
import withSentry from '@sentry/nextjs/withSentry'

export default withSentry(nextConfig)
```

## Analytics Setup

### Google Analytics (Optional)

```tsx
// Add to app/layout.tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Facebook Pixel

Already integrated! ✅

Track:
- Page views
- Add to cart
- Purchases

## Continuous Deployment

### Auto-Deploy from GitHub

Every push to main branch auto-deploys:

```bash
git push origin main
```

Vercel builds and deploys automatically!

## Rollback to Previous Deployment

If something breaks:

1. In Vercel Dashboard
2. Go to "Deployments"
3. Find previous working deployment
4. Click "Redeploy"

Done! ✅

## Backup Strategy

### MongoDB Backups

1. MongoDB Atlas → Backup → Automated Backups
2. Enable backups (free tier: 7-day retention)
3. Download backup if needed

### GitHub Backup

Your code is already backed up on GitHub! ✅

### Manual Backup

```bash
# Backup MongoDB locally
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/db"

# Zip it
tar -czf backup-$(date +%Y%m%d).tar.gz dump/
```

## Performance Metrics

Monitor these KPIs:

- **Core Web Vitals**
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1

- **Business Metrics**
  - Conversion rate
  - Average order value
  - Cart abandonment rate

Check in:
- Vercel Analytics
- Facebook Analytics
- Google Analytics

## Security Checklist

Before going live:

- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] MongoDB IP whitelist configured
- [ ] Strong admin password
- [ ] Payment data encrypted
- [ ] PII not logged
- [ ] Rate limiting enabled (optional)

## Support & Troubleshooting

### Deployment Issues

**"Build failed"**
- Check Vercel logs
- Verify environment variables
- Test locally first

**"Database connection error"**
- Verify MongoDB URI
- Check IP whitelist
- Test connection locally

**"Payment not working"**
- Verify Stripe keys
- Check test mode
- Review Stripe logs

### Get Help

- Vercel Docs: https://vercel.com/docs
- Stripe Support: https://support.stripe.com
- MongoDB Support: https://support.mongodb.com
- Next.js Docs: https://nextjs.org/docs

## Congratulations! 🎉

Your store is now **LIVE** and ready for customers!

### What's Next?

1. ✅ Add your products
2. ✅ Create Facebook Ads campaigns
3. ✅ Monitor orders in admin
4. ✅ Track sales in analytics
5. ✅ Optimize and scale

---

**Your production e-commerce store is LIVE!** 🚀

Start selling today!
