# CutList Cloud - Phase 1: Revenue-Ready Infrastructure

## Objective
Transform the existing KerfOS cabinet designer into a production-ready SaaS with database persistence, user authentication, and subscription billing.

## Current State
- **Backend**: FastAPI with in-memory storage (no database)
- **Frontend**: Next.js 14 with 20+ components
- **Auth**: None
- **Payments**: None
- **Database**: None

## Target State
- PostgreSQL database with proper schema
- User authentication (email/password + OAuth)
- Stripe subscription billing with 4 tiers
- Usage tracking and enforcement
- Deployable to production

---

## Tasks

### 1. Database Setup (PostgreSQL)

**Schema Design:**

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    tier VARCHAR(50) DEFAULT 'free',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cabinets table
CREATE TABLE cabinets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    width DECIMAL(10, 2) NOT NULL,
    height DECIMAL(10, 2) NOT NULL,
    depth DECIMAL(10, 2) NOT NULL,
    material VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Materials table
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    thickness DECIMAL(10, 2) NOT NULL,
    price_per_sheet DECIMAL(10, 2) NOT NULL,
    sheet_width DECIMAL(10, 2) DEFAULT 48.0,
    sheet_height DECIMAL(10, 2) DEFAULT 96.0,
    is_custom BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cut lists table
CREATE TABLE cut_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    cabinet_id UUID REFERENCES cabinets(id) ON DELETE CASCADE,
    cuts JSONB NOT NULL,
    total_parts INTEGER,
    material_cost DECIMAL(10, 2),
    generated_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_cabinets_project_id ON cabinets(project_id);
CREATE INDEX idx_cut_lists_project_id ON cut_lists(project_id);
CREATE INDEX idx_usage_events_user_id ON usage_events(user_id);
CREATE INDEX idx_usage_events_created_at ON usage_events(created_at);
```

**Files to create:**
- `backend/database.py` - SQLAlchemy models and connection
- `backend/models/` - Pydantic models for API
- `backend/alembic/` - Database migrations

**Acceptance Criteria:**
- PostgreSQL database running (local or Railway)
- All tables created with proper relationships
- Alembic migrations configured
- Environment variables for database URL

---

### 2. User Authentication

**Implementation Options:**
- Option A: Clerk (easiest, $25/mo after free tier)
- Option B: Custom JWT with FastAPI-Users (free, more control)

**Recommendation:** Start with custom JWT for cost savings, can migrate to Clerk later if needed.

**Files to create/modify:**
- `backend/auth.py` - JWT token generation/validation
- `backend/routes/auth.py` - Login, register, logout endpoints
- `backend/middleware/auth.py` - Require auth decorator
- `frontend/src/lib/auth.ts` - Auth state management
- `frontend/src/components/Auth.tsx` - Login/register forms

**Acceptance Criteria:**
- Users can register with email/password
- Users can login and receive JWT
- Protected routes require valid JWT
- Password hashing with bcrypt
- Token refresh mechanism

---

### 3. Stripe Subscription Billing

**Tiers to implement:**

| Tier | Stripe Price ID | Price | Limits |
|------|-----------------|-------|--------|
| Free | N/A | $0 | 5 projects, 10 cut lists, watermarked PDFs |
| Maker | price_maker_monthly | $19/mo | Unlimited projects, no watermark, DXF export |
| Shop | price_shop_monthly | $79/mo | Team features, API access, hardware integration |
| Pro | price_pro_monthly | $199/mo | White-label, priority support, custom materials |

**Files to create:**
- `backend/stripe_config.py` - Stripe client setup
- `backend/routes/billing.py` - Subscription endpoints
- `backend/webhooks/stripe.py` - Handle Stripe webhooks
- `frontend/src/components/Pricing.tsx` - Pricing page
- `frontend/src/components/Checkout.tsx` - Stripe checkout

**Stripe Products to Create:**
1. CutList Cloud Free (default, no Stripe product)
2. CutList Cloud Maker - $19/month
3. CutList Cloud Shop - $79/month
4. CutList Cloud Pro - $199/month

**Webhook Events to Handle:**
- `checkout.session.completed` - Upgrade user tier
- `customer.subscription.deleted` - Downgrade to free
- `customer.subscription.updated` - Update tier
- `invoice.payment_failed` - Alert user

**Acceptance Criteria:**
- Pricing page shows all tiers
- Checkout redirects to Stripe
- Webhook updates user tier in database
- Usage enforcement based on tier
- Cancel subscription works

---

### 4. Usage Tracking & Enforcement

**Limits by Tier:**

```python
TIER_LIMITS = {
    'free': {
        'projects': 5,
        'cut_lists_per_month': 10,
        'exports_per_month': 5,
        'features': ['basic_cut_list', 'pdf_watermarked']
    },
    'maker': {
        'projects': -1,  # unlimited
        'cut_lists_per_month': -1,
        'exports_per_month': -1,
        'features': ['basic_cut_list', 'advanced_nesting', 'pdf', 'dxf', 'csv']
    },
    'shop': {
        'projects': -1,
        'cut_lists_per_month': -1,
        'exports_per_month': -1,
        'features': ['basic_cut_list', 'advanced_nesting', 'pdf', 'dxf', 'csv', 'api_access', 'team', 'hardware_finder']
    },
    'pro': {
        'projects': -1,
        'cut_lists_per_month': -1,
        'exports_per_month': -1,
        'features': ['all']  # Everything
    }
}
```

**Files to create:**
- `backend/usage.py` - Usage tracking functions
- `backend/middleware/limits.py` - Enforce tier limits
- `frontend/src/components/UpgradePrompt.tsx` - Show when limit hit

**Acceptance Criteria:**
- Free users hit limit → see upgrade prompt
- Usage events logged to database
- Monthly usage resets (track by created_at)
- Usage dashboard shows current usage

---

### 5. Environment Configuration

**Required Environment Variables:**

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/cutlistcloud

# Auth
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=168

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Price IDs
STRIPE_PRICE_MAKER=price_xxx
STRIPE_PRICE_SHOP=price_xxx
STRIPE_PRICE_PRO=price_xxx

# App
APP_URL=https://cutlist.cloud
API_URL=https://api.cutlist.cloud
```

