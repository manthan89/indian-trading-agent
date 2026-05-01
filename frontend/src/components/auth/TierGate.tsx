"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock } from "lucide-react";
import Link from "next/link";

interface TierGateProps {
  requiredTier: "pro" | "premium";
  featureName: string;
  featureDescription: string;
  children: React.ReactNode;
}

export function TierGate({ requiredTier, featureName, featureDescription, children }: TierGateProps) {
  const tierLabel = requiredTier === "premium" ? "Premium" : "Pro";
  const tierColor = requiredTier === "premium" ? "text-purple-600" : "text-blue-600";

  return (
    <div>
      {children}
    </div>
  );
}

export function UpgradePrompt({
  requiredTier,
  featureName,
}: {
  requiredTier: "pro" | "premium";
  featureName: string;
}) {
  const tierLabel = requiredTier === "premium" ? "Premium" : "Pro";

  return (
    <Card className="border-2 border-dashed border-muted">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          {requiredTier === "premium" ? (
            <Crown className="h-6 w-6 text-purple-600" />
          ) : (
            <Lock className="h-6 w-6 text-blue-600" />
          )}
        </div>
        <div>
          <Badge variant="outline" className="mb-2">
            {tierLabel} Required
          </Badge>
          <h3 className="text-lg font-semibold">
            {featureName} requires {tierLabel}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Upgrade to {tierLabel} to access {featureName.toLowerCase()}.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/pricing">
            <Button size="sm">
              Upgrade to {tierLabel}
            </Button>
          </Link>
          <Link href="/app">
            <Button variant="outline" size="sm">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
