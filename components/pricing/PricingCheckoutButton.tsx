"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store-auth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

const PLAN_IDS: Record<string, string> = {
  pro: "pro",
  premium: "premium",
};

export function PricingCheckoutButton({
  plan,
  price,
  disabled,
}: {
  plan: "pro" | "premium";
  price: number;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const { user, refreshProfile } = useAuthStore();
  const router = useRouter();
  const supabase = createClient();

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setLoading(true);

    try {
      // 1. Get Razorpay key
      const keyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/plans`
      );
      const keyData = await keyRes.json();

      // 2. Create order via backend
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ plan: PLAN_IDS[plan] }),
        }
      );

      if (!orderRes.ok) {
        const err = await orderRes.json();
        toast.error(err.detail || "Failed to create order");
        setLoading(false);
        return;
      }

      const order = await orderRes.json();

      // 3. Open Razorpay modal
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Indian Trading Agent",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan — Monthly`,
        order_id: order.order_id,
        handler: async (response) => {
          // 4. Verify payment (backend handles via webhook)
          toast.success("Payment successful! Activating your plan...");
          await refreshProfile();
          router.push("/app");
          router.refresh();
        },
        prefill: {
          name: user.user_metadata?.full_name || user.email,
          email: user.email,
        },
        notes: {
          user_id: user.id,
          plan: plan,
        },
        theme: {
          color: "#0f172a",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => {
          toast.error("Payment failed. Please try again.");
          setLoading(false);
        });
        rzp.open();
      } else {
        // Fallback: load Razorpay script dynamically
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", () => {
            toast.error("Payment failed. Please try again.");
            setLoading(false);
          });
          rzp.open();
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || loading}
      className="w-full"
      size="lg"
    >
      {loading ? "Processing..." : `Pay ₹${price}/month`}
    </Button>
  );
}
