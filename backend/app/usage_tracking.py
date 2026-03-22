# Usage tracking utilities for KerfOS

from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Dict, Any
from app.models import UsageEvent, User
from app.tier_limits import get_tier_limit


def get_current_month_usage(db: Session, user_id: int, resource_type: str) -> int:
    """Get usage count for current month"""
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    count = db.query(UsageEvent).filter(
        UsageEvent.user_id == user_id,
        UsageEvent.resource_type == resource_type,
        UsageEvent.created_at >= month_start
    ).count()
    
    return count


def check_limit(db: Session, user: User, resource_type: str) -> Dict[str, Any]:
    """Check if user has reached limit for a resource type"""
    limit = get_tier_limit(user.tier, f"{resource_type}s_per_month")
    
    if limit == -1:  # Unlimited
        return {
            "allowed": True,
            "limit": "unlimited",
            "used": get_current_month_usage(db, user.id, resource_type),
            "remaining": "unlimited"
        }
    
    used = get_current_month_usage(db, user.id, resource_type)
    remaining = max(0, limit - used)
    
    return {
        "allowed": used < limit,
        "limit": limit,
        "used": used,
        "remaining": remaining
    }


def log_usage_event(db: Session, user_id: int, event_type: str, resource_type: str, resource_id: int = None) -> UsageEvent:
    """Log a usage event"""
    event = UsageEvent(
        user_id=user_id,
        event_type=event_type,
        resource_type=resource_type,
        resource_id=resource_id
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def get_user_stats(db: Session, user: User) -> Dict[str, Any]:
    """Get comprehensive usage stats for a user"""
    return {
        "tier": user.tier,
        "projects": {
            "count": len(user.projects),
            "limit": get_tier_limit(user.tier, "projects")
        },
        "cut_lists": {
            "used_this_month": get_current_month_usage(db, user.id, "cut_list"),
            "limit": get_tier_limit(user.tier, "cut_lists_per_month")
        },
        "exports": {
            "used_this_month": get_current_month_usage(db, user.id, "export"),
            "limit": get_tier_limit(user.tier, "exports_per_month")
        }
    }
