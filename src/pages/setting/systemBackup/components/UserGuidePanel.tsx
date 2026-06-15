import React from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, X, Database, CheckCircle2, Check, Trash2 } from 'lucide-react';

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
        className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-[#f8f9fa] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-4 border-[#b7a159] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-[16px] xl:text-lg">
              <BookOpen size={22} className="text-[#b58c4f]" /> USER GUIDE
            </h3>
            <p className="text-[10px] xl:text-[11px] font-bold text-white/70 uppercase tracking-widest mt-1.5">
              SYSTEM BACKUPS HUB
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 xl:p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-[#f8f9fa] text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
              <Database size={18} className="text-[#b58c4f]" /> 1. SYSTEM BACKUPS LOGGING
            </h4>
            <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-4 shadow-sm">
              <p className="text-[12px] text-[#414757] leading-relaxed">
                ระบบจัดการบันทึกประวัติการสำรองรายละเอียดคลังข้อมูล ใบอนุญาต และการตั้งค่าของคลังเอกสารใบรับรองฮาลาลในระบบ SMART HR:
              </p>
              <ul className="list-disc pl-5 space-y-3 font-medium text-[12px] text-slate-600">
                <li>
                  <strong className="text-[#212c46]">Full Backup:</strong> การเข้ารหัสและเก็บข้อมูลสำคัญทั้งหมดของโปรแกรมลงบนเซิร์ฟเวอร์คลาวด์สำรอง
                </li>
                <li>
                  <strong className="text-[#212c46]">Incremental:</strong> การเซฟบันทึกเฉพาะจุดที่มีการแก้ไขอัปเดตใหม่ ช่วยประหยัดเนื้อที่คลังข้อมูล
                </li>
                <li>
                  <strong className="text-[#212c46]">Manual Backup:</strong> ผู้กำกับระบบสามารถดำเนินการและระบุรายการสำรองเองได้ตลอดเวลาตามต้องการ
                </li>
              </ul>
            </div>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
              <CheckCircle2 size={18} className="text-emerald-600" /> 2. RECOVERY & ACTIONS
            </h4>
            <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-4 shadow-sm text-[12px]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 shrink-0">
                  <Check size={16} />
                </div>
                <div className="text-slate-600 font-medium leading-relaxed">
                  <strong className="text-[#212c46]">Success State:</strong> ข้อมูลระบุขนาดเนื้อที่ไฟล์ (เช่น 4.2 GB) และระยะเวลานาทีที่ประมวลผลเสร็จสิ้น ปุ่มทดลองดาวน์โหลด (ไอคอนเก็บไฟล์) จะเปิดใช้งานอย่างสมบูรณ์
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 rounded-xl border border-rose-100 text-rose-700 shrink-0">
                  <X size={16} />
                </div>
                <div className="text-slate-600 font-medium leading-relaxed">
                  <strong className="text-[#212c46]">Failed State:</strong> ชี้แจงรายละเอียดสาเหตุความผิดพลาดให้ผู้ดูล็อก เช่น Connection timeout หรือ คีย์เซิร์ฟเวอร์หมดอายุ ปุ่มดาวน์โหลดจะถูกล็อคป้องกันความเสียหายทันที (Disabled)
                </div>
              </div>
            </div>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
              <Trash2 size={18} className="text-rose-600" /> 3. CLEAN UP & PRUDENCE
            </h4>
            <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-3 shadow-sm text-slate-600 font-medium">
              <p className="font-bold text-[#212c46]">ข้อแนะนำและความปลอดภัย:</p>
              <p>
                โปรดระมัดระวังในการลบล้างประวัติตาราง ระบบล็อกระบบจัดเก็บข้อมูลจะคงประวัติไว้เพื่อใช้ในการสอบย้อนหลังของมาตรฐานผู้ตรวจสอบฮาลาล (Halal Auditor Reference) ตลอด 12 เดือนแรก
              </p>
            </div>
          </section>
        </div>
        
        <div className="p-6 border-t border-[#eaeaec] bg-[#f8f9fa] flex justify-between items-center shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">SYSTEM MANUAL V4.5</span>
          <button 
            type="button"
            onClick={onClose} 
            className="px-8 py-3 bg-[#212c46] text-white font-black rounded-xl uppercase tracking-widest text-[11px] shadow-md hover:bg-[#b58c4f] transition-all duration-300"
          >
            รับทราบ (Got it)
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
