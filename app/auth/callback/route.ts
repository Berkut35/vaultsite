import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code        = searchParams.get('code');
  const token_hash  = searchParams.get('token_hash');
  const type        = searchParams.get('type') as string | null;
  const next        = searchParams.get('next') ?? '/';

  // ── Password recovery: pass token_hash to client so it can call verifyOtp ───
  // Server-side verifyOtp stores session in cookies; client uses localStorage.
  // We let the client handle verifyOtp to keep the session in localStorage.
  if (token_hash && type === 'recovery') {
    const params = new URLSearchParams({
      reset_password: '1',
      token_hash,
      type,
    });
    return NextResponse.redirect(`${origin}${next}?${params.toString()}`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: object }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = (options ?? {}) as Parameters<typeof cookieStore.set>[2];
            cookieStore.set(name, value, cookieOptions);
          });
        },
      },
    }
  );

  // ── token_hash flow (email confirmation, magic link OTP, etc.) ───────────────
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'invite' | 'magiclink' | 'email_change',
    });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    return NextResponse.redirect(`${origin}/?auth_error=1`);
  }

  // ── code flow (PKCE: magic link, OAuth) ──────────────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const isRecovery = type === 'recovery';
      return NextResponse.redirect(
        isRecovery ? `${origin}${next}?reset_password=1` : `${origin}${next}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
