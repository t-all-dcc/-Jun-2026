import React from 'react';
import { AlertCircle, ShieldAlert, Key, ClipboardList, Trash } from 'lucide-react';

export default function DisciplinaryPunishment() {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#932c2e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#932c2e]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <AlertCircle size={22} className="text-[#932c2e]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              PUNISHMENT ACTIONS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#932c2e] to-[#b58c4f]">DESK</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              PUNISHMENT DECISION INDEXES, WRITTEN REPRIMANDS, SUSPENSIONS, AND DISMISSAL RECORDS
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto w-full my-6 min-h-[420px]">
          <div className="w-16 h-16 rounded-2xl bg-[#932c2e]/10 flex items-center justify-center border border-[#932c2e]/25 shadow-sm">
            <ShieldAlert size={30} className="text-[#932c2e]" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black text-[#212c46] uppercase tracking-wider">
              Workforce Punishment Regulatory Desk
            </h4>
            <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed font-semibold">
              ระบบศูนย์กลางติดตามระดับการลงโทษทางวินัย เริ่มจากตักเตือนด้วยวาจา ตักเตือนด้วยลายลักษณ์อักษร พักงานชั่วคราว ตลอดจนถึงการเลิกจ้างตามประมวลกฎหมาย
            </p>
          </div>

          <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 max-w-xl text-left">
            <AlertCircle className="text-[#932c2e] shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-[#212c46] font-bold leading-relaxed">
              การเลิกจ้างแรงงานด้วยความผิดฉกรรจ์ (มาตรา 119) จะบันทึกเป็นประวัติสำคัญเพื่อให้กรมคุ้มครองแรงงานรับทราบตามข้อบังคับโรงงานอย่างสมบูรณ์
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
