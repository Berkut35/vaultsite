# Demo Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add OmniSearch and Metadata/Citation demo scenes to AnimatedDemo.tsx and apply 1.25x speed to all internal animations.

**Architecture:** Two new scene components (OmniSearchScene, MetadataScene) are added to the existing AnimatedDemo carousel in `components/AnimatedDemo.tsx`. A `SPEED` constant divides all internal animation durations/delays. Scene duration (5s) and scene transitions remain unchanged.

**Tech Stack:** React 19, Framer Motion 11, TypeScript, inline styles (matching existing pattern)

---

## File Structure

| File | Change | Responsibility |
|------|--------|----------------|
| `components/AnimatedDemo.tsx` | Modify | Add 2 scene components, update scene array/labels, add SPEED constant, adjust all timing values |

Single-file change — both scenes follow the exact same pattern as existing scenes (self-contained function components with internal useState/useEffect for timed animations).

---

### Task 1: Add SPEED constant and apply 1.25x to LibraryScene

**Files:**
- Modify: `components/AnimatedDemo.tsx:7` (add constant)
- Modify: `components/AnimatedDemo.tsx:96-100` (LibraryScene timings)

- [ ] **Step 1: Add SPEED constant after SCENE_DURATION**

At line 7, after `const SCENE_DURATION = 5000;`, add:

```typescript
const SPEED = 1.25;
```

- [ ] **Step 2: Apply SPEED to LibraryScene card animation**

Change line 100 from:
```typescript
transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: [0.22,1,0.36,1] }}
```
to:
```typescript
transition={{ delay: (0.1 + i * 0.1) / SPEED, duration: 0.4 / SPEED, ease: [0.22,1,0.36,1] }}
```

- [ ] **Step 3: Commit**

```bash
git add components/AnimatedDemo.tsx
git commit -m "feat(demo): add SPEED constant, apply 1.25x to LibraryScene"
```

---

### Task 2: Apply 1.25x speed to PdfScene

**Files:**
- Modify: `components/AnimatedDemo.tsx:147-160` (PdfScene)

- [ ] **Step 1: Update PdfScene setTimeout delays**

Change lines 152-154 from:
```typescript
const t1 = setTimeout(() => setHighlightVisible(true), 1400);
const t2 = setTimeout(() => setQuoteVisible(true), 2600);
```
to:
```typescript
const t1 = setTimeout(() => setHighlightVisible(true), 1400 / SPEED);
const t2 = setTimeout(() => setQuoteVisible(true), 2600 / SPEED);
```

- [ ] **Step 2: Update PdfScene transition durations**

Change the scene container transition (line 160) from:
```typescript
transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
```
to:
```typescript
transition={{ duration: 0.35 / SPEED, ease: [0.22,1,0.36,1] }}
```

Change the highlight scaleX transition (line 196) from:
```typescript
transition={{ duration: 0.4, ease: 'easeOut' }}
```
to:
```typescript
transition={{ duration: 0.4 / SPEED, ease: 'easeOut' }}
```

Change the quote card transition (line 217) from:
```typescript
transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
```
to:
```typescript
transition={{ duration: 0.4 / SPEED, ease: [0.22,1,0.36,1] }}
```

Change the "Alıntıyı Kaydet" button transition (line 240) from:
```typescript
transition={{ delay: 0.3 }}
```
to:
```typescript
transition={{ delay: 0.3 / SPEED }}
```

- [ ] **Step 3: Commit**

```bash
git add components/AnimatedDemo.tsx
git commit -m "feat(demo): apply 1.25x speed to PdfScene"
```

---

### Task 3: Apply 1.25x speed to CanvasScene

**Files:**
- Modify: `components/AnimatedDemo.tsx:279-368` (CanvasScene)

- [ ] **Step 1: Update CanvasScene edge visibility timeout**

Change line 283 from:
```typescript
const t = setTimeout(() => setEdgesVisible(true), 900);
```
to:
```typescript
const t = setTimeout(() => setEdgesVisible(true), 900 / SPEED);
```

- [ ] **Step 2: Update CanvasScene container transition**

Change line 290 from:
```typescript
transition={{ duration: 0.35 }}
```
to:
```typescript
transition={{ duration: 0.35 / SPEED }}
```

- [ ] **Step 3: Update edge stroke transitions**

Change line 328 from:
```typescript
transition={{ duration: 0.5, delay: i * 0.15, ease: 'easeInOut' }}
```
to:
```typescript
transition={{ duration: 0.5 / SPEED, delay: (i * 0.15) / SPEED, ease: 'easeInOut' }}
```

- [ ] **Step 4: Update node animations**

Change lines 341-343 from:
```typescript
transition={{
  opacity: { delay: 0.15 + i * 0.12, duration: 0.35 },
  scale:   { delay: 0.15 + i * 0.12, duration: 0.35, ease: [0.22,1,0.36,1] },
  y:       { delay: 1.5 + i * 0.2, duration: 3, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' },
}}
```
to:
```typescript
transition={{
  opacity: { delay: (0.15 + i * 0.12) / SPEED, duration: 0.35 / SPEED },
  scale:   { delay: (0.15 + i * 0.12) / SPEED, duration: 0.35 / SPEED, ease: [0.22,1,0.36,1] },
  y:       { delay: (1.5 + i * 0.2) / SPEED, duration: 3 / SPEED, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' as const },
}}
```

- [ ] **Step 5: Commit**

```bash
git add components/AnimatedDemo.tsx
git commit -m "feat(demo): apply 1.25x speed to CanvasScene"
```

---

### Task 4: Apply 1.25x speed to ExportScene

