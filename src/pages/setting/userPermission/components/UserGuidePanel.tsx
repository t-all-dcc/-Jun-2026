import React from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, X, ShieldAlert, Eye, Lock, Key, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserGuidePanel({ isOpen, onClose }: Props) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><BookOpen size={22} className="text-[#b7a159]"/> PERMISSION GUIDE</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">Access Control Management</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <ShieldAlert size={18} className="text-[#b7a159]"/> 1. Confidential Restricted
            </h4>
            <p className="text-[12px] mb-3">ระบบอนุญาตให้คุณกำหนดความลับของข้อมูลได้ทั้งระดับ <b>โมดูลหลัก</b> และ <b>เมนูย่อย</b>:</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                  <Eye size={16} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div><strong className="text-[#4d87a8]">Public Node:</strong> ทุกคนในระบบได้รับสิทธิ์ในการเข้าถึงและมองเห็นเบื้องต้น (Viewer) ยกเว้นโดนจำกัดสิทธิ์รายบุคคล</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-3 rounded-xl border border-[#932c2e]/30">
                  <Lock size={16} className="shrink-0 text-[#932c2e] mt-0.5"/> 
                  <div><strong className="text-[#932c2e]">Restricted Area:</strong> ปิดกั้นการมองเห็นโดยสมบูรณ์ เมนูจะถูกซ่อน ต้องกำหนดสิทธิ์รายบุคคลแบบเจาะจงเท่านั้น</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Key size={18} className="text-[#d96245]"/> 2. Permission Levels
            </h4>
            <p className="text-[12px] mb-3">สิทธิ์การใช้งานแต่ละโมดูล แบ่งออกเป็น 4 ระดับ (สามารถรับสิทธิ์ทับซ้อนกันได้):</p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-[12px]">
                <li><strong className="text-[#4d87a8]">Viewer (สิทธิ์การดู):</strong> สามารถเข้าถึงหน้านั้นๆ ได้ แต่อ่านข้อมูลได้อย่างเดียว</li>
                <li><strong className="text-[#d96245]">Editor (สิทธิ์แก้ไข):</strong> สามารถสร้าง หรือแก้ไขข้อมูลและฟอร์มต่างๆ ภายในโมดูลได้</li>
                <li><strong className="text-[#212c46]">Verifier (สิทธิ์ตรวจสอบ):</strong> มีอำนาจตรวจสอบความถูกต้อง (Verify) ก่อนส่งให้อนุมัติ</li>
                <li><strong className="text-[#657f4d]">Approver (สิทธิ์อนุมัติ):</strong> อำนาจขั้นสูงสุดในการอนุมัติเอกสารและคำสั่ง (Approve)</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <RefreshCw size={18} className="text-[#3f809e]"/> 3. System Sync
            </h4>
            <p className="text-[12px]">การตั้งค่าที่ถูกอัปเดตในหน้านี้จะทำการ <b>ซิงค์กับแถบเมนู (Sidebar) หลัก</b> ของระบบ SMART HR โดยอัตโนมัติ การจำกัดสิทธิ์ส่งผลแบบ Real-time</p>
          </section>
        </div>
        
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-[0.1em]">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}
