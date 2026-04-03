'use client';

import { useRef, ReactNode, CSSProperties } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function BentoCard({ children, className = '', style }: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current!.style.setProperty('--mouse-x', `${x}%`);
    ref.current!.style.setProperty('--mouse-y', `${y}%`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`bento-card rounded-xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border-subtle)',
        ...style,
      }}
    >
      <div className="bento-spotlight" />
      {children}
    </div>
  );
}
