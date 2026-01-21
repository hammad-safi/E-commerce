# 🚀 Installation Guide - Universal Online Store

Follow these step-by-step instructions to get your e-commerce store up and running in 30 minutes!

## Step 1: Prerequisites Setup (5 minutes)

### Create Required Accounts

1. **MongoDB Atlas** (Free Database)
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a new project
   - Create a cluster (select free tier)
   - Wait for cluster to initialize (5-10 minutes)

2. **Stripe** (Payments)
   - Visit: https://dashboard.stripe.com
   - Sign up for free account
   - Go to Developers > API keys
   - Copy your TEST Publishable Key and Secret Key
   - Keep these keys safe!

3. **Facebook Business Account** (Optional but recommended)
   - Visit: https://business.facebook.com
   - Create business account
   - Go to Events Manager
   - Create new event/property
   - Copy your Pixel ID

4. **Vercel** (Free Hosting)
   - Visit: https://vercel.com
   - Sign up with GitHub account
   - Have your GitHub ready

## Step 2: MongoDB Setup (10 minutes)

### Get MongoDB Connection String

1. In MongoDB Atlas, click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string that looks like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/mydb
   ```

### Create MongoDB User

1. In MongoDB Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Username: `ecommerce_user`
4. Password: Create a strong password (mix of letters, numbers, symbols)
5. Built-in roles: "Editor"
6. Click "Create User"

### Allow All IP Addresses (For Development Only!)

1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere"
4. Confirm

## Step 3: Local Project Setup (10 minutes)

### Clone and Install

```bash
# Navigate to your project directory
cd c:\Users\Hammad\OneDrive\Desktop\e-commerce

# Install dependencies
npm install

# If npm install fails, try:
npm install --legacy-peer-deps
```

### Configure Environment Variables

1. Create file `.env.local` in root directory
2. Add the following:

```
# Store Details
NEXT_PUBLIC_SITE_NAME="Universal Online Store"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://ecommerce_user:your_password@cluster.mongodb.net/ecommerce

# Stripe (Test Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# Facebook Pixel
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_pixel_id_here

# Admin (Basic Auth)
ADMIN_EMAIL=admin@universalstore.com
ADMIN_PASSWORD=your_secure_password_here
```

**Replace:**
- `your_password` with your MongoDB user password
- `your_key_here` with your Stripe test keys
- `your_pixel_id_here` with your Facebook Pixel ID

### Test Local Development

```bash
npm run dev
```

Visit: http://localhost:3000

You should see the home page! 🎉

### Add Sample Products

In a new terminal:

```bash
npm run seed
```

This adds 12 sample products to your database.

## Step 4: Test the Store (5 minutes)

### Test Shopping Flow

1. Go to http://localhost:3000
2. Click "Shop Now"
3. Add products to cart
4. Go to checkout
5. **Try Payment:**
   - Choose "Cash on Delivery" first
   - Enter test details
   - Place order

6. **Test Order Tracking:**
   - Copy the Order ID shown
   - Go to "Track Order"
   - Enter Order ID + phone number
   - View order status

### Test Product Page

1. Click on any product
2. View details
3. Change quantity
4. Add to cart
5. Verify cart updates

## Step 5: Stripe Setup (5 minutes) - Optional

### Get Test Keys

1. Go to https://dashboard.stripe.com
2. Click "Developers" tab
3. Click "API Keys"
4. Under "Secret key", click "Reveal test key"
5. Copy both Publishable and Secret keys
6. Update `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY
   ```

### Test Stripe Payment

1. In checkout, select "Card Payment (Stripe)"
2. Use test card: `4242 4242 4242 4242`
3. Any future date (e.g., 12/34)
4. Any CVC (e.g., 123)
5. Click "Place Order"
6. See if payment processes

**Note:** Test payments don't charge real money!

## Step 6: Deploy to Vercel (10 minutes)

### Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Universal Online Store"

# Create new repo on GitHub
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/e-commerce.git
git branch -M main
git push -u origin main
```

### Deploy on Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Add environment variables:
   - Click "Environment Variables"
   - Add all variables from `.env.local`
   - Click "Deploy"

Wait 2-3 minutes for deployment to complete!

Your site is now live! 🚀

### Get Your Live URL

Vercel will give you a URL like: `https://ecommerce-xyz.vercel.app`

Visit it to see your store online!

## Step 7: Custom Domain (Optional)

1. Buy domain from:
   - Namecheap.com
   - GoDaddy.com
   - Domain.com

2. In Vercel:
   - Go to Project Settings > Domains
   - Add your domain
   - Follow DNS setup instructions

3. Update `.env.local` and redeploy:
   ```
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

## Step 8: Facebook Ads Setup (Optional)

### Install Pixel

1. Go to https://business.facebook.com/pixels
2. Create new pixel or use existing
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789
   ```

4. Verify pixel is working:
   - Install "Facebook Pixel Helper" chrome extension
   - Visit your site
   - You should see green checkmarks

### Create Facebook Ad Campaign

1. Go to https://ads.facebook.com
2. Create new campaign
3. Objective: "Conversions"
4. Conversion event: "Purchase"
5. Select your pixel
6. Create ad
7. Set budget and launch

### Track Conversions

Your store will automatically track:
- ✅ Page views
- ✅ Add to cart
- ✅ Purchases

## Troubleshooting

### "MongoDB connection failed"
- Check `.env.local` has correct MongoDB URI
- Verify username/password are correct
- Check IP whitelist in MongoDB Atlas
- Restart dev server: `npm run dev`

### "Stripe error"
- Use TEST mode keys (pk_test_, sk_test_)
- Don't use production keys
- Test card: `4242 4242 4242 4242`
- Any expiry date in future

### "No products showing"
- Run: `npm run seed`
- Check MongoDB connection
- Check browser console for errors

### "Cart not saving"
- Check if localStorage enabled
- Try incognito/private browser
- Check console for JS errors

### "PWA not installing"
- Must be HTTPS (works on Vercel)
- Works on Chrome/Edge
- Clear browser cache if issues

## Next Steps

Now that your store is live:

### 1. Add Your Real Products
Edit or create products in admin panel or MongoDB

### 2. Customize
- Change colors in `tailwind.config.ts`
- Update store name in `app/layout.tsx`
- Edit store description in README.md

### 3. Add More Features
- Email notifications
- Product reviews
- Wishlist
- Blog section
- Customer dashboard

### 4. Marketing
- Create Facebook ads
- Setup Google Analytics
- Email marketing integration
- Social media promotion

### 5. Security (For Production)
- Enable password auth for admin
- Add rate limiting
- Setup SSL certificate
- Use HTTPS everywhere
- Regular backups

## Getting Help

- Check README.md for documentation
- Review code comments
- Check Next.js docs: https://nextjs.org/docs
- MongoDB docs: https://docs.mongodb.com
- Stripe docs: https://stripe.com/docs

## Congratulations! 🎉

Your complete e-commerce store is now:
✅ Running locally
✅ Connected to database
✅ Deployed live on Vercel
✅ Ready to sell products
✅ Accepting orders
✅ Tracking sales

**You're officially in business!** 🚀

---

Need more help? Check the README.md file for additional documentation and resources.
