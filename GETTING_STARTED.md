# AuraGems - Getting Started Guide

## 🎯 Quick Start (5 Minutes)

### What You Have
A complete, production-ready e-commerce platform with:
- ✅ User-facing website (homepage, products, cart, checkout)
- ✅ Professional admin dashboard
- ✅ Payment integration (Razorpay)
- ✅ Database setup (Supabase)
- ✅ Authentication system
- ✅ All API routes
- ✅ Full documentation

### What You Need to Do

1. **Get API Keys** (10 minutes)
   - [ ] Create Supabase project → Get keys
   - [ ] Create Razorpay account → Get keys
   - [ ] Create Vercel account (for deployment)

2. **Setup Locally** (10 minutes)
   - [ ] Copy `.env.local.example` to `.env.local`
   - [ ] Fill in your API keys
   - [ ] Run `npm install`
   - [ ] Run `npm run dev`
   - [ ] Visit `http://localhost:3000`

3. **Setup Database** (5 minutes)
   - [ ] Go to Supabase SQL Editor
   - [ ] Copy-paste `lib/database/schema.sql`
   - [ ] Execute

4. **Create Admin User** (2 minutes)
   - [ ] Signup at localhost:3000/auth/signup
   - [ ] Go to Supabase → users table
   - [ ] Set `is_admin` to true for your user

5. **Add Initial Data** (10 minutes)
   - [ ] Go to /admin/categories
   - [ ] Add categories (rings, necklaces, etc.)
   - [ ] Go to /admin/products
   - [ ] Add sample products

---

## 📋 Step-by-Step Walkthrough

### STEP 1: Create Supabase Project

**Why?** Database and authentication

**How:**
1. Go to https://supabase.com
2. Click "Start Your Project"
3. Sign up with GitHub or email
4. Click "New Project"
5. Fill details:
   - Name: `auragems`
   - Password: (strong, save it!)
   - Region: Choose closest to you
6. Wait for creation (2-3 minutes)

**What to save:**
- Project URL: `https://xxxx.supabase.co` → `NEXT_PUBLIC_SUPABASE_URL`
- Anon Key: `eyJhbGc...` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Service Role Key: Get from Settings → API → Service Role Secret → `SUPABASE_SERVICE_ROLE_KEY`

### STEP 2: Create Razorpay Account

**Why?** Payment processing

**How:**
1. Go to https://razorpay.com
2. Click "Sign Up"
3. Fill in details
4. Verify email
5. Complete KYC (takes 5 minutes)
6. Go to Settings → API Keys
7. Copy both keys

**What to save:**
- Key ID: `rzp_test_xxxxx` → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- Secret: `xxxxx` → `RAZORPAY_KEY_SECRET`

### STEP 3: Download Project

**Already done!** Files are in `h:\Project\auragems`

### STEP 4: Setup Environment

**Create `.env.local`:**

1. In your project root, create file `.env.local`
2. Copy this and fill with YOUR keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
ADMIN_SECRET_KEY=your-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### STEP 5: Install Dependencies

```bash
npm install
```

Wait for installation to complete.

### STEP 6: Setup Database

1. Go to Supabase Dashboard
2. Click "SQL Editor" (left sidebar)
3. Click "New Query"
4. Open file: `lib/database/schema.sql`
5. Copy ALL contents
6. Paste into SQL Editor
7. Click "Run" button
8. Wait for success

You should see 9 tables created:
- categories
- products
- product_images
- users
- addresses
- orders
- order_items
- coupons
- bulk_upload_logs

### STEP 7: Run Locally

```bash
npm run dev
```

You'll see:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Visit `http://localhost:3000` in browser ✅

### STEP 8: Create Admin User

1. Click "Sign Up" link
2. Use your email
3. Create password
4. Submit

5. Go to Supabase Dashboard
6. Click "Table Editor" (left)
7. Click "users" table
8. Find your user
9. Click "is_admin" column
10. Change from FALSE to TRUE
11. Save

### STEP 9: Add Categories

1. Go to `http://localhost:3000/admin/dashboard`
2. You should be logged in
3. Click "Categories" in sidebar
4. Click "+ Add Category"
5. Fill in:
   - Name: `Rings`
   - Slug: `rings`
   - Description: `Beautiful handmade rings`
6. Click "Add Category"

Repeat for:
- Necklaces
- Bracelets
- Earrings
- Anklets
- Sets

### STEP 10: Add Products

