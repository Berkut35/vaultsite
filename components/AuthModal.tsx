'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { getSupabase, syncLocale } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';

interface AuthModalProps {
  isOpen:       boolean;
  onClose:      () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const { t, lang } = useLang();
  const a = t.auth;

  const [mode, setMode]       = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const reset = () => { setError(''); setSuccess(''); };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    reset();

    const sb = getSupabase();

    if (mode === 'signup' && !termsAccepted) {
      setError(a.termsError);
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signin') {
        const { data, error: err } = await sb.auth.signInWithPassword({ email, password });
        if (err) throw err;
        // Sync locale to DB so Vault desktop and website stay in sync
        if (data.user) await syncLocale(data.user.id, lang);
        onClose();
      } else {
        // Signup: pass full_name + locale as metadata.
        // on_auth_user_created trigger reads raw_user_meta_data->>'full_name'
        // and automatically inserts profiles + subscriptions rows.
        const { data, error: err } = await sb.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName.trim() || email.split('@')[0],
              locale:    lang,
            },
          },
        });
        if (err) throw err;

        // If email confirmation is disabled in Supabase, user is returned immediately
        if (data.session) {
          onClose();
        } else {
          setSuccess(a.emailSent);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : a.errorGeneric;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    if (!email) { setError('Please enter your email first.'); return; }
    setLoading(true);
    reset();
    const { error: err } = await getSupabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (err) setError(err.message);
    else setSuccess(a.emailSent);
  }

  const inputClass =
    'w-full text-sm rounded-lg outline-none transition-all';
  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    color: 'var(--text)',
    padding: '10px 12px 10px 36px',
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(167,139,250,0.5)';
    e.target.style.background  = 'rgba(167,139,250,0.05)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.09)';
    e.target.style.background  = 'rgba(255,255,255,0.04)';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0,   scale: 0.96,  y: 8  }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="glass-card relative w-full max-w-sm rounded-modal"
              style={{ padding: '32px 28px' }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <X size={16} />
              </button>

              {/* Logo + Header */}
              <div className="flex items-center gap-2 mb-6">
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'linear-gradient(135deg, #A78BFA, #818CF8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <rect x="2" y="5" width="4" height="14" rx="1" fill="#8B5CF6" opacity="0.9"/>
                    <rect x="7" y="3" width="4.5" height="16" rx="1" fill="#6366F1" opacity="0.95"/>
                    <rect x="13" y="6" width="3.5" height="13" rx="1" fill="#7C3AED" opacity="0.85"/>
                    <rect x="17.5" y="8" width="3" height="11" rx="1" fill="#4F46E5" opacity="0.8"/>
                    <line x1="1.5" y1="19.5" x2="22.5" y2="19.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-syne font-bold text-base leading-tight" style={{ color: 'var(--text)', letterSpacing: '0.08em' }}>
                    VAULT
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)', marginTop: 1 }}>
                    {mode === 'signin' ? a.signin : a.signup}
                  </div>
                </div>
              </div>

              {/* Mode switch */}
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                {mode === 'signin' ? a.noAccount : a.hasAccount}{' '}
                <button
                  onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); reset(); }}
                  className="font-medium transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  {mode === 'signin' ? a.signupBtn : a.signinBtn}
                </button>
              </p>

              {/* Alerts */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-lg flex items-start gap-2 text-xs"
                    style={{ background: 'rgba(248,113,113,0.09)', border: '1px solid rgba(248,113,113,0.22)', color: '#FCA5A5' }}
                  >
                    <AlertCircle size={13} className="mt-0.5 shrink-0" />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-lg flex items-start gap-2 text-xs"
                    style={{ background: 'rgba(52,211,153,0.09)', border: '1px solid rgba(52,211,153,0.22)', color: '#6EE7B7' }}
                  >
                    <CheckCircle size={13} className="mt-0.5 shrink-0" />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Full name — signup only */}
                <AnimatePresence>
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
                      <input
                        type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                        placeholder="Full name"
                        className={inputClass} style={inputStyle}
                        onFocus={onFocus} onBlur={onBlur}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder={a.email} required autoComplete="email"
                    className={inputClass} style={inputStyle}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
                  <input
                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder={a.password} required minLength={6} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    className={inputClass} style={inputStyle}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                </div>

                {mode === 'signup' && (
                  <div className="flex items-start gap-2 px-1 py-1">
                    <div className="relative flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-vault-border bg-white/5 text-accent-purple focus:ring-accent-purple/50 cursor-pointer accent-purple-500"
                        id="terms"
                      />
                    </div>
                    <label htmlFor="terms" className="text-[11px] leading-snug cursor-pointer select-none" style={{ color: 'var(--muted)' }}>
                      {lang === 'tr' ? (
                        <>
                          <a href="/tr/legal/terms" target="_blank" className="text-blue-400 underline hover:text-accent-purple transition-colors">Kullanım Koşulları</a>,{' '}
                          <a href="/tr/legal/privacy" target="_blank" className="text-blue-400 underline hover:text-accent-purple transition-colors">Gizlilik Sözleşmesi</a> ve{' '}
                          <a href="/tr/legal/kvkk" target="_blank" className="text-blue-400 underline hover:text-accent-purple transition-colors">KVKK</a> metinlerini okudum, anladım.
                        </>
                      ) : (
                        <>
                          I have read and understood the{' '}
                          <a href="/en/legal/terms" target="_blank" className="text-blue-400 underline hover:text-accent-purple transition-colors">Terms of Service</a>,{' '}
                          <a href="/en/legal/privacy" target="_blank" className="text-blue-400 underline hover:text-accent-purple transition-colors">Privacy Policy</a>, and{' '}
                          <a href="/en/legal/kvkk" target="_blank" className="text-blue-400 underline hover:text-accent-purple transition-colors">KVKK</a>.
                        </>
                      )}
                    </label>
                  </div>
                )}

                {mode === 'signin' && (
                  <div className="text-right -mt-1">
                    <button type="button" className="text-xs transition-colors" style={{ color: 'var(--muted)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                    >
                      {a.forgotPassword}
                    </button>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mt-1"
                  style={{
                    background: loading ? 'rgba(167,139,250,0.4)' : 'rgba(167,139,250,0.88)',
                    color: '#fff',
                    boxShadow: loading ? 'none' : '0 4px 22px rgba(167,139,250,0.32)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#A78BFA'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'rgba(167,139,250,0.88)'; }}
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading
                    ? (mode === 'signin' ? a.signingIn : a.creatingAccount)
                    : (mode === 'signin' ? a.signinBtn  : a.signupBtn)
                  }
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{a.orContinue}</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
              </div>

              {/* Magic link */}
              <button
                onClick={handleMagicLink} disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'var(--text)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <Mail size={14} />
                Magic Link
              </button>


            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
