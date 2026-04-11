'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SCENE_DURATION = 5000;
const SPEED = 1.25;

const T = {
  bg: '#080C14',
  surface: '#0F1623',
  border: 'rgba(255,255,255,0.055)',
  text: '#E2E8F0',
  sub: '#475569',
  muted: '#1a2035',
  accent: '#A78BFA',
  accentAmber: '#FBBF24',
  accentGreen: '#34D399',
  barBg: 'rgba(8,12,20,0.97)',
};

// ── Shared: Vault Sidebar ─────────────────────────────────────────────────────
function VaultSidebar() {
  return (
    <div style={{ width: 56, background: T.surface, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0', gap: 20, flexShrink: 0 }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(145deg,#1a1f35,#0f1420)', border: '1px solid rgba(167,139,250,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="4" height="14" rx="1" fill="#8B5CF6" opacity="0.9"/>
          <rect x="7" y="3" width="4.5" height="16" rx="1" fill="#6366F1"/>
          <rect x="13" y="6" width="3.5" height="13" rx="1" fill="#7C3AED" opacity="0.85"/>
          <rect x="17.5" y="8" width="3" height="11" rx="1" fill="#4F46E5" opacity="0.8"/>
          <line x1="1.5" y1="19.5" x2="22.5" y2="19.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
        </div>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.45 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.45 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Scene 1: Library ──────────────────────────────────────────────────────────
const DOCS = [
  { name: 'Bilimsel Devrimlerin Yapısı', ext: 'PDF', status: 'reading', tag: 'Felsefe', progress: 36 },
  { name: 'Hızlı ve Yavaş Düşünme',     ext: 'EPUB', status: 'read',    tag: 'Psikoloji', progress: 100 },
  { name: 'Varlık ve Zaman',             ext: 'PDF', status: 'reading', tag: 'Felsefe', progress: 78 },
  { name: 'Gen Bencildir',               ext: 'DOCX', status: 'unread', tag: 'Biyoloji', progress: 0 },
];

const STATUS_INFO: Record<string, { dot: string; color: string; label: string; bg: string }> = {
  reading: { dot: '#F59E0B', color: '#FBBF24', label: 'Okunuyor', bg: 'rgba(251,191,36,0.1)' },
  read:    { dot: '#10B981', color: '#34D399', label: 'Okundu',   bg: 'rgba(52,211,153,0.1)'  },
  unread:  { dot: '#64748B', color: '#94A3B8', label: 'Okunmadı', bg: 'rgba(148,163,184,0.08)' },
};

// ── OmniSearch Data ──────────────────────────────────────────────────────────
const SEARCH_DOCS = [
  { name: 'Bilişsel Gelişim Kuramı - Piaget', ext: 'PDF', tag: 'Psikoloji', match: { ad: true, icerik: true } },
  { name: 'Eğitim Psikolojisi Notları',       ext: 'DOCX', tag: 'Eğitim',    match: { alinti: true } },
  { name: 'Gelişim Psikolojisi Araştırması',   ext: 'PDF', tag: 'Psikoloji', match: { icerik: true } },
  { name: 'Makine Öğrenmesi Giriş',           ext: 'PDF', tag: 'Bilişim',   match: null },
  { name: 'Veri Analizi Yöntemleri',           ext: 'EPUB', tag: 'İstatistik', match: null },
];

const MATCH_BADGES: Record<string, { icon: string; label: string; color: string; bg: string; border: string }> = {
  ad:     { icon: '✓', label: 'ad',     color: '#60A5FA', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.22)' },
  alinti: { icon: '💬', label: 'alıntı', color: '#A78BFA', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.22)' },
  icerik: { icon: '📄', label: 'içerik', color: '#34D399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.22)' },
};

function LibraryScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', height: '100%', background: T.bg }}
    >
      <VaultSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ height: 48, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Library</span>
          <span style={{ width: 1, height: 13, background: T.border }} />
          <span style={{ fontSize: 11, color: T.sub }}>4 öğe</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 7 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: '3px 9px', fontSize: 10.5, color: T.text, display: 'flex', alignItems: 'center', gap: 3 }}>
              Tüm etiketler
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div style={{ background: T.accent, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: '#000' }}>+ Yeni</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: 14, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 9, alignContent: 'start', overflow: 'hidden' }}>
          {DOCS.map((doc, i) => {
            const s = STATUS_INFO[doc.status];
            const isActive = i === 2;
            return (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (0.1 + i * 0.1) / SPEED, duration: 0.4 / SPEED, ease: [0.22,1,0.36,1] }}
                style={{
                  background: T.surface, borderRadius: 9, padding: '9px 11px',
                  border: `1px solid ${isActive ? 'rgba(251,191,36,0.2)' : T.border}`,
                  borderLeft: `2.5px solid ${isActive ? T.accentAmber : s.dot}`,
                  boxShadow: isActive ? '0 0 14px rgba(251,191,36,0.07)' : 'none',
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 24, height: 32, borderRadius: 4, background: T.muted, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: T.accent }}>{doc.ext}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{doc.name}</div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 8.5, padding: '1px 5px', borderRadius: 5, background: `${T.accent}14`, border: `1px solid ${T.accent}30`, color: T.accent }}>{doc.tag}</span>
                      <span style={{ fontSize: 8.5, padding: '1px 6px', borderRadius: 10, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ width: 3.5, height: 3.5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                        {s.label}
                      </span>
                    </div>
                    {doc.progress > 0 && (
                      <div style={{ height: 2, background: T.muted, borderRadius: 2, overflow: 'hidden', maxWidth: 72 }}>
                        <div style={{ height: '100%', width: `${doc.progress}%`, background: doc.status === 'read' ? '#10B981' : T.accent, borderRadius: 2 }} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ── Scene 2: OmniSearch ──────────────────────────────────────────────────────
function OmniSearchScene() {
  const query = 'Piaget';
  const [typed, setTyped] = useState('');
  const [searching, setSearching] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [badges, setBadges] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    query.split('').forEach((_, i) => {
      timers.push(setTimeout(() => setTyped(query.slice(0, i + 1)), (400 + i * 80) / SPEED));
    });
    timers.push(setTimeout(() => setSearching(true), (400 + query.length * 80 + 240) / SPEED));
    timers.push(setTimeout(() => setFiltered(true), 1500 / SPEED));
    timers.push(setTimeout(() => setBadges(true), 2000 / SPEED));
    timers.push(setTimeout(() => setPreview(true), 3000 / SPEED));
    return () => timers.forEach(clearTimeout);
  }, []);

  const visibleDocs = filtered ? SEARCH_DOCS.filter(d => d.match) : SEARCH_DOCS;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', height: '100%', background: T.bg }}
    >
      <VaultSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header with search */}
        <div style={{ height: 48, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Library</span>
          <span style={{ width: 1, height: 13, background: T.border }} />
          {/* Search input */}
          <div style={{ flex: 1, position: 'relative', maxWidth: 280 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', opacity: 0.45 }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
            </svg>
            <div style={{
              width: '100%', padding: '5px 10px 5px 28px', borderRadius: 7, fontSize: 11.5, color: T.text,
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${typed ? T.accent + '66' : T.border}`,
              transition: `border-color ${0.15 / SPEED}s`, minHeight: 26, display: 'flex', alignItems: 'center',
            }}>
              {typed}
              {typed.length < query.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5 / SPEED, repeat: Infinity }}
                  style={{ display: 'inline-block', width: 1, height: 13, background: T.accent, marginLeft: 1 }}
                />
              )}
              {!typed && <span style={{ color: T.sub, fontSize: 11 }}>Ara… (Ctrl+F)</span>}
            </div>
            {searching && typed === query && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.4 / SPEED }}
                style={{ position: 'absolute', inset: -2, borderRadius: 9, border: `1.5px solid ${T.accent}`, pointerEvents: 'none' }}
              />
            )}
          </div>
        </div>

        {/* Results count */}
        {filtered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 / SPEED }}
            style={{ padding: '6px 18px 0', fontSize: 10, color: T.sub }}
          >
            <span style={{ color: T.accent, fontWeight: 600 }}>3</span> sonuç — &quot;{query}&quot;
          </motion.div>
        )}

        {/* Document grid */}
        <div style={{ flex: 1, padding: 14, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 9, alignContent: 'start', overflow: 'hidden' }}>
          <AnimatePresence mode="popLayout">
            {visibleDocs.map((doc, i) => (
              <motion.div
                key={doc.name}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{
                  layout: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.24 / SPEED },
                  scale: { duration: 0.24 / SPEED },
                  delay: filtered ? 0 : (0.08 + i * 0.08) / SPEED,
                }}
                style={{
                  background: T.surface, borderRadius: 9, padding: '9px 11px',
                  border: `1px solid ${doc.match ? T.accent + '25' : T.border}`,
                  borderLeft: `2.5px solid ${doc.match ? T.accent : '#64748B'}`,
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 24, height: 32, borderRadius: 4, background: T.muted, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: T.accent }}>{doc.ext}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{doc.name}</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 8.5, padding: '1px 5px', borderRadius: 5, background: `${T.accent}14`, border: `1px solid ${T.accent}30`, color: T.accent }}>{doc.tag}</span>
                    </div>
                    {badges && doc.match && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 / SPEED, delay: (i * 0.12) / SPEED }}
                        style={{ display: 'flex', gap: 4, marginTop: 5 }}
                      >
                        {Object.entries(doc.match).filter(([, v]) => v).map(([key]) => {
                          const b = MATCH_BADGES[key];
                          return (
                            <span key={key} style={{ fontSize: 8, padding: '1px 5px', borderRadius: 4, background: b.bg, border: `1px solid ${b.border}`, color: b.color, display: 'flex', alignItems: 'center', gap: 2 }}>
                              {b.icon} {b.label}
                            </span>
                          );
                        })}
                      </motion.div>
                    )}
                    {preview && doc.match && 'alinti' in doc.match && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.28 / SPEED }}
                        style={{ marginTop: 6, padding: '5px 7px', background: `${T.accent}08`, borderRadius: 5, border: `1px solid ${T.accent}18`, overflow: 'hidden' }}
                      >
                        <p style={{ fontSize: 8.5, color: T.text, lineHeight: 1.5, margin: 0, opacity: 0.85 }}>
                          &quot;...Piaget&apos;nin bilişsel gelişim evreleri, çocukların düşünce yapılarının...&quot;
                        </p>
                        <span style={{ fontSize: 7.5, color: T.sub, marginTop: 2, display: 'block' }}>Sayfa 42 · Alıntı</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Scene 3: PDF Reader ───────────────────────────────────────────────────────
const LOREM_LINES = [
  'Bilimsel devrimler, birikimli bir ilerleme süreci değil, geçici kabul gören',
  'paradigmaların ani ve köklü dönüşümlerini içeren kesintili sıçramalardır.',
  'Kuhn\'a göre olağan bilim, yerleşik paradigma çerçevesinde bulmaca çözme',
  'etkinliğidir; bu etkinlik anomalileri biriktirerek kendi krizini hazırlar.',
];

const HIGHLIGHT_LINE = 'Kuhn\'a göre olağan bilim, yerleşik paradigma çerçevesinde bulmaca çözme';

function PdfScene() {
  const [highlightVisible, setHighlightVisible] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHighlightVisible(true), 1400 / SPEED);
    const t2 = setTimeout(() => setQuoteVisible(true), 2600 / SPEED);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35 / SPEED, ease: [0.22,1,0.36,1] }}
      style={{ display: 'flex', height: '100%', background: T.bg }}
    >
      <VaultSidebar />

      {/* Page strip */}
      <div style={{ width: 52, background: T.surface, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 6px', gap: 8, overflow: 'hidden' }}>
        {[{ pg: 77, active: false }, { pg: 78, active: true }, { pg: 79, active: false }].map(({ pg, active }) => (
          <div key={pg} style={{ width: 36, background: active ? T.muted : 'transparent', border: `1px solid ${active ? T.accent + '40' : T.border}`, borderRadius: 4, padding: '4px 2px', textAlign: 'center' }}>
            <div style={{ height: 30, background: active ? `${T.accent}10` : T.muted, borderRadius: 2, marginBottom: 3 }} />
            <span style={{ fontSize: 8, color: active ? T.accent : T.sub }}>{pg}</span>
          </div>
        ))}
      </div>

      {/* Main reading area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ height: 44, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: T.sub }}>Library</span>
          <span style={{ fontSize: 10, color: T.sub }}>›</span>
          <span style={{ fontSize: 10, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>Bilimsel Devrimlerin Yapısı</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: T.sub }}>Sayfa 78 / 320</span>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 9.5, color: T.text }}>100%</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 12, lineHeight: 1.9, color: T.text, maxWidth: 520 }}>
            {LOREM_LINES.map((line, i) => {
              const isHighlight = highlightVisible && line === HIGHLIGHT_LINE;
              return (
                <span key={i} style={{ position: 'relative', display: 'inline' }}>
                  {isHighlight && (
                    <motion.span
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.4 / SPEED, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', inset: '-1px -2px', background: 'rgba(251,191,36,0.18)',
                        borderRadius: 3, transformOrigin: 'left', display: 'block', zIndex: 0,
                      }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1, color: isHighlight ? T.accentAmber : T.text }}>
                    {line}{' '}
                  </span>
                </span>
              );
            })}
          </div>

          {/* Quote card */}
          <AnimatePresence>
            {quoteVisible && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 / SPEED, ease: [0.22,1,0.36,1] }}
                style={{
                  position: 'absolute', right: 16, top: 18,
                  width: 180, background: T.surface,
                  border: `1px solid ${T.border}`, borderLeft: `2px solid ${T.accentAmber}`,
                  borderRadius: 8, padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill={T.accentAmber} style={{ marginTop: 2, flexShrink: 0 }}>
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                  </svg>
                  <div>
                    <p style={{ fontSize: 9.5, color: T.text, lineHeight: 1.6, marginBottom: 6 }}>
                      Olağan bilim, yerleşik paradigma çerçevesinde bulmaca çözme etkinliğidir.
                    </p>
                    <span style={{ fontSize: 8, color: T.sub }}>Sayfa 78</span>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 / SPEED }}
                  style={{ marginTop: 8, background: T.accent, borderRadius: 5, padding: '3px 0', textAlign: 'center', fontSize: 9, fontWeight: 600, color: '#000' }}
                >
                  Alıntıyı Kaydet
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Scene 4: Metadata & Citation ─────────────────────────────────────────────
const META_EXISTING_DOCS = [
  { name: 'Bilişsel Gelişim Kuramı - Piaget', ext: 'PDF', tag: 'Psikoloji' },
  { name: 'Eğitim Psikolojisi Notları',       ext: 'DOCX', tag: 'Eğitim' },
  { name: 'Gelişim Psikolojisi Araştırması',   ext: 'PDF', tag: 'Psikoloji' },
];

function MetadataScene() {
  const [dropped, setDropped] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(false);
  const [metaLabels, setMetaLabels] = useState(false);
  const [renamed, setRenamed] = useState(false);
  const [toast, setToast] = useState(false);
  const [citation, setCitation] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setDropped(true), 400 / SPEED));
    timers.push(setTimeout(() => setScanning(true), 800 / SPEED));
    timers.push(setTimeout(() => { setScanning(false); setFound(true); }, 1600 / SPEED));
    timers.push(setTimeout(() => setMetaLabels(true), 1800 / SPEED));
    timers.push(setTimeout(() => setRenamed(true), 2400 / SPEED));
    timers.push(setTimeout(() => setToast(true), 3200 / SPEED));
    timers.push(setTimeout(() => setCitation(true), 3800 / SPEED));
    return () => timers.forEach(clearTimeout);
  }, []);

  const oldName = 'article_final_v3.pdf';
  const newName = 'Yapay Sinir Ağları ile Duygu Analizi - Kılıç.pdf';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', height: '100%', background: T.bg }}
    >
      <VaultSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        {/* Header */}
        <div style={{ height: 48, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Library</span>
          <span style={{ width: 1, height: 13, background: T.border }} />
          <span style={{ fontSize: 11, color: T.sub }}>{META_EXISTING_DOCS.length + (dropped ? 1 : 0)} öğe</span>
        </div>

        {/* Document grid */}
        <div style={{ flex: 1, padding: 14, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 9, alignContent: 'start', overflow: 'hidden' }}>
          {/* Existing documents */}
          {META_EXISTING_DOCS.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (0.08 + i * 0.08) / SPEED, duration: 0.32 / SPEED, ease: [0.22,1,0.36,1] }}
              style={{
                background: T.surface, borderRadius: 9, padding: '9px 11px',
                border: `1px solid ${T.border}`, borderLeft: `2.5px solid #64748B`,
              }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 24, height: 32, borderRadius: 4, background: T.muted, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 7, fontWeight: 700, color: T.accent }}>{doc.ext}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{doc.name}</div>
                  <span style={{ fontSize: 8.5, padding: '1px 5px', borderRadius: 5, background: `${T.accent}14`, border: `1px solid ${T.accent}30`, color: T.accent }}>{doc.tag}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* New document card — drops in */}
          <AnimatePresence>
            {dropped && (
              <motion.div
                initial={{ opacity: 0, y: -40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  background: T.surface, borderRadius: 9, padding: '9px 11px',
                  border: `1px solid ${found ? T.accentGreen + '40' : T.accent + '40'}`,
                  borderLeft: `2.5px solid ${found ? T.accentGreen : T.accent}`,
                  boxShadow: found ? `0 0 16px rgba(52,211,153,0.1)` : `0 0 16px rgba(167,139,250,0.1)`,
                  transition: `border-color ${0.3 / SPEED}s, box-shadow ${0.3 / SPEED}s`,
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 24, height: 32, borderRadius: 4, background: T.muted, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: T.accent }}>PDF</span>
                    {/* Spinner */}
                    {scanning && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.52 / SPEED, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', inset: -3, borderRadius: 6, border: `1.5px solid transparent`, borderTopColor: T.accent, pointerEvents: 'none' }}
                      />
                    )}
                    {/* Checkmark */}
                    {found && !scanning && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, borderRadius: '50%', background: T.accentGreen, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </motion.div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Slot-machine name */}
                    <div style={{ height: 14, overflow: 'hidden', marginBottom: 4, position: 'relative' }}>
                      <motion.div
                        animate={renamed ? { y: -16 } : { y: 0 }}
                        transition={{ duration: 0.4 / SPEED, ease: [0.22,1,0.36,1] }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 600, color: T.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', height: 14, lineHeight: '14px' }}>{oldName}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', height: 14, lineHeight: '14px', marginTop: 2 }}>{newName}</div>
                      </motion.div>
                    </div>

                    {/* Metadata labels */}
                    {metaLabels && (
                      <motion.div
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 / SPEED }}
                        style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}
                      >
                        <span style={{ fontSize: 7.5, padding: '1px 5px', borderRadius: 4, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.22)', color: '#60A5FA' }}>DOI: 10.1016/j.neunet</span>
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.16 / SPEED, duration: 0.2 / SPEED }}
                          style={{ fontSize: 7.5, padding: '1px 5px', borderRadius: 4, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.22)', color: T.accentGreen }}
                        >
                          Crossref ✓
                        </motion.span>
                      </motion.div>
                    )}

                    {/* Scanning label */}
                    {scanning && (
                      <span style={{ fontSize: 8, color: T.accent, opacity: 0.8 }}>Metadata taranıyor...</span>
                    )}

                    {/* Citation preview */}
                    {citation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.28 / SPEED }}
                        style={{ padding: '4px 6px', background: `${T.accentGreen}08`, borderRadius: 4, border: `1px solid ${T.accentGreen}18`, overflow: 'hidden' }}
                      >
                        <p style={{ fontSize: 8, color: T.text, lineHeight: 1.5, margin: 0, opacity: 0.8, fontStyle: 'italic' }}>
                          Kılıç, A. (2024). <em>Yapay Sinir Ağları ile Duygu Analizi</em>. Neural Networks, 45(2), 112-128.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 / SPEED, ease: [0.34,1.56,0.64,1] }}
              style={{
                position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                background: T.surface, border: `1px solid ${T.accentGreen}30`,
                borderRadius: 8, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 7,
                boxShadow: `0 4px 20px rgba(0,0,0,0.4)`, zIndex: 10,
              }}
            >
              <span style={{ fontSize: 12 }}>📚</span>
              <span style={{ fontSize: 10, color: T.text }}>Referans kütüphanesine eklendi</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Scene 3: Canvas ───────────────────────────────────────────────────────────
