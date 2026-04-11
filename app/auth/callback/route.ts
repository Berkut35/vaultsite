import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
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

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const isRecovery = searchParams.get('type') === 'recovery';
      const redirectUrl = isRecovery 
        ? `${origin}${next}?reset_password=1` 
        : `${origin}${next}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Return to root with error flag
  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
