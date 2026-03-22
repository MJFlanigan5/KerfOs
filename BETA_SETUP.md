# KerfOS Beta Testing Guide

## Overview

KerfOS is an AI-powered cabinet design tool with cut list optimization and hardware sourcing. This guide explains how to set up and test the beta version.

## Beta Phase Features

### What's Included

**Core Features:**
- ✅ Cabinet builder with drag-and-drop components
- ✅ Cut list generation and optimization
- ✅ Material library with pricing
- ✅ Hardware recommendations
- ✅ 3D visualization
- ✅ PDF/DXF/CSV export

**Advanced Features:**
- ✅ Advanced 2D nesting optimization
- ✅ Edge banding calculator
- ✅ Price feeds from suppliers
- ✅ Scrap tracking
- ✅ Scratch build calculator
- ✅ Sketch-to-design (AI)
- ✅ AR scanner support
- ✅ G-code generation for CNC
- ✅ Store integration
- ✅ Collaboration tools
- ✅ Community gallery

**SaaS Features:**
- ✅ User authentication
- ✅ Subscription billing (Stripe)
- ✅ Tier limits enforcement
- ✅ Usage tracking

### Subscription Tiers

| Tier | Price | Projects | Cut Lists | Exports | Features |
|------|-------|----------|-----------|---------|----------|
| **Free** | $0 | 5 | 10/mo | 5/mo | Basic cut list, CSV, watermarked PDF |
| **Maker** | $19/mo | Unlimited | Unlimited | Unlimited | All features, no watermark, DXF, hardware finder |
| **Shop** | $79/mo | Unlimited | Unlimited | Unlimited | Maker + API access, team, priority support |
| **Pro** | $199/mo | Unlimited | Unlimited | Unlimited | All features, white-label, custom materials |

## Setup Instructions

### For Beta Testers (YouTubers)

1. **Get Access**
   - Contact Michael for beta invite link
   - Or sign up at: https://kerfos.modology.studios/register

2. **Create Account**
   - Email + password
   - You'll start on **Free tier** with 5 projects

3. **Test Features**
   - Create cabinets using the builder
   - Generate cut lists
   - Export to PDF/DXF/CSV
   - Test hardware recommendations
   - Try 3D visualization

4. **Provide Feedback**
   - Email: michael@modology.studios
   - Discord: https://discord.gg/clawd
   - GitHub Issues: https://github.com/MJFlanigan5/KerfOs/issues

### For Developers

1. **Clone Repository**
   ```bash
   git clone https://github.com/MJFlanigan5/KerfOs.git
   cd KerfOs
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Environment Variables**
   Create `.env` file:
   ```
   DATABASE_URL=postgresql://localhost/kerfos
   SECRET_KEY=your-secret-key-change-in-production
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_MAKER=price_...
   STRIPE_PRICE_SHOP=price_...
   STRIPE_PRICE_PRO=price_...
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb kerfos
   
   # Run migrations
   alembic upgrade head
   ```

5. **Start Backend**
   ```bash
   uvicorn main:app --reload
   ```

6. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

7. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Beta Testing Checklist

### Basic Functionality
- [ ] Register account
- [ ] Login/Logout
- [ ] Create project
- [ ] Create cabinet
- [ ] Generate cut list
- [ ] Export to PDF
- [ ] Export to DXF
- [ ] Export to CSV

### Advanced Features
- [ ] Test hardware recommendations
- [ ] Try advanced nesting
- [ ] Use edge banding calculator
- [ ] Test price feeds
- [ ] Try scratch build calculator
- [ ] Test sketch-to-design
- [ ] Generate G-code

### Billing & Limits
- [ ] Check tier limits
- [ ] Test upgrade flow (Stripe test mode)
- [ ] Verify usage tracking
- [ ] Test billing portal

### UI/UX
- [ ] Test responsive design (mobile/tablet)
- [ ] Check animations
- [ ] Verify navigation
- [ ] Test error handling

## Known Issues

1. **AR Scanner**: Requires AR-capable device
2. **Sketch-to-Design**: AI features may have latency
3. **Collaboration**: Real-time features require stable connection

## Feedback Priority

**High Priority:**
- Crashes or errors
- Data loss
- Security issues
- Payment problems

**Medium Priority:**
- UI/UX improvements
- Feature requests
- Performance issues

**Low Priority:**
- Minor bugs
- Cosmetic issues
- Documentation

## Contact & Support

- **Email**: michael@modology.studios
- **Discord**: https://discord.gg/clawd
- **GitHub**: https://github.com/MJFlanigan5/KerfOs
- **Twitter**: @modology

## Beta Timeline

- **Week 1**: Internal testing
- **Week 2-3**: YouTuber beta testing
- **Week 4**: Public beta launch
- **Week 5+**: Production launch

---

Thank you for testing KerfOS! Your feedback helps us build a better product for woodworkers and DIYers.