---

### 6. API Updates

**New/Modified Endpoints:**

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login, get JWT
POST   /api/auth/logout          - Logout
GET    /api/auth/me              - Current user info

POST   /api/billing/checkout     - Create Stripe checkout session
POST   /api/billing/portal       - Customer portal URL
POST   /webhooks/stripe          - Stripe webhook handler

GET    /api/projects             - List user's projects
POST   /api/projects             - Create project (check limits)
GET    /api/projects/:id         - Get project details
PUT    /api/projects/:id         - Update project
DELETE /api/projects/:id         - Delete project

GET    /api/usage                - Current usage stats
```

---

### 7. Frontend Updates

**Pages to Create:**
- `/login` - Login page
- `/register` - Registration page
- `/pricing` - Pricing tiers
- `/account` - Account management
- `/usage` - Usage dashboard

**Components to Update:**
- Add auth state to all protected pages
- Add upgrade prompts when limits hit
- Add logout button to navbar

---

## Testing Checklist

- [ ] User can register and login
- [ ] Free user can create 5 projects max
- [ ] Free user sees upgrade prompt on 6th project
- [ ] Stripe checkout works
- [ ] Webhook updates user tier
- [ ] Paid user has unlimited projects
- [ ] Usage tracking works
- [ ] JWT tokens expire and refresh

---

## Deployment Notes

**Backend (Railway or Fly.io):**
- Set all environment variables
- Run database migrations
- Configure Stripe webhook URL

**Frontend (Vercel):**
- Set NEXT_PUBLIC_API_URL
- Set NEXT_PUBLIC_STRIPE_KEY

**Database (Railway or Neon):**
- PostgreSQL 15+
- Connection pooling for production

---

## Estimated Time

- Database setup: 1-2 hours
- Auth implementation: 2-3 hours
- Stripe integration: 2-3 hours
- Usage tracking: 1-2 hours
- Testing: 2 hours

**Total: 8-12 hours**

---

## Success Metrics

- User can sign up and create projects
- Stripe billing works end-to-end
- Free tier limits enforced
- Ready for beta testers
