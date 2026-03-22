# API routes for billing/subscription management

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import os

from database import get_db
from models import User
from auth import get_current_user
from stripe_config import (
    create_customer,
    create_checkout_session,
    create_customer_portal_session,
    validate_webhook_signature,
    TIERS
)

router = APIRouter(prefix="/api/billing", tags=["billing"])


class CheckoutRequest(BaseModel):
    tier: str


class CheckoutResponse(BaseModel):
    url: str


class PortalResponse(BaseModel):
    url: str


class TierInfo(BaseModel):
    tier: str
    name: str
    price: int
    limits: dict
    features: list


@router.get("/tiers", response_model=list[TierInfo])
async def get_tiers():
    """Get all available subscription tiers"""
    return [
        TierInfo(
            tier=tier,
            name=config["name"],
            price=config["price"],
            limits=config["limits"],
            features=config["features"]
        )
        for tier, config in TIERS.items()
    ]


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    checkout_data: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Stripe checkout session"""
    # Validate tier
    if checkout_data.tier not in TIERS or checkout_data.tier == "free":
        raise HTTPException(
            status_code=400,
            detail="Invalid tier. Choose: maker, shop, or pro"
        )
    
    # Create Stripe customer if needed
    if not current_user.stripe_customer_id:
        customer_id = create_customer(
            email=current_user.email,
            name=current_user.name
        )
        current_user.stripe_customer_id = customer_id
        db.commit()
    
    # Create checkout session
    app_url = os.getenv("APP_URL", "http://localhost:3000")
    success_url = f"{app_url}/account?checkout=success"
    cancel_url = f"{app_url}/pricing?checkout=canceled"
    
    checkout_url = create_checkout_session(
        customer_id=current_user.stripe_customer_id,
        tier=checkout_data.tier,
        success_url=success_url,
        cancel_url=cancel_url
    )
    
    return CheckoutResponse(url=checkout_url)


@router.post("/portal", response_model=PortalResponse)
async def create_portal(
    current_user: User = Depends(get_current_user)
):
    """Create a customer portal session for managing subscription"""
    if not current_user.stripe_customer_id:
        raise HTTPException(
            status_code=400,
            detail="No Stripe customer found. Subscribe first."
        )
    
    app_url = os.getenv("APP_URL", "http://localhost:3000")
    return_url = f"{app_url}/account"
    
    portal_url = create_customer_portal_session(
        customer_id=current_user.stripe_customer_id,
        return_url=return_url
    )
    
    return PortalResponse(url=portal_url)


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """Handle Stripe webhook events"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = validate_webhook_signature(payload, sig_header)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Handle different event types
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_id = session["customer"]
        subscription_id = session["subscription"]
        tier = session["metadata"].get("tier", "free")
        
        # Update user tier
        user = db.query(User).filter(
            User.stripe_customer_id == customer_id
        ).first()
        
        if user:
            user.tier = tier
            user.stripe_subscription_id = subscription_id
            db.commit()
    
    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        customer_id = subscription["customer"]
        
        # Downgrade to free
        user = db.query(User).filter(
            User.stripe_customer_id == customer_id
        ).first()
        
        if user:
            user.tier = "free"
            user.stripe_subscription_id = None
            db.commit()
    
    elif event["type"] == "customer.subscription.updated":
        subscription = event["data"]["object"]
        customer_id = subscription["customer"]
        
        # Get new tier from subscription
        price_id = subscription["items"]["data"][0]["price"]["id"]
        
        # Map price ID to tier
        tier = "free"
        for t, pid in {
            "maker": os.getenv("STRIPE_PRICE_MAKER"),
            "shop": os.getenv("STRIPE_PRICE_SHOP"),
            "pro": os.getenv("STRIPE_PRICE_PRO")
        }.items():
            if pid == price_id:
                tier = t
                break
        
        user = db.query(User).filter(
            User.stripe_customer_id == customer_id
        ).first()
        
        if user:
            user.tier = tier
            db.commit()
    
    return {"status": "success"}
