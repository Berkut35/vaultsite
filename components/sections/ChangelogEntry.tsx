import ReactMarkdown from 'react-markdown';
import type { Release } from '@/lib/github';

interface ChangelogEntryProps {
  release: Release;
  lang: 'en' | 'tr';
}

export function ChangelogEntry({ release, lang }: ChangelogEntryProps) {
  const date = new Date(release.published_at).toLocaleDateString(
    lang === 'tr' ? 'tr-TR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div style={{
      paddingBottom: 48,
      marginBottom: 48,
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{
          fontFamily: 'monospace',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--accent-purple)',
          background: 'rgba(168,85,247,0.1)',
          border: '1px solid rgba(168,85,247,0.25)',
          borderRadius: 6,
          padding: '2px 8px',
        }}>
          {release.tag_name}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: '"DM Sans", sans-serif' }}>
          {date}
        </span>
      </div>

      {release.name && (
        <h2 style={{
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 16,
          fontFamily: '"DM Sans", sans-serif',
          letterSpacing: '-0.02em',
        }}>
          {release.name}
        </h2>
      )}

      <div style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif' }}>
        <ReactMarkdown>{release.body ?? ''}</ReactMarkdown>
      </div>
    </div>
  );
}
