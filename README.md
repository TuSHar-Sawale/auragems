# AuraGems - E-Commerce Platform for Handmade Jewelry

## 🌟 Overview

AuraGems is a production-ready full-stack e-commerce platform built with Next.js, Supabase, and Razorpay. It includes a complete user-facing website with shopping functionality and a professional admin dashboard for inventory and order management.

**Live Demo**: [Coming Soon]

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Payment Gateway**: Razorpay
- **Storage**: Supabase Storage
- **Deployment**: Vercel
- **Authentication**: Supabase Auth

### Project Structure
```
auragems/
├── app/
│   ├── admin/                 # Admin dashboard pages
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── categories/
│   │   ├── coupons/
│   │   ├── bulk-upload/
│   │   └── users/
│   ├── api/                   # API routes
│   │   ├── products/
│   │   ├── orders/
│   │   ├── admin/
│   │   ├── coupons/
│   │   └── auth/
│   ├── auth/                  # Auth pages (login, signup)
│   ├── products/              # Product pages
│   ├── cart/                  # Shopping cart
│   ├── checkout/              # Checkout page
│   ├── orders/                # Order history
│   ├── layout.js              # Root layout
│   └── page.js                # Homepage
├── components/                # Reusable React components
│   ├── admin/                 # Admin-specific components
│   ├── ui/                    # UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ...
├── context/                   # React context (Auth, Cart)
├── hooks/                     # Custom React hooks
├── services/                  # API service layer
├── lib/
│   ├── supabaseClient.js      # Supabase client
│   ├── razorpay.js            # Razorpay setup
│   ├── helpers.js             # Utility functions
│   ├── validations/           # Form validations
│   └── database/
│       └── schema.sql         # Database schema
├── styles/                    # Global styles
├── public/                    # Static assets
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Razorpay account (for payments)
- Vercel account (for deployment)

### Installation

1. **Clone the repository** (or create from provided files)
```bash
cd auragems
npm install
```

2. **Set up Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Settings
   - Get the `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

