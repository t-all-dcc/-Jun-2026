import React from 'react';
import { createPortal } from 'react-dom';
import { 
  BookOpen, 
  X, 
  Info, 
  Database, 
  Settings, 
  AlertTriangle 
} from 'lucide-react';

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
              <BookOpen size={22} className="text-[#b7a159]" /> SYNC GUIDE
            </h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">
              Google Sheets Setup
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Info size={18} className="text-[#b7a159]" /> 1. Authentication
            </h4>
            <p className="text-[12px] mb-3 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
              ขั้นตอนแรกคุณต้อง <b>Sign in with Google</b> ด้วยบัญชีที่มีสิทธิ์เข้าถึงหรือเป็นเจ้าของ Spreadsheet นั้นๆ ระบบจะใช้ Token ในการสร้างและแก้ไขข้อมูลแทนคุณ
            </p>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Settings size={18} className="text-[#4d87a8]" /> 2. Setup & Formatting
            </h4>
            <p className="text-[12px] mb-3">เมื่อลงชื่อเข้าใช้สำเร็จ ให้นำ Spreadsheet ID มาใส่ (ดูได้จาก URL ของหน้า Google Sheet) แล้วกดปุ่ม RUN SETUP ระบบจะทำการ:</p>
            <ul className="list-none pl-0 space-y-3">
              <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                <Database size={16} className="shrink-0 text-[#657f4d] mt-0.5" /> 
                <div>สร้างสารบบ Sheet ทั้งหมดที่ระบบต้องการ (เช่น Users, Calendar, Departments) หากไม่มีอยู่</div>
              </li>
              <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                <Settings size={16} className="shrink-0 text-[#657f4d] mt-0.5" /> 
                <div>เพิ่ม Column Header ในบรรทัดแรก พร้อมตั้งค่าแช่แข็งแถวแรก (Freeze Row) และไฮไลต์สีพื้นหลังแถวแรก</div>
              </li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <AlertTriangle size={18} className="text-[#d96245]" /> 3. Precautions
            </h4>
            <ul className="list-none pl-0 space-y-3">
              <li className="flex items-start gap-2 bg-[#932c2e]/10 p-3 rounded-xl border border-[#932c2e]/30">
                <AlertTriangle size={16} className="shrink-0 text-[#932c2e] mt-0.5" /> 
                <div className="text-[#a74353]">
                  <strong>ข้อควรระวัง:</strong> อย่าลบหรือเปลี่ยนชื่อ Column Headers ในแถวที่ 1 ไม่เช่นนั้นระบบอาจจะไม่สามารถ Map ข้อมูลได้ถูกต้อง
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>, 
    document.body
  );
}
