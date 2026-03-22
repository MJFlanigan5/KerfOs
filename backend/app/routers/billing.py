# Stripe Billing Router for KerfOS

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import stripe
import os

from app.database import get_db
from app.models import User
from app.tier_limits import TIER_LIMITS

router = APIRouter(prefix="/api/billing", tags=["billing"])

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Stripe Price IDs (configure these in production)
STRIPE_PRICES = {
    'maker': os.getenv("STRIPE_PRICE_MAKER", "price_maker_monthly"),
    'shop': os.getenv("STRIPE_PRICE_SHOP", "price_shop_monthly"),
    'pro': os.getenv("STRIPE_PRICE_PRO", "price_pro_monthly")
}


class CheckoutRequest(BaseModel):
    tier: str
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class PortalRequest(BaseModel):
    return_url: Optional[str] = None


@router.post("/checkout")
async def create_checkout_session(
    request: CheckoutRequest,
    current_user: User = Depends(lambda: None),  # TODO: Add proper auth dependency
    db: Session = Depends(get_db)
):
    """Create a Stripe checkout session for subscription"""
    if request.tier == 'free':
        raise HTTPException(status_code=400, detail="Cannot checkout free tier")
    
    if request.tier not in STRIPE_PRICES:
        raise HTTPException(status_code=400, detail="Invalid tier")
    
    # Get or create Stripe customer
    if not current_user.stripe_customer_id:
        customer = stripe.Customer.create(
            email=current_user.email,
            metadata={'user_id': current_user.id}
        )
        current_user.stripe_customer_id = customer.id
        db.commit()
    
    # Create checkout session
    try:
        checkout_session = stripe.checkout.Session.create(
            customer=current_user.stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price': STRIPE_PRICES[request.tier],
                'quantity': 1,
            }],
            mode='subscription',
            success_url=request.success_url or f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/account?success=true",
            cancel_url=request.cancel_url or f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/pricing?canceled=true",
            metadata={
                'user_id': current_user.id,
                'tier': request.tier
            }
        )
        
        return {"url": checkout_session.url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/portal")
async def create_portal_session(
    request: PortalRequest,
    current_user: User = Depends(lambda: None),  # TODO: Add proper auth dependency
    db: Session = Depends(get_db)
):
    """Create a Stripe billing portal session"""
    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No Stripe customer found")
    
    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=current_user.stripe_customer_id,
            return_url=request.return_url or f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/account"
        )
        
        return {"url": portal_session.url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """Handle Stripe webhook events"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['metadata'].get('user_id')
        tier = session['metadata'].get('tier')
        
        # Update user tier
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user:
            user.tier = tier
            user.stripe_subscription_id = session['subscription']
            db.commit()
    
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        user = db.query(User).filter(
            User.stripe_subscription_id == subscription['id']
        ).first()
        
        if user:
            user.tier = 'free'
            user.stripe_subscription_id = None
            db.commit()
    
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        # Handle subscription updates (plan changes, etc.)
        # This would need more logic to determine the new tier
    
    return {"status": "success"}


@router.get("/tiers")
async def get_billing_tiers():
    """Get all available billing tiers"""
    tier_names = {
        'free': 'Free',
        'maker': 'Maker',
        'shop': 'Shop',
        'pro': 'Pro'
    }
    
    tier_prices = {
        'free': 0,
        'maker': 19,
        'shop': 79,
        'pro': 199
    }
    
    return [
        {
            'tier': tier,
            'name': tier_names.get(tier, tier),
            'price': tier_prices.get(tier, 0),
            'limits': limits,
            'features': limits.get('features', [])
        }
        for tier, limits in TIER_LIMITS.items()
    ]
