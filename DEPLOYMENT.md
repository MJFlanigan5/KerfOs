# CutList Cloud Deployment Guide

## Overview
This guide deploys CutList Cloud to Railway (backend + database) and Vercel (frontend).

---

## Step 1: Railway Setup (Database + Backend)

### 1.1 Install and Login to Railway

```bash
npm install -g @railway/cli
railway login
```

This will open a browser for authentication.

### 1.2 Create Project and Database

```bash
cd ~/projects/modology-cabinet-designer/backend

# Create new Railway project
railway init

# Name it: cutlist-cloud

# Add PostgreSQL database
railway add --database postgres

# This creates a PostgreSQL database and sets DATABASE_URL automatically
```

### 1.3 Set Environment Variables

In Railway dashboard (or via CLI):

```bash
railway variables set JWT_SECRET=your-super-secret-key-change-this
railway variables set JWT_ALGORITHM=HS256
railway variables set JWT_EXPIRATION_HOURS=168
railway variables set STRIPE_SECRET_KEY=sk_test_xxx
railway variables set STRIPE_WEBHOOK_SECRET=whsec_xxx
railway variables set STRIPE_PRICE_MAKER=price_xxx
railway variables set STRIPE_PRICE_SHOP=price_xxx
railway variables set STRIPE_PRICE_PRO=price_xxx
railway variables set APP_URL=https://cutlist-cloud.vercel.app
railway variables set ALLOWED_ORIGINS=https://cutlist-cloud.vercel.app
```

### 1.4 Deploy Backend

```bash
# Deploy the backend
railway up

# Or link and deploy
railway link
railway up
```

### 1.5 Run Database Migrations

After the backend is deployed:

```bash
# Connect to Railway shell
railway run alembic upgrade head
```

### 1.6 Get Backend URL

```bash
railway domain
```

This gives you the backend URL like `https://cutlist-cloud-backend.up.railway.app`

---

## Step 2: Stripe Setup

### 2.1 Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Create 3 subscription products:

**Maker Plan:**
- Name: Maker
- Price: $19/month
- Billing: Recurring
- Copy the **Price ID** (starts with `price_`)

**Shop Plan:**
- Name: Shop
- Price: $79/month
- Copy the **Price ID**

**Pro Plan:**
- Name: Pro
- Price: $199/month
- Copy the **Price ID**

### 2.2 Set Up Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-backend-url.railway.app/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Webhook Secret** (starts with `whsec_`)

### 2.3 Update Railway Variables

Add the Stripe keys to Railway:

```bash
railway variables set STRIPE_SECRET_KEY=sk_live_xxx
railway variables set STRIPE_WEBHOOK_SECRET=whsec_xxx
railway variables set STRIPE_PRICE_MAKER=price_xxx
railway variables set STRIPE_PRICE_SHOP=price_xxx
railway variables set STRIPE_PRICE_PRO=price_xxx
```

---

## Step 3: Frontend Deployment (Vercel)

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Deploy Frontend

```bash
cd ~/projects/modology-cabinet-designer/frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3.3 Set Environment Variables in Vercel

In Vercel dashboard or via CLI:

```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend-url.railway.app

vercel env add NEXT_PUBLIC_STRIPE_KEY
# Enter: pk_test_xxx (from Stripe Dashboard)
```

Then redeploy:

```bash
vercel --prod
```

---

## Step 4: Final Configuration

### 4.1 Update Allowed Origins

In Railway, update ALLOWED_ORIGINS with your Vercel URL:

```bash
railway variables set ALLOWED_ORIGINS=https://cutlist-cloud.vercel.app,https://your-custom-domain.com
```

### 4.2 Test the Deployment

1. Visit your frontend URL
2. Register a new account
3. Check if login works
4. Test the pricing page
5. Try a test checkout with Stripe test card: `4242 4242 4242 4242`

---

## Quick Reference

**Backend URL:** `https://cutlist-cloud-backend.up.railway.app`
**Frontend URL:** `https://cutlist-cloud.vercel.app`
**Database:** Railway PostgreSQL (auto-configured)
**Stripe Dashboard:** https://dashboard.stripe.com
**Railway Dashboard:** https://railway.app

---

## Troubleshooting

### Database Connection Issues
```bash
railway logs  # Check backend logs
railway run python -c "from database import engine; print(engine.url)"
```

### Migration Issues
```bash
railway run alembic current  # Check current migration
railway run alembic upgrade head  # Run migrations
```

### Stripe Webhook Issues
- Check webhook logs in Stripe Dashboard
- Verify webhook secret matches
- Ensure backend URL is correct

---

**Total Cost Estimate:**
- Railway (Hobby): ~$5/month
- Vercel (Hobby): Free
- Stripe: 2.9% + $0.30 per transaction
- **Total:** ~$5/month + transaction fees