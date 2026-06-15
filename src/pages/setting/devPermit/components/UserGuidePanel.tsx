import React from 'react';
import { createPortal } from 'react-dom';
import { Settings2, X, LayoutGrid, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

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
        className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg">
              <Settings2 size={22} className="text-[#b7a159]" /> DEV GUIDE
            </h3>
            <p className="text-[10px] font-bold text-[#4d5a44] uppercase tracking-widest mt-1 drop-shadow-sm">
              System Visibility Control
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2">
              <LayoutGrid size={18} className="text-[#b7a159]" /> 1. Global Menu Sync
            </h4>
            <div className="space-y-3 font-medium bg-[#f8f9fa] p-4 rounded-xl border border-[#eaeaec] shadow-sm">
              <p>ระบบ Dev Permit (BETA) ออกแบบมาเพื่อให้นักพัฒนา (Developer) หรือ Super Admin สามารถควบคุม <b>การมองเห็น (Visibility)</b> ของเมนูทั้งหมดในระบบส่วนกลาง</p>
              <div className="bg-[#4d87a8]/10 p-4 rounded-xl border border-[#4d87a8]/20 text-[#414757]">
                การเปิด/ปิดเมนู in the config on this page will affect the **Sidebar Menu** and **User Permission Module** of everyone globally.
              </div>
            </div>
          </section>
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2">
              <Lock size={18} className="text-[#932c2e]" /> 2. Main vs Sub-Modules
            </h4>
            <ul className="list-none pl-0 space-y-3 bg-[#f8f9fa] p-4 rounded-xl border border-[#eaeaec] shadow-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-[#657f4d] mt-0.5 shrink-0" />
                <div>หากทำการ <b>ปิด</b> เมนูหลัก (Main Module) เมนูย่อยทั้งหมดภายใต้เมนูนั้นจะถูกซ่อนจาก Sidebar โดยอัตโนมัติ ไม่ว่าสิทธิ์รายบุคคลจะเป็นอย่างไรก็ตาม</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-[#657f4d] mt-0.5 shrink-0" />
                <div>คุณสามารถเลือกปิดเฉพาะ <b>เมนูย่อย (Sub-Modules)</b> บางฟังก์ชันที่ไม่เปิดใช้งานได้ โดยคลิกที่ลูกศร Dropdown ท้ายชื่อเมนูหลักเพื่อกางเมนูย่อยออกมา</div>
              </li>
            </ul>
          </section>
          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2">
              <AlertTriangle size={18} className="text-[#d96245]" /> 3. System Warning
            </h4>
            <p className="text-[12px] bg-[#d96245]/10 text-[#a74353] p-4 rounded-xl border border-[#d96245]/30 font-medium">
              อย่าลืมกดปุ่ม <strong className="text-[#d96245]">SAVE CONFIGURATION</strong> ที่มุมขวาบนหน้าจอทุกครั้งหลังจากปรับเปลี่ยนค่า Toggle เพื่อให้ระบบอัปเดตสถานะและเขียนทับลงใน Master Database
            </p>
          </section>
        </div>
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button 
            onClick={onClose} 
            className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-[0.1em]"
          >
            รับทราบ (Got it)
          </button>
        </div>
      </div>
    </>, 
    document.body
  );
}
