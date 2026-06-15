import React from 'react';
import { THEME } from './theme';

interface MetricCardProps {
  label: string;
  val: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  color: string;
  desc?: string;
}

export const MetricCard = ({ label, val, icon: Icon, color, desc }: MetricCardProps) => (
  <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-[#f3f3f1] relative overflow-hidden group h-full transition-all hover:shadow-md">
    <div className="absolute -right-6 -bottom-6 opacity-[0.1] transform rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none z-0">
        <Icon size={100} style={{color: color}} />
    </div>
    <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider opacity-90 truncate">{label}</p>
            <h4 className="text-2xl font-black tracking-tight mt-0.5" style={{color: THEME.primary}}>{val}</h4>
            {desc && (
                <p className="text-[10px] text-[#7a8b95] font-bold mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: color}}></span>
                    {desc}
                </p>
            )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white backdrop-blur-md shadow-sm" 
            style={{backgroundColor: color + '15'}}>
            <Icon size={18} style={{color: color}} />
        </div>
    </div>
  </div>
);
