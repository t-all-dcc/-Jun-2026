import React from 'react';
import { Eye, Download, ShieldCheck, Mail, Calendar, Banknote } from 'lucide-react';

export default function MyPayslips() {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#3f809e]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Banknote size={22} className="text-[#3f809e]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              MY PAYSLIPS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">STAFF</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              SECURE INDIVIDUAL REMUNERATION ARCHIVE AND DETAILED MONTHLY HISTORIES
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto w-full my-6 min-h-[420px]">
          <div className="w-16 h-16 rounded-2xl bg-[#3f809e]/10 flex items-center justify-center border border-[#3f809e]/25 shadow-sm">
            <Banknote size={30} className="text-[#3f809e]" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black text-[#212c46] uppercase tracking-wider">
              Secure Staff Payslip Vault
            </h4>
            <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed font-semibold">
              ส่วนบริการดูข้อมูลสลิปเงินเดือนตนเองย้อนหลัง และดาวน์โหลดใบสำคัญจ่ายเพื่อนำไปใช้ทำธุรกรรมส่วนตัวอย่างสอดคล้องความมั่นคงลับสูงสุด
            </p>
          </div>

          {/* Stepper visualizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl font-mono text-[10.5px]">
            <div className="p-4 bg-slate-50 border border-[#eaeaec] rounded-xl text-left flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-slate-400 block mb-1">MAY 2026 PAYSLIP</span>
                <p className="font-black text-[#212c46] uppercase">฿28,540.00 Net</p>
                <p className="text-[10px] text-slate-400 mt-1">Dispatched May 28, 2026</p>
              </div>
              <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <Download size={14} className="text-[#212c46]" />
              </button>
            </div>
            <div className="p-4 bg-slate-50 border border-[#eaeaec] rounded-xl text-left flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-slate-400 block mb-1">APRIL 2026 PAYSLIP</span>
                <p className="font-black text-[#212c46] uppercase">฿27,850.00 Net</p>
                <p className="text-[10px] text-slate-400 mt-1">Dispatched Apr 28, 2026</p>
              </div>
              <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <Download size={14} className="text-[#212c46]" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 max-w-xl text-left">
            <ShieldCheck className="text-[#657f4d] shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
              การเข้าถึงใบสำคัญรับเงินเดือนพจนานุกรมความลับระดับสูงนี้ ถูกควบคุมด้วยคุกกี้ยืนยันตัวตน เพื่อป้องกันผู้ใช้ทั่วไปลอบดึงข้อมูลโดยเด็ดขาด
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
