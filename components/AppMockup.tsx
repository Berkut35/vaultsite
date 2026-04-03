'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Theme Data ──────────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "dark",
    name: "Dark",
    bg: "#080C14", surface: "#0F1623", border: "rgba(255,255,255,0.055)", text: "#E2E8F0", sub: "#475569", muted: "#2D3748",
    barBg: "rgba(8,12,20,0.97)", card: "#111827", cardHover: "#141E2E", accent: "#A78BFA",
    sidebarIconWrapper: "rgba(167,139,250,0.1)", logoWrapper: "linear-gradient(145deg,#1a1f35,#0f1420)",
    iconStroke: "#A78BFA",
  },
  {
    id: "light",
    name: "Light",
    bg: "#F0F4FA", surface: "#F8FAFD", border: "rgba(71,85,105,0.12)", text: "#1E293B", sub: "#64748B", muted: "#CBD5E1",
    barBg: "rgba(240,244,250,0.97)", card: "#FFFFFF", cardHover: "#F5F8FE", accent: "#7C3AED",
    sidebarIconWrapper: "rgba(124,58,237,0.1)", logoWrapper: "linear-gradient(145deg,#e0e7ff,#f0f4fa)",
    iconStroke: "#7C3AED",
  },
  {
    id: "black",
    name: "Black",
    bg: "#000000", surface: "#0A0A0A", border: "rgba(255,255,255,0.04)", text: "#F8FAFC", sub: "#374151", muted: "#1F2937",
    barBg: "rgba(0,0,0,0.99)", card: "#0D0D0D", cardHover: "#141414", accent: "#6366F1",
    sidebarIconWrapper: "rgba(99,102,241,0.1)", logoWrapper: "linear-gradient(145deg,#000000,#0a0a0a)",
    iconStroke: "#6366F1",
  },
  {
    id: "sepia",
    name: "Sepia",
    bg: "#F5ECD7", surface: "#FEF9EF", border: "rgba(146,64,14,0.12)", text: "#44260D", sub: "#92400E", muted: "#D6B896",
    barBg: "rgba(245,236,215,0.97)", card: "#FEF9EF", cardHover: "#FAF3E0", accent: "#92400E",
    sidebarIconWrapper: "rgba(146,64,14,0.1)", logoWrapper: "linear-gradient(145deg,#e8dcc8,#f5ecd7)",
    iconStroke: "#92400E",
  },
  {
    id: "ocean",
    name: "Ocean",
    bg: "#071B2F", surface: "#0A2540", border: "rgba(56,189,248,0.1)", text: "#E0F2FE", sub: "#38BDF8", muted: "#164E63",
    barBg: "rgba(7,27,47,0.98)", card: "#0C2E4A", cardHover: "#0F3658", accent: "#38BDF8",
    sidebarIconWrapper: "rgba(56,189,248,0.1)", logoWrapper: "linear-gradient(145deg,#071B2F,#0A2540)",
    iconStroke: "#38BDF8",
  },
  {
    id: "forest",
    name: "Forest",
    bg: "#0D1F0F", surface: "#122614", border: "rgba(74,222,128,0.1)", text: "#DCFCE7", sub: "#4ADE80", muted: "#14532D",
    barBg: "rgba(13,31,15,0.98)", card: "#162A18", cardHover: "#1A321C", accent: "#4ADE80",
    sidebarIconWrapper: "rgba(74,222,128,0.1)", logoWrapper: "linear-gradient(145deg,#0D1F0F,#122614)",
    iconStroke: "#4ADE80",
  },
];

// ─── Document data ────────────────────────────────────────────────────────────
const docs = [
  { name: 'Bilimsel Devrimlerin Yapısı', ext: 'pdf', status: 'reading', tag: 'Felsefe', progress: 36, size: '2.4 MB', pages: 320, date: '12 Eki', pinned: true },
  { name: 'Hızlı ve Yavaş Düşünme', ext: 'epub', status: 'read', tag: 'Psikoloji', progress: 100, size: '1.1 MB', pages: 480, date: '10 Eki', pinned: false },
  { name: 'Varlık ve Zaman', ext: 'pdf', status: 'reading', tag: 'Felsefe', progress: 78, size: '4.8 MB', pages: 589, date: '08 Eki', pinned: false },
  { name: 'Gen Bencildir', ext: 'docx', status: 'unread', tag: 'Biyoloji', progress: 0, size: '3.2 MB', pages: 360, date: '05 Eki', pinned: false },
];