1. Go to Admin → Products
2. Click "+ Add Product"
3. Fill in:
   - Name: `Diamond Ring`
   - Description: `Beautiful diamond ring`
   - Price: `15000`
   - MRP: `18000`
   - Stock: `50`
   - SKU: `RING-001`
   - Category: Select from dropdown
   - Brand: `AuraGems`
4. Click "Add Product"

**Note:** Image upload feature needs Supabase Storage setup (optional for now)

### STEP 11: Test Checkout

1. Go to `http://localhost:3000`
2. Click on a product
3. Click "Add to Cart"
4. Go to cart (🛒 icon)
5. Click "Proceed to Checkout"
6. Fill in address
7. Select payment method
8. For testing: Use COD (Cash on Delivery)

Congrats! You have a working e-commerce site! 🎉

---

## 🚀 Deploy to Production

### STEP 1: Push to GitHub

```bash
cd auragems
git init
git add .
git commit -m "AuraGems e-commerce platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/auragems.git
git push -u origin main
```

### STEP 2: Deploy on Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Find your `auragems` repository
5. Click "Import"
6. **Set Environment Variables** (Important!)
   - Add all 6 variables from `.env.local`
   - Use PRODUCTION Razorpay keys (not test keys)
7. Click "Deploy"
8. Wait 2-3 minutes
9. You'll get a URL like `https://auragems.vercel.app`

### STEP 3: Add Custom Domain

1. Go to **Settings** → **Domains**
2. Add your domain
3. Update DNS records (follow Vercel's instructions)
4. Wait 24-48 hours for SSL certificate

---

## 📱 Features You Have

### For Customers
- Browse products with filters
- View detailed product pages
- Shopping cart
- Checkout form
- Razorpay payment
- Order history
- User authentication

### For Admin
- Dashboard with analytics
- Product management
- Order management
- Coupon creation
- User management
- Bulk CSV upload

---

## 🔧 Troubleshooting

### "Cannot find module"
```bash
npm install
npm run dev
```

### "Database connection failed"
- Check Supabase URL in `.env.local`
- Check Supabase is running
- Check internet connection

### "Razorpay is not defined"
- Reload page
- Check browser console for errors
- Verify Razorpay keys are correct

### "Admin login not working"
- Check `is_admin` is TRUE in Supabase
- Logout and login again
- Clear browser cache

### "Products not showing"
- Go to Admin → Products
- Add at least one product
- Go back to homepage
- Refresh page

---

## 📞 Need Help?

### Quick Links
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Razorpay Docs](https://razorpay.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

### Common Issues
See `README.md` → Troubleshooting section

---

## ✨ What's Next?

After getting it running:

1. **Customize Theme**
   - Edit `tailwind.config.js`
   - Change color scheme
   - Update logo text

2. **Add Your Content**
   - Add real products
   - Upload images
   - Write descriptions

3. **Setup Email**
   - Configure Supabase emails
   - Send order confirmations

4. **Social Integration**
   - Add social login
   - Add social sharing

5. **Advanced Features**
   - Reviews & ratings
   - Wishlist
   - Recommendations

---

## 🎓 Project Structure Quick Reference

```
auragems/
├── app/
│   ├── admin/           # Admin pages
│   ├── api/             # API routes
│   ├── auth/            # Login/signup
│   ├── products/        # Product pages
│   ├── cart/            # Cart page
│   ├── checkout/        # Checkout page
│   └── page.js          # Homepage
├── components/          # Reusable components
├── context/             # Auth & Cart state
├── services/            # API calls
├── lib/                 # Utilities & config
├── styles/              # CSS
├── public/              # Images
├── package.json
├── README.md
├── DEPLOYMENT.md
├── API.md
└── PROJECT_SUMMARY.md
```

---

## 📊 Project Stats

- **Pages**: 20+
- **Components**: 12+
- **API Routes**: 20+
- **Database Tables**: 9
- **Lines of Code**: 5000+
- **Documentation**: Complete

---

## 🎯 Checklist for Launch

- [ ] All API keys configured
- [ ] Database schema created
- [ ] Admin user created
- [ ] Categories added
- [ ] Sample products added
- [ ] Payment tested
- [ ] Checkout tested
- [ ] Admin dashboard working
- [ ] Deployed on Vercel
- [ ] Custom domain added
- [ ] Razorpay live keys added

---

## 🎉 You're All Set!

Your AuraGems store is ready to sell handmade jewelry!

Start with:
1. `npm run dev`
2. `http://localhost:3000`
3. Add products
4. Deploy
5. Start selling! 💎

---

**Questions?** Check README.md or DEPLOYMENT.md

**Ready?** Let's build something amazing! ✨
