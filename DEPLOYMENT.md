# AuraGems - Deployment Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Supabase account
- Razorpay account
- Vercel account

---

## Step 1: Supabase Setup

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project name: "auragems"
4. Choose a region close to you
5. Create a strong password
6. Click "Create New Project"

### Get API Keys
1. Go to **Settings** → **API**
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Go to **Settings** → **API** → **Service Role Secret**
5. Copy the key → `SUPABASE_SERVICE_ROLE_KEY`

### Set Up Database
1. Go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `lib/database/schema.sql`
4. Paste into editor
5. Click **Run**
6. Verify tables are created

### Enable Authentication
1. Go to **Authentication** → **Providers**
2. Enable **Email**
3. Configure email templates (optional)

### Enable Storage
1. Go to **Storage**
2. Click **New Bucket**
3. Name it: `product-images`
4. Enable **Public Bucket** access
5. Set policies for uploads

---

## Step 2: Razorpay Setup

### Create Razorpay Account
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up with email
3. Complete KYC verification
4. Go to **Settings** → **API Keys**
5. Copy **Key ID** → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
6. Copy **Key Secret** → `RAZORPAY_KEY_SECRET`

### Test Mode
- Razorpay provides a test environment by default
- Use test keys first, then switch to live keys in production
- Test card: 4111 1111 1111 1111

---

## Step 3: Local Setup

### Clone and Install
```bash
cd auragems
npm install
```

### Create Environment File
```bash
cp .env.local.example .env.local
```

### Fill Environment Variables
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
ADMIN_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Create Admin User
1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/auth/signup`
3. Create account with your email
4. Go to Supabase → **users** table
5. Find your user record
6. Update `is_admin` field to `true`

### Test Locally
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/dashboard`

---

## Step 4: GitHub Setup

### Initialize Git Repository
```bash
cd auragems
git init
git add .
git commit -m "Initial commit: AuraGems e-commerce platform"
git branch -M main
git remote add origin https://github.com/yourusername/auragems.git
git push -u origin main
```

---

## Step 5: Vercel Deployment

### Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Select `auragems` folder if in a monorepo structure
5. Click **Import**

### Configure Environment Variables
1. In **Environment Variables** section:
2. Add all variables from `.env.local`
3. Make sure to use PRODUCTION keys:
   - Get production Razorpay keys from Razorpay dashboard
   - Use same Supabase project for production

### Deploy
1. Click **Deploy**
2. Wait for build to complete (2-3 minutes)
3. Get your Vercel URL
4. Test deployment

### Connect Custom Domain
1. Go to **Settings** → **Domains**
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (usually 24 hours)

---

## Production Checklist

### Before Going Live
- [ ] All environment variables set correctly
- [ ] HTTPS enabled
- [ ] Database backups configured in Supabase
- [ ] Razorpay live mode keys (not test keys)
- [ ] Admin user created
- [ ] Sample products added
- [ ] Test payment completed
- [ ] Email templates configured
- [ ] Uptime monitoring enabled
- [ ] Error logging configured

### Security
- [ ] Remove all test/dummy data
- [ ] Update ADMIN_SECRET_KEY
- [ ] Enable 2FA in Supabase
- [ ] Enable 2FA in Razorpay
- [ ] Review database security policies
- [ ] Set up rate limiting
- [ ] Configure CORS properly

### Performance
- [ ] Image optimization enabled
- [ ] CDN cache configured
- [ ] Database indexes verified
- [ ] Lazy loading implemented
- [ ] API response times under 500ms

---

## Monitoring & Maintenance

### Supabase Monitoring
- Go to **Monitoring** dashboard
- Check API performance
- Monitor database size
- Review backup status

### Vercel Analytics
- Go to **Analytics** tab
- Monitor page performance
- Check error rates
- Review deployment history

### Razorpay Monitoring
- Dashboard shows transaction status
- Monitor payment success rate
- Check for failed transactions

### Regular Maintenance
- **Weekly**: Check order status and customer issues
- **Monthly**: Review analytics and sales
- **Quarterly**: Update dependencies and security patches
- **Yearly**: Audit security and compliance

---

## Scaling

As your business grows:

1. **Database Optimization**
   - Monitor database size
   - Archive old orders
   - Optimize slow queries

2. **Image Optimization**
   - Implement CDN for images
   - Use Next.js Image optimization
   - Compress images on upload

3. **Performance**
   - Enable Vercel Edge Caching
   - Implement ISR (Incremental Static Regeneration)
   - Set up monitoring and alerting

4. **Infrastructure**
   - Consider serverless database backups
   - Implement email queue for transactional emails
   - Set up SMS notifications for orders

---

## Troubleshooting

### Build Fails on Vercel
**Error: Cannot find module**
- Check all dependencies in package.json
- Ensure environment variables are set

### Payment Integration Not Working
- Verify Razorpay keys are correct
- Check browser console for errors
- Test with sandbox keys first

### Database Connection Issues
- Verify Supabase URL and keys
- Check network connectivity
- Review Supabase project status

### Images Not Uploading
- Verify Supabase Storage bucket exists
- Check bucket permissions
- Verify file size limits

---

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## Questions?

Create an issue in the repository or contact the support team.

Happy selling! 🎉
