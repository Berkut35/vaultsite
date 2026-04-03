'use client';

import { useRef, ReactNode, CSSProperties } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className = '',
  style,
  onClick,
  href,
  type = 'button',
  disabled,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const springCfg = { stiffness: 140, damping: 14, mass: 0.8 };
  const x = useSpring(0, springCfg);
  const y = useSpring(0, springCfg);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.28);
    y.set((e.clientY - cy) * 0.28);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const sharedProps = {
    className: `btn-shimmer ${className}`.trim(),
    style,
  };

  return (
    <div
      ref={ref}
      style={{ display: 'inline-block' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div style={{ x, y }}>
        {href ? (
          <a href={href} {...sharedProps}>
            {children}
          </a>
        ) : (
          <button type={type} onClick={onClick} disabled={disabled} {...sharedProps}>
            {children}
          </button>
        )}
      </motion.div>
    </div>
  );
}
