# KerfOS - Unified FastAPI Backend
# Full feature integration with SaaS billing and tier limits

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import os
from datetime import datetime
from typing import Optional

from app.database import engine, Base, get_db
from app.models import User
from app.routers import (
    auth, projects, cabinets, cutlists, materials, hardware,
    hardware_recommendations, edge_banding, price_feeds, scrap,
    scratch_build, sketch_to_design, store_integration, collaboration,
    community_gallery, ar_scanner, advanced_nesting, gcode,
    localization, gdpr, billing
)

# Security
security = HTTPBearer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="KerfOS API",
    description="AI-powered cabinet design with cut list optimization and hardware sourcing",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency to get current user with tier info
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_db)
) -> User:
    """Get current user from JWT token"""
    from jose import jwt, JWTError
    
    token = credentials.credentials
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM = "HS256"
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


# Include all routers
app.include_router(auth.router)
app.include_router(billing.router)
app.include_router(projects.router)
app.include_router(cabinets.router)
app.include_router(cutlists.router)
app.include_router(materials.router)
app.include_router(hardware.router)
app.include_router(hardware_recommendations.router)
app.include_router(edge_banding.router)
app.include_router(price_feeds.router)
app.include_router(scrap.router)
app.include_router(scratch_build.router)
app.include_router(sketch_to_design.router)
app.include_router(store_integration.router)
app.include_router(collaboration.router)
app.include_router(community_gallery.router)
app.include_router(ar_scanner.router)
app.include_router(advanced_nesting.router)
app.include_router(gcode.router)
app.include_router(localization.router)
app.include_router(gdpr.router)


# Health check endpoints
@app.get("/")
async def root():
    return {
        "message": "KerfOS API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow()}


# User stats endpoint
@app.get("/api/user/stats")
async def user_stats(
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get current user's usage statistics"""
    from app.usage_tracking import get_user_stats
    return get_user_stats(db, current_user)


# Tier info endpoint
@app.get("/api/tiers")
async def get_tier_info():
    """Get information about all available tiers"""
    from app.tier_limits import TIER_LIMITS
    
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
            'limits': config,
            'features': config.get('features', [])
        }
        for tier, config in TIER_LIMITS.items()
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
