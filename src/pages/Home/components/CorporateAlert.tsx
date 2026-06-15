import React from 'react';
import { AlertCircle, ShieldAlert, ClipboardList, AlertTriangle } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const CorporateAlert = () => {
    const alerts = [
      { title: 'รูปถ่ายทําเนียบตกหล่น', desc: 'พนักงานใหม่ 3 รายในสัปดาห์นี้ยังไม่ได้อัปโหลดภาพถ่ายประทับหลักสารบัญทำเนียบ', icon: ClipboardList, color: '#932c2e', bg: '#932c2e26' },
      { title: 'บันทึกประเมินทดลองงานคงค้าง', desc: 'พนักงานครบหลักเกณฑ์ประเมินทดลองงาน 2 ราย ค้างการตรวจสอบเอกสารพยานจากผู้จัดการสายงาน', icon: AlertTriangle, color: '#3f809e', bg: '#3f809e26' },
    ];

    return (
      <GlassCard id="corporate-alerts" className="bg-white border-[#f3f3f1] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.02] pointer-events-none transform -rotate-12 z-0">
          <ShieldAlert size={220} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10 font-sans">
          <AlertCircle size={20} className="text-[#932c2e]" />
          <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
            CORPORATE<br/>ALERT
          </h2>
        </div>
        <div className="space-y-4 flex-1 relative z-10">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 border border-transparent rounded-xl p-4 transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: alert.bg }}>
              <alert.icon size={16} className={`shrink-0 mt-0.5`} style={{ color: alert.color }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[13px] mb-1 leading-tight" style={{ color: alert.color }}>{alert.title}</h3>
                <p className="text-[10px] font-medium leading-relaxed font-sans" style={{ color: alert.color, opacity: 0.85 }}>{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    );
};