const STATUS: Record<string, { dot: string; bg: string; color: string; label: string }> = {
  unread:  { dot: '#64748B', bg: 'rgba(148,163,184,0.1)', color: '#94A3B8', label: 'Okunmadı' },
  reading: { dot: '#F59E0B', bg: 'rgba(251,191,36,0.1)', color: '#FBBF24', label: 'Okunuyor' },
  read:    { dot: '#10B981', bg: 'rgba(52,211,153,0.1)', color: '#34D399', label: 'Okundu' },
};

// ─── Small doc card for the grid panel ───────────────────────────────────────
function DocCard({ doc, index, active, theme }: { doc: typeof docs[0]; index: number; active?: boolean; theme: typeof THEMES[0] }) {
  const s = STATUS[doc.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.05, duration: 0.4 }}
      style={{
        background: active ? theme.surface : theme.card,
        border: active ? `1px solid ${theme.border}` : doc.pinned ? `1px solid ${theme.accent}40` : `1px solid ${theme.border}`,
        borderLeft: `2.5px solid ${active ? theme.accent : doc.pinned ? theme.accent : s.dot}`,
        borderRadius: 10,
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        cursor: 'default',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Document Icon */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 30, height: 40, borderRadius: 5, background: theme.surface, border: `1px solid ${theme.border}`, transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out' }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', transition: 'color 1.5s ease-in-out' }}>{doc.ext}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title & Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, lineHeight: 1.25, transition: 'color 1.5s ease-in-out' }}>
              {doc.name}
            </div>
          </div>

          {/* Metadata */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'nowrap', marginBottom: 4, overflow: 'hidden' }}>
            <span style={{ fontSize: 10, color: theme.sub, transition: 'color 1.5s ease-in-out' }}>{doc.size}</span>
            <span style={{ fontSize: 10, color: theme.muted, transition: 'color 1.5s ease-in-out' }}>·</span>
            <span style={{ fontSize: 10, color: theme.sub, transition: 'color 1.5s ease-in-out' }}>{doc.date}</span>
            {doc.pages > 0 && (
              <>
                <span style={{ fontSize: 10, color: theme.muted, transition: 'color 1.5s ease-in-out' }}>·</span>
                <span style={{ fontSize: 10, color: theme.sub, transition: 'color 1.5s ease-in-out' }}>{doc.pages} sf</span>
              </>
            )}
          </div>

          {/* Progress bar */}
          {doc.pages > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ flex: 1, height: 2, background: theme.border, borderRadius: 2, overflow: 'hidden', maxWidth: 100, transition: 'background 1.5s ease-in-out' }}>
                <div style={{ height: '100%', width: `${doc.progress}%`, background: doc.status === 'read' ? '#10B981' : theme.accent, borderRadius: 2, transition: 'background 1.5s ease-in-out' }} />
              </div>
            </div>
          )}
        </div>

        {/* Status Pill */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 12, border: `1px solid ${s.dot}20`, background: s.bg, fontSize: 9, color: s.color, fontWeight: 500 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: s.dot }} />{s.label}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 2 }}>
            <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 6, background: `${theme.accent}14`, border: `1px solid ${theme.accent}30`, color: theme.accent, fontWeight: 400, transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out' }}>{doc.tag}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AppMockup() {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % THEMES.length);
    }, 7000); // Change theme every 7 seconds to match soothing 2.5s transition
    return () => clearInterval(timer);
  }, []);

  const theme = THEMES[themeIndex];

  return (
    <div style={{
      width: '100%',
      maxWidth: 860,
      borderRadius: 12,
      overflow: 'hidden',
      background: theme.bg,
      border: `1px solid ${theme.border}`,
      boxShadow: `0 40px 100px rgba(0,0,0,${theme.id === 'light' ? '0.1' : '0.7'}), 0 0 0 1px ${theme.accent}20`,
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      color: theme.text,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out',
    }}>
    
      {/* Theme Indicator Overlays */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={theme.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute', 
            bottom: 20, 
            right: 20, 
            background: theme.barBg, 
            border: `1px solid ${theme.border}`,
            color: theme.text, 
            fontSize: 11, 
            fontWeight: 600,
            padding: '4px 10px', 
            borderRadius: 8, 
            zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent }} />
          Theme: {theme.name}
        </motion.div>
      </AnimatePresence>

      {/* ── Custom Title Bar ── */}
      <div style={{
        height: 28, background: theme.barBg,
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: 12,
        transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: theme.id === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)', transition: 'background 1.5s ease-in-out' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: theme.id === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)', transition: 'background 1.5s ease-in-out' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: theme.id === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)', transition: 'background 1.5s ease-in-out' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 10, color: theme.sub, letterSpacing: '0.02em', pointerEvents: 'none', transition: 'color 1.5s ease-in-out' }}>
          vault — workspace
        </div>
        <div style={{ width: 42 }} /> {/* padding balancer */}
      </div>

      <div style={{ display: 'flex', height: 420 }}>
        {/* ── Sidebar ── */}
        <div style={{ width: 60, background: theme.surface, borderRight: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: 24, zIndex: 2, transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out' }}>
          {/* Logo */}
          <div style={{ width: 30, height: 30, borderRadius: 8, background: theme.logoWrapper, border: `1px solid ${theme.accent}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <rect x="2" y="5" width="4" height="14" rx="1" fill="#8B5CF6" opacity="0.9"/>
              <rect x="7" y="3" width="4.5" height="16" rx="1" fill="#6366F1" opacity="0.95"/>
              <rect x="13" y="6" width="3.5" height="13" rx="1" fill="#7C3AED" opacity="0.85"/>
              <rect x="17.5" y="8" width="3" height="11" rx="1" fill="#4F46E5" opacity="0.8"/>
              <line x1="1.5" y1="19.5" x2="22.5" y2="19.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          {/* Icons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: theme.sidebarIconWrapper, border: `1px solid ${theme.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.iconStroke} strokeWidth="1.5" style={{transition: 'stroke 1.5s ease-in-out'}}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <div style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.sub} strokeWidth="1.5" style={{transition: 'stroke 1.5s ease-in-out'}}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.sub} strokeWidth="1.5" style={{transition: 'stroke 1.5s ease-in-out'}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
            </div>
          </div>
          <div style={{ marginTop: 'auto', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.sub} strokeWidth="1.5" style={{transition: 'stroke 1.5s ease-in-out'}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </div>
        </div>

        {/* ── Main Panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, backgroundImage: `radial-gradient(circle at 100% 0%, ${theme.accent}10 0%, transparent 40%)`, zIndex: 1, transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out' }}>
          
          {/* Header */}
          <div style={{ height: 52, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: theme.text, letterSpacing: '-0.01em', transition: 'color 1.5s ease-in-out' }}>Library</div>
            <div style={{ width: 1, height: 16, background: theme.border, transition: 'background 1.5s ease-in-out' }} />
            <div style={{ fontSize: 13, color: theme.sub, transition: 'color 1.5s ease-in-out' }}>{docs.length} items</div>
            
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 6, padding: '5px 12px', fontSize: 11.5, color: theme.text, display: 'flex', alignItems: 'center', gap: 6, transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out' }}>
                All tags 
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
              <div style={{ background: theme.accent, borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: theme.id === 'light' ? '#fff' : '#000', boxShadow: `0 2px 8px ${theme.accent}30`, transition: 'background 2.5s ease-in-out, border-color 2.5s ease-in-out, color 2.5s ease-in-out, box-shadow 2.5s ease-in-out, stroke 2.5s ease-in-out' }}>
                + New
              </div>
            </div>
          </div>

          {/* Grid Area */}
          <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, alignContent: 'start',
            }}>
              {docs.map((doc, i) => (
                <DocCard key={i} doc={doc} index={i} active={i === 2} theme={theme} />
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)',
        width: 320, height: 100,
        background: `radial-gradient(ellipse at center, ${theme.accent}30 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 10,
        transition: 'background 1.5s ease-in-out'
      }} />
    </div>
  );
}
