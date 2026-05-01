import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import type { Profile, SubscriptionTier } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: true,
      initialized: false,

      initialize: async () => {
        if (get().initialized) return;
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          set({ user, loading: false });
          await get().refreshProfile();
        } else {
          set({ user: null, profile: null, loading: false, initialized: true });
        }
      },

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),

      signOut: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        set({ user: null, profile: null });
      },

      refreshProfile: async () => {
        const { user } = get();
        if (!user) return;

        const supabase = createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        set({ profile: profile as Profile | null, initialized: true });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        // Only persist non-sensitive minimal state
        initialized: state.initialized,
      }),
    }
  )
);

// Convenience selectors
export const selectTier = (state: AuthState): SubscriptionTier =>
  state.profile?.subscription_tier ?? "free";

export const selectCanUseAnalysis = (state: AuthState): boolean => {
  const p = state.profile;
  if (!p) return true; // non-authenticated = free limited
  if (p.subscription_tier === "premium") return true;
  if (p.subscription_tier === "pro") {
    return (p.usage_analysis_count ?? 0) < p.usage_analysis_limit * 3;
  }
  return (p.usage_analysis_count ?? 0) < (p.usage_analysis_limit ?? 5);
};

export const selectCanUseScan = (state: AuthState): boolean => {
  const p = state.profile;
  if (!p) return true;
  if (p.subscription_tier === "premium") return true;
  if (p.subscription_tier === "pro") {
    return (p.usage_scan_count ?? 0) < p.usage_scan_limit * 3;
  }
  return (p.usage_scan_count ?? 0) < (p.usage_scan_limit ?? 10);
};
