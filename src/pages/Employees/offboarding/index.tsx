import React from 'react';
import { LogOut, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function Offboarding() {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#932c2e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#932c2e]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <LogOut size={22} className="text-[#932c2e]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              OFFBOARDING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#932c2e] to-[#b58c4f]">WORKFLOWS</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              RESIGNATION PROCEDURES, DE-PROVISIONING PROTOCOLS, AND EXIT INTERVIEWS
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto w-full my-6 min-h-[420px]">
          <div className="w-16 h-16 rounded-2xl bg-[#932c2e]/10 flex items-center justify-center border border-[#932c2e]/25 shadow-sm">
            <LogOut size={30} className="text-[#932c2e]" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black text-[#212c46] uppercase tracking-wider">
              Workforce Offboarding & Asset Retrieval clearance
            </h4>
            <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed font-semibold">
              ระบบอำนวยความสะดวกการลาออก การคืนเครื่องมือการทำงาน เอกสารรับรองผ่านการงาน และการเพิกถอนสิทธิ์เข้าถึงระเบียนฐานข้อมูลชั้นความลับสูงเพื่อป้องกันข้อมูลรั่วไหล
            </p>
          </div>

          {/* Checklist visualizer */}
          <div className="w-full max-w-xl bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl p-6 font-mono text-[11px] text-left space-y-3">
            <p className="font-black text-[#212c46] uppercase border-b-2 border-slate-200 pb-2 mb-3">Exit Procedures & Clearance Steps</p>
            <div className="flex items-center gap-3 text-slate-400">
              <CheckCircle2 size={16} className="text-[#657f4d]" />
              <span>[DONE] Submit Resignation Notice (30 Days prior)</span>
            </div>
            <div className="flex items-center gap-3 text-[#212c46]">
              <div className="w-4 h-4 border-2 border-[#b58c4f] rounded-full animate-pulse"></div>
              <span className="font-bold">Returning Company Assets & Device Clearance</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-4 h-4 border border-slate-300 rounded-full"></div>
              <span>Revocation of System Access Node Controls & Active Sessions</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-4 h-4 border border-slate-300 rounded-full"></div>
              <span>Exit Interview (HR Feedbacks Preservation)</span>
            </div>
          </div>

          <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 max-w-xl text-left">
            <ShieldAlert className="text-[#932c2e] shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-[#212c46] font-bold leading-relaxed">
              การถอดระดมประวัติพนักงานออกจากการประจำการ Active ไปยัง Resigned Mode จะตัดสิทธิ์การจ่ายเงินงวดถัดไป และรายงานผลต่อฝ่ายระบบการทำงานความปลอดภัยพนักงานทันที
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
