import React from 'react';
import { LucideIcon } from './LucideIcon';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: string;
  colorAccent: string;
  colorValue: string;
  desc: string;
}

export const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: KpiCardProps) => (
  <div className="bg-white/90 px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[120px] flex flex-col justify-between animate-fadeIn">
    {/* Decorative background icon */}
    <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
      <LucideIcon name={icon} size={110} color={colorAccent} />
    </div>
    
    <div className="relative z-10 flex justify-between items-start w-full">
      <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
      <div 
        className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6"
        style={{
          backgroundColor: `${colorAccent}15`,
          borderColor: `${colorAccent}25`,
          color: colorAccent
        }}
      >
        <LucideIcon name={icon} size={20} />
      </div>
    </div>
    
    <div className="relative z-10 mt-2 flex items-end justify-between">
      <p className="text-[28px] font-black leading-none text-[#212c46]" style={{ color: colorValue }}>
        {value}
      </p>
      <span className="text-[11px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {desc}
      </span>
    </div>
  </div>
);
