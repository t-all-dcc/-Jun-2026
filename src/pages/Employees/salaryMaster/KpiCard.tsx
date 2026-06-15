import React from 'react';
import { LucideIcon } from '../employeeDirectory/LucideIcon';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: any;
  colorAccent: string;
  colorValue?: string;
  desc: string;
}

export const KpiCard = ({ icon, value, label, colorAccent, colorValue = '#212c46', desc }: KpiCardProps) => (
  <div className="bg-white/95 px-5 py-4 rounded-3xl border border-[#cbd5e1]/50 shadow-sm flex flex-col justify-between min-h-[105px] relative overflow-hidden group hover:border-[#b58c4f] transition-all duration-300">
    {/* Decorative background icon */}
    <div className="absolute -right-4 -bottom-6 opacity-[0.04] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
      <LucideIcon name={icon} size={110} color={colorAccent} />
    </div>
    
    <div className="relative z-10 flex justify-between items-start w-full">
      <p className="text-[10px] font-black text-[#64748b] uppercase tracking-widest leading-none drop-shadow-xs">{label}</p>
      <div 
        className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-inner transition-all group-hover:rotate-6"
        style={{
          backgroundColor: `${colorAccent}15`,
          borderColor: `${colorAccent}25`,
          color: colorAccent
        }}
      >
        <LucideIcon name={icon} size={16} />
      </div>
    </div>
    
    <div className="relative z-10 flex items-end justify-between mt-2">
      <p className="text-[26px] font-black leading-none font-mono" style={{ color: colorValue }}>
        {value}
      </p>
      <span className="text-[9px] font-black uppercase tracking-widest leading-none text-right text-[#64748b]/85">
        {desc}
      </span>
    </div>
  </div>
);
