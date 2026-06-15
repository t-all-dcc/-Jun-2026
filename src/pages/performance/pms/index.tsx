import React from 'react';
import { Network, ShieldCheck, BarChart4, Cpu } from 'lucide-react';

export default function PerformancePms() {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#657f4d] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#657f4d]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <BarChart4 size={22} className="text-[#657f4d]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              PMS SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#657f4d] to-[#b58c4f]">DESK</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              INDIVIDUAL PERFORMANCE MANAGEMENT SYSTEM, HISTORICAL RECORDS, AND ROADMAPS
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto w-full my-6 min-h-[420px]">
          <div className="w-20 h-20 rounded-2xl bg-[#657f4d]/10 flex items-center justify-center border border-[#657f4d]/25 shadow-sm">
            <BarChart4 size={38} className="text-[#657f4d] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black text-[#212c46] uppercase tracking-wider">
              Workforce PMS Score & Competency Analytics
            </h4>
            <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed font-semibold">
              ระบบวิเคราะห์ข้อมูลพฤติกรรมการทำงาน ทัศนคติ และเกรดพนักงาน (PMS Score Card Grading A, B, C, D) รายบุคคลสะสมตลอดอายุงานสังกัดแวดวงชัยศรี
            </p>
          </div>

          <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 max-w-xl text-left">
            <ShieldCheck className="text-[#657f4d] shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
              การเก็บชุดข้อมูลและเปรียบเทียบผลพนักงาน ช่วยหัวหน้าส่วนประดับปรุงพฤติกรรมสายกกระบวนการผลิต และสกัดความบกพร่องสะสมได้ทันถ่วงที
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