3. **Set up Razorpay**
   - Sign up at [razorpay.com](https://razorpay.com)
   - Get your `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from Dashboard

4. **Create `.env.local`**
```bash
cp .env.local.example .env.local
```

5. **Fill in your environment variables**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
ADMIN_SECRET_KEY=your_admin_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

6. **Set up database schema**
   - Go to your Supabase project SQL Editor
   - Copy-paste the entire contents of `lib/database/schema.sql`
   - Execute it to create all tables

7. **Run development server**
```bash
npm run dev
```

8. **Access the application**
   - Frontend: `http://localhost:3000`
   - Admin: `http://localhost:3000/admin/dashboard`

---

## 📱 Features

### Customer Features
- ✅ Product browsing with filters (category, price, search)
- ✅ Detailed product pages with multiple images
- ✅ Shopping cart with persistent storage
- ✅ Checkout with address form validation
- ✅ Razorpay payment integration (cards, UPI, wallets)
- ✅ Cash on Delivery (COD) option
- ✅ Order tracking and history
- ✅ User authentication and profile
- ✅ Coupon code validation and application
- ✅ Responsive design (mobile + desktop)

### Admin Features
- ✅ Dashboard with real-time analytics
- ✅ Product management (create, read, update, delete)
- ✅ Multiple product images with drag-n-drop reordering
- ✅ Category management
- ✅ Order management with status updates
- ✅ Coupon creation and management
- ✅ User management (block/unblock)
- ✅ Bulk CSV product upload
- ✅ Revenue analytics (last 7 days chart)
- ✅ Protected admin routes with role-based access

### Technical Features
- ✅ Server-side pagination
- ✅ Image compression and optimization
- ✅ Supabase Storage integration
- ✅ JWT authentication with Supabase
- ✅ Payment signature verification
- ✅ Form validation on client and server
- ✅ Error handling and toast notifications
- ✅ SEO-friendly structure

---

## 📊 Database Schema

### Tables
1. **categories** - Product categories
2. **products** - Product information
3. **product_images** - Multiple images per product
4. **users** - User accounts and profile
5. **addresses** - Shipping addresses
6. **orders** - Order records
7. **order_items** - Items in each order
8. **coupons** - Discount codes
9. **bulk_upload_logs** - Bulk upload history

All tables are indexed for optimal performance.

---

## 🔐 Authentication & Security

### Authentication Flow
1. User signs up/logs in with Supabase Auth
2. Supabase returns JWT token
3. Token stored in browser (Supabase SDK handles this)
4. API requests include Authorization header
5. Server verifies token and checks user permissions

### Security Best Practices Implemented
- ✅ Razorpay secret key never exposed to frontend
- ✅ Payment signature verification on backend
- ✅ Admin routes protected with role checks
- ✅ CORS configured properly
- ✅ Environment variables for sensitive data
- ✅ Input validation and sanitization
- ✅ Protected API endpoints

---

## 🛒 Payment Integration

### Razorpay Flow
1. Customer adds items to cart and proceeds to checkout
2. Frontend sends order details to `/api/orders/create-order`
3. Backend creates Razorpay order via Razorpay SDK
4. Frontend opens Razorpay payment modal
5. Customer completes payment
6. Frontend sends payment details to `/api/orders/verify-payment`
7. Backend verifies payment signature
8. Order status updated to "confirmed"

### Testing Razorpay (Sandbox)
- Use test card: `4111 1111 1111 1111`
- Any future expiry date
- Any CVV

---

## 📦 API Routes

### Products
- `GET /api/products` - Fetch all products (with filters)
- `GET /api/products/[id]` - Fetch single product
- `POST /api/admin/products` - Create product (admin)
- `PUT /api/admin/products/[id]` - Update product (admin)
- `DELETE /api/admin/products/[id]` - Delete product (admin)

### Orders
- `POST /api/orders/create-order` - Create order
- `POST /api/orders/verify-payment` - Verify Razorpay payment
- `GET /api/orders` - Get user's orders
- `GET /api/orders/[id]` - Get order details
- `GET /api/admin/orders` - Get all orders (admin)
- `PUT /api/admin/orders/[id]/status` - Update order status (admin)

### Coupons
- `POST /api/coupons/validate` - Validate coupon code
- `GET /api/admin/coupons` - Get all coupons (admin)
- `POST /api/admin/coupons` - Create coupon (admin)
- `PUT /api/admin/coupons/[id]` - Update coupon (admin)
- `DELETE /api/admin/coupons/[id]` - Delete coupon (admin)

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

---

## 🎨 UI Components

### Reusable Components
- `Navbar` - Navigation with cart count
- `Footer` - Footer with links
- `ProductCard` - Product display card
- `ProductGrid` - Grid of products
- `CartItem` - Cart item component
- `ProtectedRoute` - Role-based route protection
- `Loader` - Loading spinner

### Styling
- Tailwind CSS for all components
- Custom CSS in `styles/globals.css`
- Responsive design (mobile-first)
- Dark theme with gold accent color (`#d4af37`)

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `auragems` folder (if in monorepo)

3. **Set Environment Variables**
   - Add all variables from `.env.local`
   - Environment variables panel in Vercel → Settings

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Production Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=prod_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_supabase_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_role_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=prod_razorpay_key
RAZORPAY_KEY_SECRET=prod_razorpay_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Custom Domain
1. In Vercel project settings
2. Go to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## 📝 Admin First-Time Setup

1. **Create Admin User**
   - Signup as regular user at `http://localhost:3000/auth/signup`
   - In Supabase dashboard, go to `users` table
   - Update the user's `is_admin` field to `true`

2. **Add Categories**
   - Go to `/admin/categories`
   - Add product categories (Rings, Necklaces, etc.)

3. **Add Products**
   - Go to `/admin/products`
   - Click "Add Product"
   - Fill in all details
   - Upload images

4. **Create Coupons**
   - Go to `/admin/coupons`
   - Create discount codes
   - Set expiry dates and usage limits

5. **Bulk Upload Products**
   - Go to `/admin/bulk-upload`
   - Prepare CSV with columns: name, description, category, price, stock
   - Upload file

---

## 🧪 Testing

### Unit Tests (To be added)
```bash
npm run test
```

### Manual Testing Checklist
- [ ] User signup/login
- [ ] Product browsing and filters
- [ ] Add to cart
- [ ] Remove from cart
- [ ] Checkout with COD
- [ ] Checkout with Razorpay (test mode)
- [ ] Admin login
- [ ] Add product
- [ ] Update order status
- [ ] Create coupon
- [ ] Bulk upload products

---

## 🐛 Troubleshooting

### Common Issues

**"Cannot find module '@supabase/supabase-js'"**
```bash
npm install @supabase/supabase-js
```

**"Razorpay is not defined"**
- Ensure Razorpay script is loaded before payment
- Check browser console for errors

**"Database connection failed"**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys
- Check Supabase project status

**"Payment verification failed"**
- Ensure `RAZORPAY_KEY_SECRET` is correct
- Check environment variables in Vercel

---

## 📞 Support

For issues or questions:
1. Check [Next.js docs](https://nextjs.org/docs)
2. Check [Supabase docs](https://supabase.com/docs)
3. Check [Razorpay docs](https://razorpay.com/docs)
4. Open an issue in the repository

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Credits

Built with ❤️ for handmade jewelry sellers.

**Next.js** | **Supabase** | **Razorpay** | **Tailwind CSS** | **Vercel**
