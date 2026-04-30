"""Protected API routes + auth verification middleware."""

import os
from typing import Optional, Callable
from functools import wraps

from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from backend.auth_middleware import TokenUser, verify_jwt, check_subscription

router = APIRouter(prefix="/api/auth", tags=["auth"])


class AuthUser(BaseModel):
    id: str
    email: str
    tier: str
    sub_status: str


def get_token(request: Request) -> Optional[str]:
    """Extract Bearer token from Authorization header."""
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


async def get_user(request: Request) -> Optional[TokenUser]:
    """Get the current user from request. Returns None if not authenticated."""
    token = get_token(request)
    if not token:
        return None
    return verify_jwt(token)


async def require_user(request: Request) -> TokenUser:
    """Require a valid user. Raises 401 if not authenticated."""
    user = await get_user(request)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Pass 'Authorization: Bearer <token>' header.",
        )
    return user


def require_feature(feature: str):
    """Dependency factory: require user + check feature tier access."""
    async def _check(request: Request) -> TokenUser:
        user = await require_user(request)
        allowed, error = check_subscription(user, feature)
        if not allowed:
            raise HTTPException(status_code=403, detail=error)
        return user
    return _check


@router.get("/me", response_model=AuthUser)
async def get_me(user: TokenUser = Depends(require_user)):
    return AuthUser(
        id=user.id,
        email=user.email,
        tier=user.tier,
        sub_status=user.sub_status,
    )


@router.get("/verify")
async def verify_token(request: Request):
    """Verify token is valid. Returns user info or error."""
    user = await get_user(request)
    if not user:
        return JSONResponse(
            status_code=401,
            content={"valid": False, "message": "Invalid or missing token"},
        )
    return {
        "valid": True,
        "user_id": user.id,
        "email": user.email,
        "tier": user.tier,
        "sub_status": user.sub_status,
    }


@router.get("/limits")
async def get_limits(user: TokenUser = Depends(require_user)):
    """Get user's tier limits."""
    tier = user.tier
    limits = {
        "free": {"analysis": 5, "scan": 10},
        "pro": {"analysis": 15, "scan": 50},
        "premium": {"analysis": 999, "scan": 999},
    }
    return {
        "tier": tier,
        "limits": limits.get(tier, limits["free"]),
    }


@router.post("/usage/report")
async def report_usage(
    request: Request,
    feature: str,
    user: TokenUser = Depends(require_user),
):
    """Record feature usage (called by backend after each analysis/scan)."""
    # This endpoint would increment usage in Supabase via service role key
    # For now, log it - actual Supabase integration comes in Phase 4
    return {"recorded": True, "feature": feature, "user": user.id}


class UpgradeResponse(BaseModel):
    upgrade_needed: bool
    current_tier: str
    suggested_tier: str
    upgrade_url: str
    message: str


@router.get("/upgrade", response_model=UpgradeResponse)
async def get_upgrade_info(user: TokenUser = Depends(require_user)):
    """Get upgrade prompt for the current tier."""
    tier = user.tier
    if tier == "free":
        return UpgradeResponse(
            upgrade_needed=True,
            current_tier="free",
            suggested_tier="pro",
            upgrade_url="/pricing",
            message="Upgrade to Pro for higher limits and backtesting.",
        )
    elif tier == "pro":
        return UpgradeResponse(
            upgrade_needed=True,
            current_tier="pro",
            suggested_tier="premium",
            upgrade_url="/pricing",
            message="Upgrade to Premium for unlimited access + Telegram alerts.",
        )
    return UpgradeResponse(
        upgrade_needed=False,
        current_tier=tier,
        suggested_tier="",
        upgrade_url="",
        message="You have the highest tier!",
    )