import React from 'react';
import { ShieldAlert, Timer, AlertTriangle } from 'lucide-react';

interface Props {
  cfgSessionDuration: number;
  cfgWarnThreshold: number;
  handleUpdateSessionConfig: (newDuration: number, newThreshold: number) => void;
}

export default function SessionConfigCard({
  cfgSessionDuration,
  cfgWarnThreshold,
  handleUpdateSessionConfig
}: Props) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-[#d96245] shrink-0 shadow-sm">
          <ShieldAlert size={24} />
        </div>
        <div className="text-left">
          <h3 className="text-[15px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
            <span>Session Security Control</span>
          </h3>
          <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1 leading-relaxed">
            Inactivity limits for data security.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#f8f9fa] p-6 rounded-2xl border border-[#eaeaec]">
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block flex items-center gap-2">
            <Timer size={14} className="text-[#4d87a8]" />
            <span>Session Duration Limit</span>
          </label>
          <select
            value={cfgSessionDuration}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              handleUpdateSessionConfig(val, cfgWarnThreshold);
            }}
            className="w-full bg-white border border-[#eaeaec] rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wide outline-none focus:border-[#b58c4f] shadow-sm text-[#212c46] cursor-pointer"
          >
            <option value="30">30 Seconds (Fast 30s Demo)</option>
            <option value="60">1 Minute</option>
            <option value="300">5 Minutes</option>
            <option value="900">15 Minutes</option>
            <option value="1800">30 Minutes</option>
            <option value="3600">1 Hour</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-600" />
            <span>Warning Threshold</span>
          </label>
          <select
            value={cfgWarnThreshold}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              handleUpdateSessionConfig(cfgSessionDuration, val);
            }}
            className="w-full bg-white border border-[#eaeaec] rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wide outline-none focus:border-[#b58c4f] shadow-sm text-[#212c46] cursor-pointer"
          >
            <option value="10">10 Seconds (Fast 10s Demo)</option>
            <option value="30">30 Seconds</option>
            <option value="60">60 Seconds</option>
            <option value="120">120 Seconds (Recommend)</option>
            <option value="300">300 Seconds</option>
          </select>
        </div>
      </div>
    </div>
  );
}
