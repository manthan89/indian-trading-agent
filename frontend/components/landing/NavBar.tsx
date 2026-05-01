"use client";

import Link from "next/link";
import { TrendingUp, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <span className="font-bold text-base">Indian Trading Agent</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="/app" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</a>
          <Link
            href="/app"
            className="h-9 px-4 rounded-lg bg-foreground text-background text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            Start Free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#pricing" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Pricing</a>
            <Link href="/app" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link
              href="/app"
              className="block text-center h-10 rounded-lg bg-foreground text-background text-sm font-medium flex items-center justify-center gap-1.5"
              onClick={() => setMobileOpen(false)}
            >
              Start Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
