'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';

// ─── Inner component (needs Suspense for useSearchParams) ─────────────────────

function ResetPasswordInner() {
  const { t, lang } = useLang();
  const searchParams = useSearchParams();

  const [status,   setStatus]   = useState<'verifying' | 'ready' | 'success' | 'error'>('verifying');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [message,  setMessage]  = useState('');

  // ── Step 1: establish recovery session ───────────────────────────────────────
  useEffect(() => {
    const sb = getSupabase();
    const token_hash = searchParams?.get('token_hash');
    const type       = searchParams?.get('type');

    if (token_hash && type === 'recovery') {
      // PKCE / OTP email flow — verify the one-time token
      sb.auth.verifyOtp({ token_hash, type: 'recovery' }).then(({ error }) => {
        if (error) {
          setMessage(error.message);
          setStatus('error');
        } else {
          setStatus('ready');
        }
      });
      return;
    }

    // Implicit / hash-based flow — Supabase JS detects from URL hash automatically
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = sb.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStatus('ready');
    });

    // Also check existing session (user may have landed here after redirect)
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus('ready');
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Step 2: update password ───────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMessage(lang === 'tr' ? 'Şifreler eşleşmiyor.' : 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setMessage(lang === 'tr' ? 'Şifre en az 6 karakter olmalıdır.' : 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setMessage('');
    const { error } = await getSupabase().auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setStatus('success');
    }
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 10,
    color: 'var(--text)',
    padding: '11px 40px 11px 38px',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    fontFamily: '"DM Sans", sans-serif',
  };

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = 'rgba(167,139,250,0.5)';
    e.target.style.background  = 'rgba(167,139,250,0.05)';
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = 'rgba(255,255,255,0.09)';
    e.target.style.background  = 'rgba(255,255,255,0.04)';
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: 380, padding: '36px 32px', borderRadius: 20 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #A78BFA, #818CF8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="5" width="4" height="14" rx="1" fill="#8B5CF6" opacity="0.9"/>
              <rect x="7" y="3" width="4.5" height="16" rx="1" fill="#6366F1" opacity="0.95"/>
              <rect x="13" y="6" width="3.5" height="13" rx="1" fill="#7C3AED" opacity="0.85"/>
              <rect x="17.5" y="8" width="3" height="11" rx="1" fill="#4F46E5" opacity="0.8"/>
              <line x1="1.5" y1="19.5" x2="22.5" y2="19.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '0.08em', color: 'var(--text)' }}>
              VAULT
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1, fontFamily: '"DM Sans", sans-serif' }}>
              {lang === 'tr' ? 'Yeni Şifre Oluştur' : 'Create New Password'}
            </div>
          </div>
        </div>

        {/* ── Verifying state ── */}
        {status === 'verifying' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '20px 0' }}>
            <Loader2 size={28} className="animate-spin" style={{ color: '#A78BFA' }} />
            <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: '"DM Sans", sans-serif' }}>
              {lang === 'tr' ? 'Bağlantı doğrulanıyor…' : 'Verifying link…'}
            </p>
          </div>
        )}

        {/* ── Error state (invalid/expired link) ── */}
        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '12px 0' }}>
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.22)',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <AlertCircle size={16} style={{ color: '#FCA5A5', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: '#FCA5A5', fontFamily: '"DM Sans", sans-serif', margin: 0 }}>
                {message || (lang === 'tr' ? 'Geçersiz veya süresi dolmuş bağlantı.' : 'Invalid or expired link.')}
              </p>
            </div>
            <Link
              href={`/${lang}`}
              style={{
                fontSize: 13, color: '#A78BFA', fontFamily: '"DM Sans", sans-serif',
                textDecoration: 'none', fontWeight: 500,
              }}
            >
              ← {lang === 'tr' ? 'Ana sayfaya dön' : 'Back to home'}
            </Link>
          </div>
        )}

        {/* ── Success state ── */}
        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '12px 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle size={26} style={{ color: '#34D399' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', fontFamily: '"DM Sans", sans-serif', margin: '0 0 6px' }}>
                {lang === 'tr' ? 'Şifre güncellendi!' : 'Password updated!'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: '"DM Sans", sans-serif', margin: 0 }}>
                {lang === 'tr' ? 'Yeni şifrenizle giriş yapabilirsiniz.' : 'You can now sign in with your new password.'}
              </p>
            </div>
            <Link
              href={`/${lang}`}
              style={{
                marginTop: 4,
                padding: '9px 28px', borderRadius: 10,
                background: 'rgba(167,139,250,0.88)',
                color: '#fff', fontSize: 13, fontWeight: 600,
                fontFamily: '"DM Sans", sans-serif',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(167,139,250,0.3)',
              }}
            >
              {lang === 'tr' ? 'Giriş yap' : 'Sign in'}
            </Link>
          </div>
        )}

        {/* ── Ready: password form ── */}
        {status === 'ready' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: '"DM Sans", sans-serif', margin: '0 0 4px' }}>
              {lang === 'tr'
                ? 'Hesabınız için güçlü bir şifre belirleyin.'
                : 'Choose a strong password for your account.'}
            </p>

            {/* New password */}
            <div style={{ position: 'relative' }}>
              <Lock size={13} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={lang === 'tr' ? 'Yeni şifre' : 'New password'}
                required
                minLength={6}
                autoComplete="new-password"
                style={inputBase}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', padding: 2,
                }}
              >
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Confirm password */}
            <div style={{ position: 'relative' }}>
              <Lock size={13} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder={lang === 'tr' ? 'Şifreyi tekrarla' : 'Confirm password'}
                required
                minLength={6}
                autoComplete="new-password"
                style={inputBase}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Error message */}
            {message && (
              <div style={{
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.22)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <AlertCircle size={13} style={{ color: '#FCA5A5', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#FCA5A5', fontFamily: '"DM Sans", sans-serif' }}>
                  {message}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px 0',
                borderRadius: 10, border: 'none',
                background: loading ? 'rgba(167,139,250,0.4)' : 'rgba(167,139,250,0.88)',
                color: '#fff', fontSize: 14, fontWeight: 600,
                fontFamily: '"DM Sans", sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 22px rgba(167,139,250,0.32)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s',
              }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading
                ? (lang === 'tr' ? 'Güncelleniyor…' : 'Updating…')
                : (lang === 'tr' ? 'Şifreyi Güncelle' : 'Update Password')}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// ─── Page export (Suspense boundary for useSearchParams) ──────────────────────

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: '#A78BFA' }} />
      </div>
    }>
      <ResetPasswordInner />
    </Suspense>
  );
}
