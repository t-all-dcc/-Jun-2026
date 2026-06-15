import React from 'react';
import { THEME } from './theme';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  style?: React.CSSProperties;
  id?: string;
}

export const GlassCard = ({ children, className = '', hoverEffect = true, style = {}, id }: GlassCardProps) => (
    <div id={id} className={`rounded-2xl p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(31,42,68,0.06)] border border-white/60 ${hoverEffect ? 'hover:-translate-y-1 transition-transform duration-300' : ''} ${className}`}
        style={{ backgroundColor: THEME.glassWhite, ...style }}>
        {children}
    </div>
);
