# Stripe configuration for CutList Cloud

import stripe
import os
from typing import Optional, Dict, Any

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")

# Price IDs for each tier
STRIPE_PRICES = {
    "maker": os.getenv("STRIPE_PRICE_MAKER", ""),
    "shop": os.getenv("STRIPE_PRICE_SHOP", ""),
    "pro": os.getenv("STRIPE_PRICE_PRO", ""),
}

# Tier definitions
TIERS = {
    "free": {
        "name": "Free",
        "price": 0,
        "limits": {
            "projects": 5,
            "cut_lists_per_month": 10,
            "exports_per_month": 5,
        },
        "features": ["basic_cut_list", "pdf_watermarked"]
    },
    "maker": {
        "name": "Maker",
        "price": 19,
        "limits": {
            "projects": -1,  # unlimited
            "cut_lists_per_month": -1,
            "exports_per_month": -1,
        },
        "features": ["basic_cut_list", "advanced_nesting", "pdf", "dxf", "csv"]
    },
    "shop": {
        "name": "Shop",
        "price": 79,
        "limits": {
            "projects": -1,
            "cut_lists_per_month": -1,
            "exports_per_month": -1,
        },
        "features": ["basic_cut_list", "advanced_nesting", "pdf", "dxf", "csv", "api_access", "team", "hardware_finder"]
    },
    "pro": {
        "name": "Pro",
        "price": 199,
        "limits": {
            "projects": -1,
            "cut_lists_per_month": -1,
            "exports_per_month": -1,
        },
        "features": ["all"]
    }
}


def create_customer(email: str, name: Optional[str] = None) -> str:
    """Create a Stripe customer and return the ID"""
    customer = stripe.Customer.create(
        email=email,
        name=name,
        metadata={"source": "cutlist_cloud"}
    )
    return customer.id


def create_checkout_session(
    customer_id: str,
    tier: str,
    success_url: str,
    cancel_url: str
) -> str:
    """Create a Stripe checkout session and return the URL"""
    price_id = STRIPE_PRICES.get(tier)
    if not price_id:
        raise ValueError(f"Invalid tier: {tier}")
    
    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{
            "price": price_id,
            "quantity": 1,
        }],
        mode="subscription",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"tier": tier}
    )
    return session.url


def create_customer_portal_session(customer_id: str, return_url: str) -> str:
    """Create a customer portal session for managing subscription"""
    session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=return_url,
    )
    return session.url


def get_subscription(subscription_id: str) -> Dict[str, Any]:
    """Get subscription details"""
    return stripe.Subscription.retrieve(subscription_id)


def cancel_subscription(subscription_id: str) -> Dict[str, Any]:
    """Cancel a subscription"""
    return stripe.Subscription.delete(subscription_id)


def validate_webhook_signature(payload: bytes, sig_header: str) -> Dict[str, Any]:
    """Validate and return webhook event"""
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    event = stripe.Webhook.construct_event(
        payload, sig_header, webhook_secret
    )
    return event
