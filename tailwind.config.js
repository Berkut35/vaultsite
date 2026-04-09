/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'accent-purple': '#A855F7',
        'accent-gold':   '#D4AF37',
        'text-primary':  '#F0F0F0',
        'text-secondary':'#888888',
        'text-muted':    '#444444',
        'bg-primary':    '#050505',
        'bg-surface':    '#0a0a0a',
        'bg-elevated':   '#111111',
        /* Legacy aliases — old components still compile */
        'vault-bg':          '#050505',
        'vault-surface':     '#0a0a0a',
        'vault-card':        '#111111',
        'vault-card-hover':  '#161616',
        'vault-border':      'rgba(255,255,255,0.06)',
        'vault-text':        '#F0F0F0',
        'vault-muted':       '#888888',
        'vault-accent':      '#A855F7',
        'vault-accent-dim':  'rgba(168,85,247,0.12)',
      },
      fontFamily: {
        sans:  ['"DM Sans"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
        /* Legacy aliases */
        syne:  ['"DM Sans"', 'sans-serif'],
        inter: ['"DM Sans"', 'sans-serif'],
        lora:  ['"DM Serif Display"', 'serif'],
        mono:  ['ui-monospace', 'Menlo', 'monospace'],
      },
      maxWidth: {
        '6xl': '72rem',
      },
      borderRadius: {
        'card':  '14px',
        'modal': '18px',
      },
      boxShadow: {
        'vault':    '0 80px 160px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
        'vault-sm': '0 8px 32px rgba(0,0,0,0.4)',
        'deep':     '0 40px 80px rgba(0,0,0,0.6)',
        'inset-top': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(1deg)' },
          '50%':       { transform: 'translateY(-8px) rotate(1deg)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float':   'float 4s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
      },
      backdropBlur: {
        'vault': '20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
