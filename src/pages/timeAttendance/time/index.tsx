import React from 'react';
import { Clock, ShieldCheck, CheckSquare, Calendar, Users, AlertTriangle } from 'lucide-react';

export default function TimeAttendancePanel() {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#657f4d] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#657f4d]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Clock size={22} className="text-[#657f4d]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              TIME & ATTENDANCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#657f4d] to-[#b58c4f]">MONITOR</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              PUNCH CARD SYNCHRONIZATIONS, LIVE CHECK-INS, AND LATE-COMING REGISTRY
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Late punch margin</span>
            <p className="text-2xl font-mono font-black text-[#212c46] mt-2">15 Minutes</p>
            <span className="text-[9px] text-[#657f4d] font-bold mt-1 uppercase">Standard Grace Period</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present Ratio Today</span>
            <p className="text-2xl font-black text-[#b58c4f] mt-2">97.8% Onsite</p>
            <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Total 434 active cards</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fingerprint terminals</span>
            <p className="text-2xl font-black text-[#3f809e] mt-2">12 Active Nodes</p>
            <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Auto Sync: online</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto w-full my-4 min-h-[350px]">
          <div className="w-16 h-16 rounded-2xl bg-[#657f4d]/10 flex items-center justify-center border border-[#657f4d]/25 shadow-sm">
            <Clock size={30} className="text-[#657f4d] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black text-[#212c46] uppercase tracking-wider">
              Time Attendance Database Portal
            </h4>
            <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed font-semibold">
              ระบบศูนย์กลางตรวจสอบเวลาการสแกนนิ้วสแกนใบหน้าของทางทีมงานพนักงาน ตรวจเช็กจำนวนคนสาย ขาด ลา มาทำงานแบบเรียลไทม์ควบคู่ Google Sheets
            </p>
          </div>

          <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 max-w-xl text-left">
            <ShieldCheck className="text-[#657f4d] shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
              การเชื่อมเข้าแบบ LockService ตัวลงคิวป้องข้ามชนข้อมูล ช่วยประกันว่าข้อมูลเวลาสแกนจะไม่มีการคลุมทับซ้อนกันแม้คนเปลี่ยนกะสแกนพร้อมกันทั้งหมด
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
