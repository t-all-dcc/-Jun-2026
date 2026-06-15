import React from 'react';
import { ShieldAlert, Heart, MessageSquare, ClipboardList, Send, FileText } from 'lucide-react';

export default function LaborUnion() {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#a94228] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#a94228]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Heart size={22} className="text-[#a94228]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              UNION & GRIEVANCES <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a94228] to-[#b58c4f]">DESK</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              LABOR UNION DISCUSSIONS, GRIEVANCE LODGING, AND MEDIATION SETTLEMENTS
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Main Card */}
          <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col justify-between min-h-[400px]">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#a94228]/10 flex items-center justify-center border border-[#a94228]/25 shadow-sm">
                <ShieldAlert size={28} className="text-[#a94228]" />
              </div>
              <div>
                <h4 className="text-lg font-black text-[#212c46] uppercase tracking-wider">
                  Labour Relations & Grievances Control Node
                </h4>
                <p className="text-[12px] text-slate-500 leading-relaxed font-semibold mt-1">
                  ระบบส่งข้อร้องเรียน ทัศนคติพนักงาน และการเจรจาไกล่เกลี่ยข้อพิพาทร่วมพนักงานและสหภาพแรงงาน ชัยศรีอะโกรอินดัสเทรียล
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 mt-4">
              <ShieldAlert className="text-[#a94228] shrink-0 mt-0.5" size={18} />
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                การไกล่เกลี่ยจะอ้างอิงตาม มาตรา พ.ร.บ. แรงงานสัมพันธ์ เพื่อสร้างข้อตกลงสภาพการจ้างที่เสถียรและราบรื่น
              </p>
            </div>
          </div>

          {/* Form / Quick list card */}
          <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col">
            <h5 className="font-black text-[#212c46] uppercase text-xs tracking-widest mb-4 border-b border-slate-100 pb-2">Active Dispute & Petitions Box</h5>
            <div className="space-y-3 font-mono text-[11px] flex-1">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] bg-[#a94228] text-white px-1.5 py-0.5 rounded font-black">PENDING</span>
                <p className="font-bold text-[#212c46] mt-2 uppercase">[G-402] Ventilation audit Request inside Sector C</p>
                <p className="text-[10px] text-slate-400 mt-1 font-sans font-bold">ยื่นประสานงานการตรวจสอบระบบระบายอากาศโดยพนักงานกะดึก</p>
              </div>
              <div className="p-3 bg-white border border-slate-100 rounded-xl opacity-75">
                <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">SETTLED</span>
                <p className="font-bold text-slate-500 mt-2 uppercase">[G-389] Overtime Allowance recalculation Dispute</p>
                <p className="text-[10px] text-slate-400 mt-1 font-sans font-bold">ตรวจสอบยอดรวมพนักงานกะบ่ายและข้อหาตกลงเสร็จสิ้น</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
