import React from 'react';
import { Heart, ShieldCheck, Sparkles, UserCheck, Star } from 'lucide-react';

export default function LaborEngagement() {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#b58c4f] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#b58c4f]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Heart size={22} className="text-[#b58c4f]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              ENGAGEMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#3f809e]">METRICS</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              STAFF MORALE ASSESSMENTS, RECOGNITION REGISTERS, AND RETENTION ANALYSIS
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto w-full my-6 min-h-[400px]">
          <div className="w-20 h-20 rounded-2xl bg-[#b58c4f]/10 flex items-center justify-center border border-[#b58c4f]/25 shadow-sm">
            <Sparkles size={38} className="text-[#b58c4f] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black text-[#212c46] uppercase tracking-wider">
              Workforce Engagement & Morale Sync
            </h4>
            <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed font-semibold">
              วิเคราะห์ผลการประเมินความผูกพันต่อองค์กร (Engagement Surveys) การประกาศเกียรติคุณพนักงานดีเด่นประจำเดือนในแต่ละเครือโรงงาน
            </p>
          </div>

          {/* Engagement Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl font-mono text-[11px]">
            <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl text-center">
              <span className="text-[9px] font-bold text-slate-400 block mb-1">E-NPS MORALE</span>
              <p className="text-xl font-black text-[#212c46]">+76 Score</p>
              <p className="text-[9.5px] text-slate-400 mt-1 uppercase">High Group Cohesion</p>
            </div>
            <div className="p-4 bg-white border border-[#b7a159]/40 rounded-xl text-center shadow-sm">
              <span className="text-[9px] font-bold text-[#b58c4f] block mb-1">RETENTION INDEX</span>
              <p className="text-xl font-black text-[#b58c4f]">94.2%</p>
              <p className="text-[9.5px] text-slate-400 mt-1 uppercase">Stable Workforce Flow</p>
            </div>
            <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl text-center">
              <span className="text-[9px] font-bold text-slate-400 block mb-1">RECOGNITIONS</span>
              <p className="text-xl font-black text-[#212c46]">18 Awards</p>
              <p className="text-[9.5px] text-slate-400 mt-1 uppercase">Issued in June 2026</p>
            </div>
          </div>

          <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 max-w-xl text-left">
            <ShieldCheck className="text-[#657f4d] shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
              การทบทวนผลและรักษาดุลยภาพความสุขทางใจพนักงาน ร่วมสร้างนิสัยด้านบวก ยืดอายุการทำงานร่วมกับ ชัยศรีอะโกรอินดัสเทรียล อย่างยืนยง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
