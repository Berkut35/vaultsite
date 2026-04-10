'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { useState } from 'react';

const VAULT_VALUES    = [true, true, true, true, true, true, true, true, true, true, true, true, true, 'price'];
const ZOTERO_VALUES   = [true, false, true, true, false, false, false, true, false, false, false, true, true, 'price'];
const MENDELEY_VALUES = [true, false, true, true, false, false, false, false, false, false, false, true, false, 'price'];
const NOTION_VALUES   = [false, true, false, false, false, false, false, false, false, false, true, false, false, 'price'];

function BoolCell({ value, isVault }: { value: boolean | string; isVault?: boolean }) {
  if (typeof value === 'string') return null; // handled separately
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: value ? (isVault ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.08)') : 'rgba(255,255,255,0.03)' }}>
      {value
        ? <Check size={12} color="var(--accent-purple)" strokeWidth={2.5} />
        : <X size={11} color="#444444" strokeWidth={2.5} />
      }
    </span>
  );
}

function FeatureLabel({ label, tooltip }: { label: string, tooltip?: string }) {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, cursor: 'help', width: 'fit-content' }}
    >
      <span style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 400 }}>{label}</span>
      {tooltip && (
        <>
          <Info size={11} color="var(--text-muted)" style={{ opacity: 0.5 }} />
          <AnimatePresence>
            {show && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{ 
                  position: 'absolute', bottom: '100%', left: 0, marginBottom: 12, zIndex: 100,
                  width: 200, padding: '10px 12px', borderRadius: 10,
                  background: 'rgba(15,15,15,0.85)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(168,85,247,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  fontSize: 11, lineHeight: 1.5, color: 'rgba(240,240,240,0.9)',
                  pointerEvents: 'none'
                }}
              >
                <div style={{ position: 'absolute', bottom: -5, left: 12, width: 10, height: 10, background: 'rgba(15,15,15,0.85)', transform: 'rotate(45deg)', borderRight: '1px solid rgba(168,85,247,0.25)', borderBottom: '1px solid rgba(168,85,247,0.25)' }} />
                {tooltip}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export function ComparisonTable() {
  const { t } = useLang();
  const c = t.comparison as typeof t.comparison & { tooltips?: (string | undefined)[] };

  return (
    <section id="comparison" style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }} aria-labelledby="comparison-heading">
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 id="comparison-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: '"DM Sans", sans-serif', marginBottom: 12 }}>
            {c.title}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif' }}>{c.subtitle}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"DM Sans", sans-serif' }}>
            <thead>
              <tr>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: '40%', borderBottom: '1px solid var(--border-subtle)' }}>
                  {c.featureLabel}
                </th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--accent-purple)', borderLeft: '2px solid var(--accent-purple)', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(168,85,247,0.04)' }}>
                  Vault
                </th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>Zotero</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>Mendeley</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>Notion</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((rowLabel, i) => {
                const isLast  = i === c.rows.length - 1;
                const rowBg   = i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent';
                const rowBorder = !isLast ? '1px solid rgba(255,255,255,0.03)' : 'none';
                const vVal = VAULT_VALUES[i];
                const nVal = NOTION_VALUES[i];
                const zVal = ZOTERO_VALUES[i];
                const mVal = MENDELEY_VALUES[i];

                return (
                  <tr key={rowLabel} style={{ background: rowBg }}>
                    <td style={{ padding: '14px 20px', borderBottom: rowBorder, verticalAlign: 'middle' }}>
                      <FeatureLabel label={rowLabel} tooltip={c.tooltips?.[i]} />
                    </td>
                    {/* Vault */}
                    <td style={{ padding: '14px 20px', textAlign: 'center', borderLeft: '2px solid var(--accent-purple)', background: 'rgba(168,85,247,0.03)', borderBottom: rowBorder }}>
                      {isLast
                        ? <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-purple)', fontFamily: '"DM Sans", sans-serif' }}>{c.priceVault}</span>
                        : <BoolCell value={vVal as boolean} isVault />
                      }
                    </td>
                    {/* Zotero */}
                    <td style={{ padding: '14px 20px', textAlign: 'center', borderBottom: rowBorder }}>
                      {isLast
                        ? <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif' }}>{c.priceZotero}</span>
                        : <BoolCell value={zVal as boolean} />
                      }
                    </td>
                    {/* Mendeley */}
                    <td style={{ padding: '14px 20px', textAlign: 'center', borderBottom: rowBorder }}>
                      {isLast
                        ? <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif' }}>{c.priceMendeley}</span>
                        : <BoolCell value={mVal as boolean} />
                      }
                    </td>
                    {/* Notion */}
                    <td style={{ padding: '14px 20px', textAlign: 'center', borderBottom: rowBorder }}>
                      {isLast
                        ? <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif' }}>{c.priceNotion}</span>
                        : <BoolCell value={nVal as boolean} />
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
