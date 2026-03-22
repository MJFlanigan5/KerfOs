# CutList Cloud - Project Summary

## What Was Built

Transformed the existing KerfOS cabinet designer into **CutList Cloud**, a production-ready SaaS with database persistence, user authentication, and subscription billing.

---

## Backend Changes

### New Files Created

| File | Purpose |
|------|---------|
| `backend/database.py` | PostgreSQL connection and session management |
| `backend/models/__init__.py` | SQLAlchemy ORM models (User, Project, Cabinet, Material, CutList, UsageEvent) |
| `backend/auth.py` | JWT authentication (hash, verify, create tokens) |
| `backend/stripe_config.py` | Stripe integration (checkout, portal, webhooks) |
| `backend/usage.py` | Usage tracking and tier limit enforcement |
| `backend/routes/auth.py` | Auth endpoints (register, login, logout, me) |
| `backend/routes/billing.py` | Billing endpoints (checkout, portal, tiers, webhook) |
| `backend/routes/projects.py` | Project CRUD with usage enforcement |
| `backend/alembic/` | Database migrations |
| `backend/.env.example` | Environment configuration template |

### Modified Files

| File | Changes |
|------|---------|
| `backend/main.py` | Replaced in-memory storage with database, added new routers |
| `backend/requirements.txt` | Added stripe, alembic, email-validator |

### API Endpoints

```
Authentication:
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login, get JWT
POST   /api/auth/logout      - Logout
GET    /api/auth/me          - Current user info

Billing:
GET    /api/billing/tiers    - Get all subscription tiers
POST   /api/billing/checkout - Create Stripe checkout
POST   /api/billing/portal   - Customer portal URL
POST   /webhooks/stripe      - Stripe webhook handler

Projects:
GET    /api/projects         - List user's projects
POST   /api/projects         - Create project (enforces limits)
GET    /api/projects/:id     - Get project
PUT    /api/projects/:id     - Update project
DELETE /api/projects/:id     - Delete project
GET    /api/projects/usage/me - Current usage stats
```

---

## Frontend Changes

### New Files Created

| File | Purpose |
|------|---------|
| `frontend/src/lib/auth.ts` | Auth utilities (login, register, token management, API helper) |
| `frontend/src/components/Auth.tsx` | Login/Register form component |
| `frontend/src/components/Pricing.tsx` | Pricing page with tier cards |
| `frontend/src/app/login/page.tsx` | Login page |
| `frontend/src/app/register/page.tsx` | Registration page |
| `frontend/src/app/pricing/page.tsx` | Pricing page route |
| `frontend/src/app/account/page.tsx` | Account management page |
| `frontend/.env.example` | Environment configuration template |

### Modified Files

| File | Changes |
|------|---------|
| `frontend/next.config.mjs` | Added environment variables |

---

## Subscription Tiers

| Tier | Price | Projects | Cut Lists | Exports | Features |
|------|-------|----------|-----------|---------|----------|
| Free | $0 | 5 | 10/month | 5/month | Basic cut list, watermarked PDF |
| Maker | $19/mo | Unlimited | Unlimited | Unlimited | Advanced nesting, PDF/DXF/CSV export |
| Shop | $79/mo | Unlimited | Unlimited | Unlimited | API access, team, hardware finder |
| Pro | $199/mo | Unlimited | Unlimited | Unlimited | All features, white-label, priority support |

---

## Next Steps

### 1. Set Up PostgreSQL Database

```bash
# Local PostgreSQL
createdb cutlistcloud

# Or use Railway/Neon/Supabase for cloud database
# Set DATABASE_URL environment variable
```

### 2. Create Stripe Products

Go to [Stripe Dashboard](https://dashboard.stripe.com/products):

1. Create 3 products:
   - **Maker** - $19/month subscription
   - **Shop** - $79/month subscription
   - **Pro** - $199/month subscription

2. Copy the **Price IDs** (price_xxx) to your environment variables

3. Set up webhook endpoint: `https://your-api.com/webhooks/stripe`
   - Events to listen: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`

### 3. Configure Environment Variables

Backend (`backend/.env`):
```env
DATABASE_URL=postgresql://user:pass@host:5432/cutlistcloud
JWT_SECRET=your-super-secret-key-change-this
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_MAKER=price_xxx
STRIPE_PRICE_SHOP=price_xxx
STRIPE_PRICE_PRO=price_xxx
APP_URL=https://cutlist.cloud
```

Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://api.cutlist.cloud
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
```

### 4. Run Database Migrations

```bash
cd backend
alembic upgrade head
```

### 5. Deploy

**Backend (Railway/Fly.io):**
```bash
# Railway
railway init
railway run alembic upgrade head
railway up

# Fly.io
fly launch
fly deploy
```

**Frontend (Vercel):**
```bash
vercel --prod
```

---

## Revenue Potential

Based on the research from March 22, 2026:

- **Target market:** DIY woodworkers, small cabinet shops, makerspaces
- **Similar tools:** CutList Plus ($150-400 one-time), SketchUp ($300+/year)
- **Competitive advantage:** AI-powered optimization, cloud-based, subscription pricing
- **Conservative estimate:** 100 users at $30 ARPU = $3,000/month
- **Goal:** 1,000 users at $30 ARPU = $30,000/month

---

## Files Modified/Created Summary

**Backend:** 11 new files, 2 modified
**Frontend:** 7 new files, 1 modified
**Total:** 21 files

All changes committed to: `~/projects/modology-cabinet-designer`

---

*Built: March 22, 2026*
