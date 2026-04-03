'use client';

import { motion } from 'framer-motion';

interface SectionDividerProps {
  color?: 'gold' | 'white';
}

export function SectionDivider({ color = 'white' }: SectionDividerProps) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: 1,
          transformOrigin: 'left',
          background:
            color === 'gold'
              ? 'rgba(212,175,55,0.08)'
              : 'rgba(255,255,255,0.05)',
        }}
      />
    </div>
  );
}
