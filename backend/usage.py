# Usage tracking for CutList Cloud

from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Dict, Any
from models import User, UsageEvent
from stripe_config import TIERS


def log_usage_event(db: Session, user_id: str, event_type: str, resource_type: str) -> UsageEvent:
    """Log a usage event to the database"""
    event = UsageEvent(
        user_id=user_id,
        event_type=event_type,
        resource_type=resource_type
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def get_monthly_usage(db: Session, user_id: str) -> Dict[str, int]:
    """Get usage counts for the current month"""
    start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Count events by resource type
    project_count = db.query(UsageEvent).filter(
        UsageEvent.user_id == user_id,
        UsageEvent.resource_type == "project",
        UsageEvent.created_at >= start_of_month
    ).count()
    
    cut_list_count = db.query(UsageEvent).filter(
        UsageEvent.user_id == user_id,
        UsageEvent.resource_type == "cut_list",
        UsageEvent.created_at >= start_of_month
    ).count()
    
    export_count = db.query(UsageEvent).filter(
        UsageEvent.user_id == user_id,
        UsageEvent.resource_type == "export",
        UsageEvent.created_at >= start_of_month
    ).count()
    
    return {
        "projects": project_count,
        "cut_lists": cut_list_count,
        "exports": export_count
    }


def check_limit(db: Session, user: User, resource_type: str) -> Dict[str, Any]:
    """Check if user has hit their limit for a resource type"""
    tier_config = TIERS.get(user.tier, TIERS["free"])
    limits = tier_config["limits"]
    
    # Get current usage
    usage = get_monthly_usage(db, str(user.id))
    
    # Check if unlimited
    limit_key = f"{resource_type}s_per_month" if resource_type != "project" else "projects"
    limit = limits.get(limit_key, 0)
    
    if limit == -1:  # Unlimited
        return {
            "allowed": True,
            "limit": -1,
            "used": usage.get(resource_type, 0),
            "remaining": -1
        }
    
    used = usage.get(resource_type, 0)
    remaining = max(0, limit - used)
    
    return {
        "allowed": used < limit,
        "limit": limit,
        "used": used,
        "remaining": remaining
    }


def has_feature(user: User, feature: str) -> bool:
    """Check if user's tier includes a specific feature"""
    tier_config = TIERS.get(user.tier, TIERS["free"])
    features = tier_config["features"]
    
    if "all" in features:
        return True
    
    return feature in features


def get_tier_info(user: User) -> Dict[str, Any]:
    """Get full tier information for a user"""
    tier_config = TIERS.get(user.tier, TIERS["free"])
    return {
        "tier": user.tier,
        "name": tier_config["name"],
        "price": tier_config["price"],
        "limits": tier_config["limits"],
        "features": tier_config["features"]
    }
