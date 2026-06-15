import React from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, X, Activity, Filter, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserGuidePanel({ isOpen, onClose }: Props) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div 
        className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose} 
      />
      <div 
        className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-4 border-[#b7a159] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="bg-[#212c46] px-8 py-5 flex justify-between items-center text-white shrink-0 border-b border-[#414757] shadow-sm relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shadow-inner border border-white/20">
              <ShieldAlert size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm text-white">
                AUDIT GUIDE
              </h3>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1 drop-shadow-sm">
                คู่มือการตรวจสอบบันทึกการใช้งาน
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-[#d7d7d7]/50 text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2">
              <Activity size={18} className="text-[#b7a159]" /> 1. Purpose of Access Logs
            </h4>
            <div className="space-y-3 text-[12px] font-medium leading-relaxed bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
              <p className="mb-2">หน้าต่าง Access Logs ใช้สำหรับการตรวจสอบความเคลื่อนไหวและประวัติการเข้าถึงระบบทั้งหมด เพื่อให้สอดคล้องกับมาตรฐานความปลอดภัย (Security Audit)</p>
              <ul className="list-disc pl-5 space-y-1 text-[#414757]">
                <li>เก็บบันทึกการเข้าสู่ระบบ (Login) ทั้งสำเร็จและล้มเหลว</li>
                <li>ติดตามการแก้ไขข้อมูลสำคัญ (Create, Update, Delete)</li>
                <li>บันทึกหมายเลข IP และอุปกรณ์ที่ใช้เข้าถึง</li>
              </ul>
            </div>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2">
              <Filter size={18} className="text-[#4d87a8]" /> 2. Status Indicators
            </h4>
            <div className="space-y-3 text-[12px] leading-relaxed font-medium bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md bg-[#657f4d]/10 text-[#657f4d] border border-[#657f4d]/20 font-black text-[10px]">SUCCESS</span>
                <p className="text-[#414757]">การทำงานเสร็จสมบูรณ์ ไม่มีข้อผิดพลาด</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md bg-[#d96245]/10 text-[#d96245] border border-[#d96245]/20 font-black text-[10px]">WARNING</span>
                <p className="text-[#414757]">การเข้าถึงที่ควรจับตามอง เช่น สิทธิ์ไม่เพียงพอ</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md bg-[#932c2e]/10 text-[#932c2e] border border-[#932c2e]/20 font-black text-[10px]">FAILED</span>
                <p className="text-[#414757]">การทำงานล้มเหลว หรือการพยายามเจาะระบบ</p>
              </div>
            </div>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2">
              <Download size={18} className="text-[#657f4d]" /> 3. Data Export
            </h4>
            <p className="text-[12px] leading-relaxed font-medium">
              ผู้ดูแลระบบสามารถกดปุ่ม <b className="text-[#212c46]">EXPORT LOGS</b> เพื่อดาวน์โหลดข้อมูลเป็นไฟล์ CSV สำหรับนำไปวิเคราะห์ต่อในระบบภายนอก หรือเก็บเป็นหลักฐานรายงาน (Audit Report)
            </p>
          </section>
        </div>
        
        <div className="px-8 py-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[11px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-widest border border-[#212c46]"
          >
            รับทราบ (Got it)
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
