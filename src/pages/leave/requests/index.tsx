import React from 'react';
import { Calendar, ShieldAlert, CheckSquare, ListTodo, ClipboardList, Clock } from 'lucide-react';

export default function LeaveRequests() {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#b58c4f] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#b58c4f]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <ClipboardList size={22} className="text-[#b58c4f]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              LEAVE REQUESTS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#3f809e]">APPROVAL</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              PENDING EMPLOYEE LEAVE FORMS, MANAGER AUTHORIZATIONS, AND COMPLIANCE SIGN-OFFS
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto w-full my-6 min-h-[420px]">
          <div className="w-20 h-20 rounded-2xl bg-[#b58c4f]/10 flex items-center justify-center border border-[#b58c4f]/25 shadow-sm">
            <ListTodo size={38} className="text-[#b58c4f] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black text-[#212c46] uppercase tracking-wider">
              Centralized Leave Request Dispatch Board
            </h4>
            <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed font-semibold">
              ตารางรวบรวมคำขอลาป่วย ลากิจ ลาพักร้อน ของพนักงานทุกโรงงานในสังกัด พร้อมระบบอนุมัติเอกสารแนบใบรับรองแพทย์สำหรับการพ้นภาระอย่างสมบูรณ์
            </p>
          </div>

          <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 max-w-xl text-left">
            <ShieldAlert className="text-[#a94228] shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
              การอนุมัติใบลาใดๆ จะปรับแต่งหักยอดโควตาคงเหลือคงบัญชีพนักงานทันที และแจ้งผลเชื่อมระบบบัญชีกะเงินเดือนเพื่อความเที่ยงตรงยอดค่าจ้าง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