**Files:**
- Modify: `components/AnimatedDemo.tsx:374-479` (ExportScene)

- [ ] **Step 1: Update ExportScene setTimeout**

Change line 379 from:
```typescript
const t = setTimeout(() => setCopied(true), 3200);
```
to:
```typescript
const t = setTimeout(() => setCopied(true), 3200 / SPEED);
```

- [ ] **Step 2: Update ExportScene container transition**

Change line 388 from:
```typescript
transition={{ duration: 0.35 }}
```
to:
```typescript
transition={{ duration: 0.35 / SPEED }}
```

- [ ] **Step 3: Update export panel slide-in transition**

Change line 405 from:
```typescript
transition={{ duration: 0.45, delay: 0.15, ease: [0.22,1,0.36,1] }}
```
to:
```typescript
transition={{ duration: 0.45 / SPEED, delay: 0.15 / SPEED, ease: [0.22,1,0.36,1] }}
```

- [ ] **Step 4: Update copied button animation**

Change line 447 from:
```typescript
transition={{ duration: 0.25 }}
```
to:
```typescript
transition={{ duration: 0.25 / SPEED }}
```

- [ ] **Step 5: Commit**

```bash
git add components/AnimatedDemo.tsx
git commit -m "feat(demo): apply 1.25x speed to ExportScene"
```

---

### Task 5: Add OmniSearchScene component

**Files:**
- Modify: `components/AnimatedDemo.tsx` — insert new component after LibraryScene (after line 135)

- [ ] **Step 1: Add OmniSearch document data after DOCS array (after line 62)**

Insert after the `STATUS_INFO` block (after line 68):

```typescript
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
```

- [ ] **Step 2: Add OmniSearchScene component after LibraryScene (after line 135)**

```typescript
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
    // Typewriter: start at 0.4s, each char 0.08s
    query.split('').forEach((_, i) => {
      timers.push(setTimeout(() => setTyped(query.slice(0, i + 1)), (400 + i * 80) / SPEED));
    });
    // Search pulse after typing ends
    timers.push(setTimeout(() => setSearching(true), (400 + query.length * 80 + 240) / SPEED));
    // Filter cards
    timers.push(setTimeout(() => setFiltered(true), 1500 / SPEED));
    // Show match badges
    timers.push(setTimeout(() => setBadges(true), 2000 / SPEED));
    // Quote preview
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
            {/* Search pulse */}
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
                    {/* Match badges */}
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
                    {/* Quote preview for second card */}
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
```

- [ ] **Step 3: Commit**

```bash
git add components/AnimatedDemo.tsx
git commit -m "feat(demo): add OmniSearchScene with typewriter, filter, match badges"
```

---

### Task 6: Add MetadataScene component

**Files:**
- Modify: `components/AnimatedDemo.tsx` — insert new component after PdfScene

- [ ] **Step 1: Add MetadataScene component after PdfScene (after the closing `}` of PdfScene)**

```typescript
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
                    {/* Spinner / Checkmark overlay */}
                    {scanning && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.52 / SPEED, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', inset: -3, borderRadius: 6, border: `1.5px solid transparent`, borderTopColor: T.accent, pointerEvents: 'none' }}
                      />
                    )}
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
```

- [ ] **Step 2: Commit**

```bash
git add components/AnimatedDemo.tsx
git commit -m "feat(demo): add MetadataScene with drop, scan, rename, toast, citation"
```

---

### Task 7: Update scene array, labels, and navigator

**Files:**
- Modify: `components/AnimatedDemo.tsx:482-483` (SCENE_LABELS and SCENES)

- [ ] **Step 1: Update SCENE_LABELS and SCENES arrays**

Change lines 482-483 from:
```typescript
const SCENE_LABELS = ['Kütüphane', 'PDF & Alıntı', 'Bilgi Grafiği', 'Dışa Aktarım'];
const SCENES = [LibraryScene, PdfScene, CanvasScene, ExportScene];
```
to:
```typescript
const SCENE_LABELS = ['Kütüphane', 'OmniSearch', 'PDF & Alıntı', 'Akıllı Künye', 'Bilgi Grafiği', 'Dışa Aktarım'];
const SCENES = [LibraryScene, OmniSearchScene, PdfScene, MetadataScene, CanvasScene, ExportScene];
```

- [ ] **Step 2: Commit**

```bash
git add components/AnimatedDemo.tsx
git commit -m "feat(demo): update scene order to 6 scenes with new labels"
```

---

### Task 8: Visual verification

**Files:**
- None (runtime check)

- [ ] **Step 1: Start dev server and verify**

```bash
cd C:\Uygulama\Vaultsite && npm run dev
```

Open http://localhost:3000, trigger the AnimatedDemo modal, and verify:
- 6 navigator dots appear at bottom
- Scene 1 (Kütüphane): existing library scene, animations noticeably faster
- Scene 2 (OmniSearch): typewriter types "Piaget", cards filter, match badges appear, quote preview slides down
- Scene 3 (PDF & Alıntı): existing PDF scene, faster highlight + quote card
- Scene 4 (Akıllı Künye): PDF drops in, spinner → checkmark, DOI + Crossref labels, slot rename, toast, citation preview
- Scene 5 (Bilgi Grafiği): existing canvas scene, faster node/edge animations
- Scene 6 (Dışa Aktarım): existing export scene, faster panel slide
- All scenes cycle at 5s intervals
- Navigator dots clickable, progress bar works

- [ ] **Step 2: Fix any visual issues found**

- [ ] **Step 3: Final commit**

```bash
git add components/AnimatedDemo.tsx
git commit -m "fix(demo): visual adjustments after testing"
```