const CANVAS_NODES = [
  { id: 1, type: 'doc',   label: 'Bilimsel Devrimler', x: 110, y: 80,  color: '#A78BFA', iconColor: '#A78BFA' },
  { id: 2, type: 'doc',   label: 'Hızlı Düşünme',     x: 490, y: 50,  color: '#A78BFA', iconColor: '#A78BFA' },
  { id: 3, type: 'quote', label: '"Paradigma kayması…"', x: 70, y: 245, color: '#FBBF24', iconColor: '#FBBF24' },
  { id: 4, type: 'quote', label: '"Sistem 1 ve 2…"',   x: 440, y: 240, color: '#FBBF24', iconColor: '#FBBF24' },
  { id: 5, type: 'note',  label: 'Bağlantı notu',      x: 660, y: 155, color: '#34D399', iconColor: '#34D399' },
];

const NODE_W = 128;
const NODE_H = 38;

const CANVAS_EDGES = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 5 },
];

function nodeCenter(id: number) {
  const n = CANVAS_NODES.find(n => n.id === id)!;
  return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 };
}

function CanvasScene() {
  const [edgesVisible, setEdgesVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEdgesVisible(true), 900 / SPEED);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 / SPEED }}
      style={{ display: 'flex', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden' }}
    >
      <VaultSidebar />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Grid dot background */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }}>
          <defs>
            <pattern id="grid-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill={T.sub} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
        </svg>

        {/* Canvas header */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, borderBottom: `1px solid ${T.border}`, background: 'rgba(8,12,20,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, zIndex: 10 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
          <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>Bilgi Grafiği</span>
          <span style={{ fontSize: 10, color: T.sub, marginLeft: 4 }}>5 düğüm</span>
        </div>

        {/* SVG Edges */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none', paddingTop: 40 }}>
          {CANVAS_EDGES.map((edge, i) => {
            const from = nodeCenter(edge.from);
            const to = nodeCenter(edge.to);
            const length = Math.hypot(to.x - from.x, to.y - from.y + 40);
            return (
              <motion.line
                key={`${edge.from}-${edge.to}`}
                x1={from.x} y1={from.y + 40}
                x2={to.x}   y2={to.y + 40}
                stroke={`rgba(167,139,250,0.3)`}
                strokeWidth={1.5}
                strokeDasharray={length}
                initial={{ strokeDashoffset: length, opacity: 0 }}
                animate={edgesVisible ? { strokeDashoffset: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5 / SPEED, delay: (i * 0.15) / SPEED, ease: 'easeInOut' }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {CANVAS_NODES.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -3, 0] }}
            transition={{
              opacity: { delay: (0.15 + i * 0.12) / SPEED, duration: 0.35 / SPEED },
              scale:   { delay: (0.15 + i * 0.12) / SPEED, duration: 0.35 / SPEED, ease: [0.22,1,0.36,1] },
              y:       { delay: (1.5 + i * 0.2) / SPEED, duration: 3 / SPEED, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' },
            }}
            style={{
              position: 'absolute',
              left: node.x, top: node.y + 40,
              width: NODE_W, height: NODE_H,
              background: T.surface,
              border: `1px solid ${node.color}35`,
              borderLeft: `2.5px solid ${node.color}`,
              borderRadius: 7,
              display: 'flex', alignItems: 'center', gap: 7, padding: '0 9px',
              boxShadow: `0 2px 12px ${node.color}12`,
              zIndex: 3,
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 4, background: `${node.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {node.type === 'doc'   && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={node.color} strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
              {node.type === 'quote' && <svg width="9" height="9" viewBox="0 0 24 24" fill={node.color}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>}
              {node.type === 'note'  && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={node.color} strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
            </div>
            <span style={{ fontSize: 9.5, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{node.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Scene 4: Export ───────────────────────────────────────────────────────────
const CITATION_TEXT = 'Kuhn, T. S. (1962). The Structure of Scientific Revolutions. University of Chicago Press.';

function ExportScene() {
  const [copied, setCopied] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'APA' | 'MLA' | 'BibTeX'>('APA');

  useEffect(() => {
    const t = setTimeout(() => setCopied(true), 3200 / SPEED);
    return () => clearTimeout(t);
  }, []);

  const formats = ['APA', 'MLA', 'BibTeX'] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.35 / SPEED }}
      style={{ display: 'flex', height: '100%', background: T.bg }}
    >
      <VaultSidebar />

      {/* Document preview (faded) */}
      <div style={{ flex: 1, padding: '20px 18px', opacity: 0.25, overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 12 }}>Bilimsel Devrimlerin Yapısı</div>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ height: 8, background: T.muted, borderRadius: 4, marginBottom: 8, width: `${70 + (i % 3) * 10}%` }} />
        ))}
      </div>

      {/* Export panel */}
      <motion.div
        initial={{ x: 48, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45 / SPEED, delay: 0.15 / SPEED, ease: [0.22,1,0.36,1] }}
        style={{
          width: 260, borderLeft: `1px solid ${T.border}`, background: T.surface,
          display: 'flex', flexDirection: 'column', padding: '18px 16px', gap: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>Atıfları Dışa Aktar</div>
          <div style={{ fontSize: 10, color: T.sub }}>Bilimsel Devrimlerin Yapısı</div>
        </div>

        <div>
          <div style={{ fontSize: 9.5, color: T.sub, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Format</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {formats.map(fmt => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                style={{
                  flex: 1, padding: '5px 0', borderRadius: 6, fontSize: 10.5, fontWeight: 500,
                  border: `1px solid ${selectedFormat === fmt ? T.accent : T.border}`,
                  background: selectedFormat === fmt ? `${T.accent}15` : 'transparent',
                  color: selectedFormat === fmt ? T.accent : T.sub,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 9.5, color: T.sub, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Önizleme</div>
          <div style={{ background: T.muted, borderRadius: 7, padding: '10px 10px', fontSize: 9.5, color: T.text, lineHeight: 1.6, fontFamily: 'monospace', border: `1px solid ${T.border}` }}>
            {CITATION_TEXT}
          </div>
        </div>

        <motion.button
          onClick={() => setCopied(true)}
          animate={copied ? { backgroundColor: 'rgba(52,211,153,0.15)', borderColor: '#34D399' } : {}}
          transition={{ duration: 0.25 / SPEED }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 0', borderRadius: 8, border: `1px solid ${T.border}`,
            background: 'transparent', cursor: 'pointer', fontSize: 11.5, fontWeight: 500,
            color: copied ? T.accentGreen : T.text, transition: 'color 0.25s',
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.accentGreen} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Kopyalandı!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Kopyala
            </>
          )}
        </motion.button>

        <div>
          <div style={{ fontSize: 9.5, color: T.sub, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dosya Olarak İndir</div>
          <div style={{ display: 'flex', gap: 5 }}>
            {['.bib', '.ris', '.txt'].map(ext => (
              <div key={ext} style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: `1px solid ${T.border}`, fontSize: 9.5, color: T.sub, textAlign: 'center', cursor: 'pointer' }}>{ext}</div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── AnimatedDemo Modal ────────────────────────────────────────────────────────
const SCENE_LABELS = ['Kütüphane', 'PDF & Alıntı', 'Bilgi Grafiği', 'Dışa Aktarım'];
const SCENES = [LibraryScene, PdfScene, MetadataScene, CanvasScene, ExportScene];

interface AnimatedDemoProps {
  onClose: () => void;
}

export function AnimatedDemo({ onClose }: AnimatedDemoProps) {
  const [scene, setScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  const tick = useCallback((timestamp: number) => {
    if (prefersReduced.current) return;
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const p = Math.min(elapsed / SCENE_DURATION, 1);
    setProgress(p);
    if (p < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      startTimeRef.current = 0;
      setProgress(0);
      setScene(prev => (prev + 1) % SCENES.length);
    }
  }, []);

  useEffect(() => {
    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scene, tick]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const SceneComponent = SCENES[scene];

  return (
    <div
      role="dialog" aria-modal="true" aria-label={SCENE_LABELS[scene]}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 860,
          background: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(167,139,250,0.08)',
          fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
        }}
      >
        {/* Custom title bar */}
        <div style={{ height: 28, background: T.barBg, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.13)' }} />
            ))}
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: T.sub, letterSpacing: '0.02em' }}>
            vault — {SCENE_LABELS[scene].toLowerCase()}
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.sub, padding: 2, display: 'flex', alignItems: 'center', lineHeight: 1 }}
          >
            <X size={11} />
          </button>
        </div>

        {/* Scene area */}
        <div style={{ height: 400, overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <SceneComponent key={scene} />
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div style={{ height: 38, borderTop: `1px solid ${T.border}`, background: T.barBg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          {SCENE_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => { setScene(i); setProgress(0); startTimeRef.current = 0; cancelAnimationFrame(rafRef.current); }}
              title={label}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
            >
              <div style={{ position: 'relative', width: i === scene ? 28 : 6, height: 5, borderRadius: 3, background: i < scene ? T.accent : (i === scene ? T.accent + '40' : T.muted), transition: 'width 0.3s ease, background 0.3s ease', overflow: 'hidden' }}>
                {i === scene && (
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress * 100}%`, background: T.accent, borderRadius: 3, transition: 'width 0.1s linear' }} />
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
