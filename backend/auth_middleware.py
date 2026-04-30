"""Supabase JWT token verification + tier enforcement for backend API."""
import os
import httpx
from typing import Optional
from dataclasses import dataclass

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")


@dataclass
class TokenUser:
    """Verified user extracted from Supabase JWT."""
    id: str
    email: str
    tier: str  # 'free' | 'pro' | 'premium'
    sub_status: str
    api_request_count: int = 0


def verify_jwt(token: str) -> Optional[TokenUser]:
    """Verify a Supabase JWT and return the user. Returns None if invalid."""
    if not token or not SUPABASE_URL:
        return None

    # Remove Bearer prefix if present
    if token.startswith("Bearer "):
        token = token[7:]

    try:
        resp = httpx.get(
            f"{SUPABASE_URL}/auth/v1/jwt",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": SUPABASE_SERVICE_ROLE_KEY,
            },
            timeout=5.0,
        )
        if resp.status_code != 200:
            return None

        data = resp.json()
        claims = data.get("data", {})
        user_id = claims.get("sub") or data.get("id")
        if not user_id:
            return None

        # Default tier for local/dev (no Supabase)
        tier = claims.get("user_metadata", {}).get("subscription_tier", "free")
        sub_status = claims.get("user_metadata", {}).get("subscription_status", "active")

        return TokenUser(
            id=user_id,
            email=claims.get("email", ""),
            tier=tier,
            sub_status=sub_status,
        )
    except Exception:
        return None


def check_subscription(
    user: TokenUser,
    feature: str,  # 'analysis' | 'scan' | 'backtest' | 'api_key'
    required_tier: str = "free",
) -> tuple[bool, str]:
    """
    Check if user can access a feature.
    Returns (allowed, error_message).
    """
    # Map: feature -> required tier
    tier_map = {
        "analysis": "free",
        "scan": "free",
        "backtest": "pro",
        "api_key": "premium",
        "deep_analysis": "pro",
    }
    required = tier_map.get(feature, "free")

    tier_order = ["free", "pro", "premium"]
    user_level = tier_order.index(user.tier) if user.tier in tier_order else 0
    required_level = tier_order.index(required) if required in tier_order else 0

    if user_level < required_level:
        tier_names = {"free": "Free", "pro": "Pro", "premium": "Premium"}
        return False, f"Upgrade to {tier_names.get(required, required)} plan to access this feature."

    if user.sub_status in ("canceled", "inactive"):
        return False, "Your subscription has ended. Please renew to continue."

    if user.sub_status == "past_due":
        return False, "Payment is past due. Please update your payment method."

    return True, ""