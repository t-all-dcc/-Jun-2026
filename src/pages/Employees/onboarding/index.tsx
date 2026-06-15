import React from 'react';
import { Rocket, ShieldAlert, CheckSquare, ClipboardList, Flame, UserPlus } from 'lucide-react';

export default function Onboarding() {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#3f809e]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Rocket size={22} className="text-[#3f809e]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              ONBOARDING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">GATEWAY</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              NEW HIRE PROVISIONS, TRAINING PROGRESSION, AND FIRST-DAY CHECKLIST NODES
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto w-full my-6 min-h-[420px]">
          <div className="w-16 h-16 rounded-2xl bg-[#3f809e]/10 flex items-center justify-center border border-[#3f809e]/25 shadow-sm">
            <UserPlus size={30} className="text-[#3f809e]" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black text-[#212c46] uppercase tracking-wider">
              Workforce Onboarding & Compliance Integration
            </h4>
            <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed font-semibold">
              ระบบต้อนรับพนักงานใหม่ ควบคุมขั้นตอนการตรวจสอบและการจัดส่งเอกสารสัญญาจ้าง แฟ้มประวัติ และการเซ็นอนุมัติ PDPA กฎระเบียบโรงงานของพนักงานใหม่
            </p>
          </div>

          {/* Stepper visualizer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl font-mono text-[10.5px]">
            <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl text-left">
              <span className="text-[9px] font-bold text-slate-400 block mb-1">STAGE 01</span>
              <p className="font-black text-[#212c46] uppercase">Contract & Sign</p>
              <p className="text-[10px] text-slate-400 mt-1">ประสานสัญญา & อนุมัติสิทธิ์เข้าสู่ระบบงานหลัก</p>
            </div>
            <div className="p-4 bg-white border border-[#b7a159]/40 rounded-xl text-left relative">
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b58c4f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b58c4f]"></span>
              </span>
              <span className="text-[9px] font-bold text-[#b58c4f] block mb-1">STAGE 02</span>
              <p className="font-black text-[#212c46] uppercase">E-Learning & PDPA</p>
              <p className="text-[10px] text-slate-400 mt-1">การอบรมจรรยาบรรณ และการรักษาความปลอดภัยพนักงาน</p>
            </div>
            <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl text-left">
              <span className="text-[9px] font-bold text-slate-400 block mb-1">STAGE 03</span>
              <p className="font-black text-[#212c46] uppercase">Provision & Placement</p>
              <p className="text-[10px] text-slate-400 mt-1">ได้รับเครื่องมือประจำตำแหน่งและเริ่มประจำ ณ แผนก</p>
            </div>
          </div>

          <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 max-w-xl text-left">
            <ShieldAlert className="text-[#a94228] shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
              สวิดเจ็ตต้อนรับขู่ปฐมนิเทศนี้ ดำเนินการอิงตามเกณฑ์กรมแรงงานและโครงสร้างความหลากหลายทางวัฒนธรรมโรงงาน ชัยศรีอะโกรอินดัสเทรียล
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
