import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Lazy singleton (avoids crashing during SSG build) ────────────────────────
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  _client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// ─── Types matching the actual DB schema ──────────────────────────────────────

export type PlanType   = 'free' | 'pro' | 'academic' | 'institutional';
export type SubStatus  = 'trialing' | 'active' | 'past_due' | 'canceled' | 'paused';

/**
 * public.profiles — auto-created by on_auth_user_created trigger
 */
export interface Profile {
  id:                   string;
  email:                string;
  full_name:            string | null;
  avatar_url:           string | null;
  is_academic:          boolean;
  institution:          string | null;
  academic_email:       string | null;
  academic_verified_at: string | null;
  locale:               string;          // 'tr' default
  onboarded:            boolean;
  created_at:           string;
  updated_at:           string;
}

/**
 * public.subscriptions — auto-created by on_auth_user_created trigger
 * plan starts as 'free' / status starts as 'trialing' for 14 days
 */
export interface Subscription {
  id:                   string;
  user_id:              string;
  plan_type:            PlanType;
  status:               SubStatus;
  trial_end:            string | null;
  current_period_start: string;
  current_period_end:   string;
  cancel_at:            string | null;
  canceled_at:          string | null;
  machine_ids:          string[];
  max_devices:          number;
  provider:             string | null;
  provider_customer_id: string | null;
  provider_sub_id:      string | null;
  is_institutional:     boolean;
  seat_count:           number | null;
  created_at:           string;
  updated_at:           string;
}

export interface UserWithPlan {
  profile:      Profile;
  subscription: Subscription;
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

/** Fetch profile + subscription for the given userId in a single round-trip */
export async function getUserWithPlan(userId: string): Promise<UserWithPlan | null> {
  const [profileRes, subRes] = await Promise.all([
    getSupabase().from('profiles').select('*').eq('id', userId).single(),
    getSupabase().from('subscriptions').select('*').eq('user_id', userId).single(),
  ]);
  if (profileRes.error || subRes.error) return null;
  return {
    profile:      profileRes.data as Profile,
    subscription: subRes.data  as Subscription,
  };
}

/**
 * Update profile locale — called after auth so Vault app and site stay in sync.
 * Does NOT touch the subscription; that is handled by the payment webhook.
 */
export async function syncLocale(userId: string, locale: 'tr' | 'en'): Promise<void> {
  await getSupabase()
    .from('profiles')
    .update({ locale, updated_at: new Date().toISOString() })
    .eq('id', userId);
}

/**
 * Called after a successful payment webhook to upgrade the user.
 * In production this should be called from a server action / API route
 * using the service_role key — NOT from the client.
 *
 * Shape: updates plan_type + status + current_period_end in subscriptions.
 * (Payment API integration will replace the placeholder below.)
 */
export async function upgradePlan(
  userId:          string,
  plan:            PlanType,
  periodEndDate:   Date,
  provider?:       string,
  providerSubId?:  string,
): Promise<{ error: string | null }> {
  const { error } = await getSupabase()
    .from('subscriptions')
    .update({
      plan_type:            plan,
      status:               'active',
      current_period_start: new Date().toISOString(),
      current_period_end:   periodEndDate.toISOString(),
      provider:             provider  ?? null,
      provider_sub_id:      providerSubId ?? null,
      updated_at:           new Date().toISOString(),
    })
    .eq('user_id', userId);

  return { error: error?.message ?? null };
}

/**
 * Convenience: is this subscription currently active (not free/trial)?
 */
export function isPaidPlan(sub: Subscription): boolean {
  return sub.plan_type !== 'free' &&
    (sub.status === 'active' || sub.status === 'trialing') &&
    new Date(sub.current_period_end) > new Date();
}
