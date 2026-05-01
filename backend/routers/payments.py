"""Payments router — Subscription plan info (Razorpay skipped per project decision)."""

from fastapi import APIRouter, HTTPException, Request
from typing import Optional

router = APIRouter(prefix="/api/payments", tags=["payments"])


# Plan definitions (kept for frontend pricing page)
PLANS = [
    {
        "id": "free",
        "name": "Free",
        "price": 0,
        "currency": "INR",
        "features": ["Dashboard & Top Picks", "Charts & Heatmap", "50 req/day"],
    },
    {
        "id": "pro",
        "name": "Pro",
        "price": 499,
        "currency": "INR",
        "features": ["All Free + Scanner, Deep Analysis, Strategies", "500 req/day"],
    },
    {
        "id": "premium",
        "name": "Premium",
        "price": 999,
        "currency": "INR",
        "features": ["All Pro + AI Backtest, Telegram Alerts", "Unlimited"],
    },
]


async def get_current_user(request: Request):
    """Get user from Authorization header."""
    auth = request.headers.get("Authorization", "")
    if not auth:
        return None
    from backend.auth_middleware import verify_jwt
    return verify_jwt(auth.replace("Bearer ", ""))


@router.get("/plans")
async def get_plans():
    """Get available subscription plans."""
    return {"plans": PLANS}


@router.get("/status")
async def get_subscription_status(request: Request):
    """Get current user's subscription status."""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return {"tier": user.tier, "status": user.sub_status}
