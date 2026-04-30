"""Payments router — Razorpay integration for subscriptions."""

import os
import hmac
import hashlib
import time
import json
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
import aiohttp

router = APIRouter(prefix="/api/payments", tags=["payments"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")

PLAN_PRICES = {"pro": 49900, "premium": 99900}


class CreateOrderRequest(BaseModel):
    plan: str


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str
    plan: str


async def get_current_user(request: Request):
    """Get user from Authorization header."""
    auth = request.headers.get("Authorization", "")
    if not auth:
        return None
    from backend.auth_middleware import verify_jwt
    return verify_jwt(auth.replace("Bearer ", ""))


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(req: CreateOrderRequest, request: Request):
    """Create Razorpay order for subscription."""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    if req.plan not in PLAN_PRICES:
        raise HTTPException(status_code=400, detail=f"Invalid plan: {req.plan}")

    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail="Razorpay not configured")

    amount = PLAN_PRICES[req.plan]

    async with aiohttp.ClientSession() as session:
        auth = aiohttp.BasicAuth(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
        order_data = {
            "amount": amount,
            "currency": "INR",
            "receipt": f"user_{user.id}_{int(time.time())}",
            "notes": {"user_id": user.id, "plan": req.plan},
        }
        async with session.post(
            "https://api.razorpay.com/v1/orders",
            json=order_data,
            auth=auth,
        ) as resp:
            if resp.status != 200:
                raise HTTPException(status_code=500, detail="Razorpay error")
            order = await resp.json()

    return CreateOrderResponse(
        order_id=order["id"],
        amount=order["amount"],
        currency=order["currency"],
        key_id=RAZORPAY_KEY_ID,
        plan=req.plan,
    )


@router.post("/webhook")
async def razorpay_webhook(request: Request):
    """Handle Razorpay webhooks."""
    body = await request.body()
    signature = request.headers.get("x-razorpay-signature", "")

    if RAZORPAY_WEBHOOK_SECRET:
        expected = hmac.new(
            RAZORPAY_WEBHOOK_SECRET.encode(), body, hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(signature, expected):
            raise HTTPException(status_code=401, detail="Invalid signature")

    event = json.loads(body)
    event_type = event.get("event", "")

    if event_type == "subscription.activated":
        pass
    elif event_type == "subscription.cancelled":
        pass
    elif event_type == "payment.captured":
        pass

    return {"status": "received"}


@router.get("/plans")
async def get_plans():
    """Get available subscription plans."""
    return {
        "plans": [
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
    }


@router.get("/status")
async def get_subscription_status(request: Request):
    """Get current user's subscription status."""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return {"tier": user.tier, "status": user.sub_status}