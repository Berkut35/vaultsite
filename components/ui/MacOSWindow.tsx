import { CSSProperties } from 'react';

interface MacOSWindowProps {
  className?: string;
  style?: CSSProperties;
  title?: string;
  compact?: boolean;
}

export function MacOSWindow({
  className = '',
  style,
  title = 'vault — research.pdf',
  compact = false,
}: MacOSWindowProps) {
  const contentH = compact ? 280 : 380;

  return (
    <div
      className={className}
      style={{
        background: '#0c0c0c',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 80px 160px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
        ...style,
      }}
    >
      {/* ── Title bar ── */}
      <div
        style={{
          height: 36,
          background: '#05080E',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
            fontFamily: '"Lora", serif',
            letterSpacing: '0.01em',
            fontWeight: 600
          }}
        >
          {title}
        </div>
        <div style={{ width: 50 }} />
      </div>

      {/* ── Content panes ── */}
      <div style={{ display: 'flex', height: contentH }}>
        {/* Icon bar */}
        <div
          style={{
            width: 44,
            background: '#090909',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            padding: '14px 7px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            alignItems: 'center',
          }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background:
                  i === 0
                    ? 'rgba(168,85,247,0.18)'
                    : 'rgba(255,255,255,0.04)',
                border:
                  i === 0
                    ? '1px solid rgba(168,85,247,0.22)'
                    : '1px solid transparent',
              }}
            />
          ))}
        </div>

        {/* Document list */}
        <div
          style={{
            width: compact ? 120 : 155,
            background: '#0d0d0d',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <div
            style={{
              fontSize: 8.5,
              color: 'rgba(255,255,255,0.25)',
              padding: '0 5px',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            Library
          </div>
          {[
            { name: 'research.pdf', active: true },
            { name: 'notes-ch3.md', active: false },
            { name: 'bibliography.pdf', active: false },
            { name: 'methodology.docx', active: false },
            { name: 'lit-review.pdf', active: false },
            { name: 'data-2024.csv', active: false },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: '5px 8px',
                borderRadius: 5,
                background: item.active
                  ? 'rgba(168,85,247,0.10)'
                  : 'transparent',
                border: item.active
                  ? '1px solid rgba(168,85,247,0.16)'
                  : '1px solid transparent',
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  color: item.active
                    ? 'rgba(255,255,255,0.82)'
                    : 'rgba(255,255,255,0.30)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>

        {/* PDF reader area */}
        <div
          style={{
            flex: 1,
            background: '#101010',
            padding: compact ? '16px 18px' : '22px 26px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Title placeholder */}
          <div
            style={{
              height: 9,
              width: '52%',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 3,
              marginBottom: 10,
            }}
          />
          <div
            style={{
              height: 6,
              width: '33%',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 3,
              marginBottom: 18,
            }}
          />

          {/* Text line placeholders */}
          {[100, 97, 91, 100, 94, 78, 100, 96, 85, 100, 62, 100, 88].map(
            (w, i) => (
              <div
                key={i}
                style={{
                  height: 4.5,
                  width: `${w}%`,
                  background:
                    i === 4
                      ? 'rgba(212,175,55,0.30)'
                      : i === 8
                      ? 'rgba(168,85,247,0.20)'
                      : 'rgba(255,255,255,0.07)',
                  borderRadius: 2,
                  marginBottom: compact ? 5 : 6,
                  boxShadow:
                    i === 4
                      ? '0 0 0 3px rgba(212,175,55,0.06)'
                      : i === 8
                      ? '0 0 0 3px rgba(168,85,247,0.05)'
                      : 'none',
                }}
              />
            )
          )}

          {/* Floating note card */}
          <div
            style={{
              position: 'absolute',
              bottom: compact ? 14 : 20,
              right: compact ? 12 : 18,
              width: compact ? 100 : 125,
              background: 'rgba(168,85,247,0.06)',
              border: '1px solid rgba(168,85,247,0.22)',
              borderRadius: 8,
              padding: compact ? '8px 10px' : '10px 12px',
            }}
          >
            <div
              style={{
                fontSize: 7.5,
                color: 'rgba(168,85,247,0.75)',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              Note
            </div>
            {[80, 95, 60, 75].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 3.5,
                  width: `${w}%`,
                  background: 'rgba(255,255,255,0.09)',
                  borderRadius: 2,
                  marginBottom: 4,
                }}
              />
            ))}
          </div>
        </div>

        {/* Annotations panel */}
        {!compact && (
          <div
            style={{
              width: 130,
              background: '#090909',
              borderLeft: '1px solid rgba(255,255,255,0.05)',
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 8.5,
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 4,
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              Annotations
            </div>
            {[
              { color: 'rgba(212,175,55,0.65)', label: 'Key finding' },
              { color: 'rgba(168,85,247,0.65)', label: 'Theory ref' },
              { color: 'rgba(59,130,246,0.65)', label: 'Methodology' },
              { color: 'rgba(52,211,153,0.55)', label: 'Evidence' },
            ].map((ann, i) => (
              <div
                key={i}
                style={{
                  borderLeft: `2px solid ${ann.color}`,
                  paddingLeft: 8,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.40)',
                    marginBottom: 4,
                    fontFamily: '"DM Sans", sans-serif',
                  }}
                >
                  {ann.label}
                </div>
                {[85, 65].map((w, j) => (
                  <div
                    key={j}
                    style={{
                      height: 3.5,
                      width: `${w}%`,
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: 2,
                      marginBottom: 3,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
