import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // --- Language detection & Routing ---
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = pathname.startsWith('/en') || pathname.startsWith('/tr');

  const isApiOrCallback = pathname.startsWith('/auth/') || pathname.startsWith('/api/');
  if (!pathnameHasLocale && pathname !== '/sitemap.xml' && pathname !== '/robots.txt' && !isApiOrCallback) {
    const langCookie = request.cookies.get('vault-lang')?.value;
    const acceptLang = request.headers.get('accept-language') ?? '';
    const detected = langCookie === 'tr' || langCookie === 'en' 
      ? langCookie 
      : acceptLang.toLowerCase().startsWith('tr') ? 'tr' : 'en';

    request.nextUrl.pathname = `/${detected}${pathname}`;
    const redirectResponse = NextResponse.redirect(request.nextUrl);
    redirectResponse.cookies.set('vault-lang', detected, { maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax' });
    return redirectResponse;
  }

  // --- Supabase session refresh ---
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: object }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = (options ?? {}) as Parameters<typeof response.cookies.set>[2];
            response.cookies.set(name, value, cookieOptions);
          });
        },
      },
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
