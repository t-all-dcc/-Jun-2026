import React from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, ShieldAlert, Plus, X } from 'lucide-react';
import { THEME } from './types';

interface UserGuidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserGuidePanel({ isOpen, onClose }: UserGuidePanelProps) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div 
        className={`fixed inset-0 z-[500] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      />
      <div 
        className={`fixed inset-y-0 right-0 z-[510] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b58c4f] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b58c4f] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-base">
              <BookOpen size={20} className="text-[#b58c4f]"/> SALARY MASTER GUIDE
            </h3>
            <p className="text-[11px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">
              คู่มือตั้งค่าระบบฐานข้อมูลคงที่พนักงาน
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-white/50 hover:text-rose-500 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20}/>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <ShieldAlert size={16} className="text-[#b58c4f]"/> 1. Fixed Baseline Compensation
            </h4>
            <p className="text-[12px] mb-2">
              <b>ฐานรายรับอ้างอิงคงที่ (Fixed Earnings):</b> หน้านี้คือถังข้อมูลพนักงานถาวรเพื่อใช้อ้างอิงการจัดทำเงินเดือนรายเดือนขององค์กร:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-[#606a5f] font-medium">
              <li>
                <strong className="text-[#2f2926]">Monthly Net Base:</strong> ยอดรายรับของบุคลากรประจำ ไม่ผูกมัดหรือผันแปรตามชั่วโมงทำงานจริง
              </li>
              <li>
                <strong className="text-[#2f2926]">Daily Worker Baselines:</strong> อัตรารายวัน (Daily Rate) และจำนวนวันทำงานมาตรฐานอ้างอิง (Std. Working Days)
              </li>
              <li>
                <strong className="text-[#2f2926]">Allowances Matrix:</strong> ค่าวิชาชีพ, ค่าตำแหน่ง, ค่าเดินทาง และสวัสดิการความปลอดภัยคงที่ทั้งหมด
              </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono flex-wrap">
              <Plus size={16} className="text-[#508660]"/> 2. Custom Extensions Features
            </h4>
            <p className="text-[12px] mb-2">
              <b>การเพิ่มรายการอิสระนอกเหนือฟิลด์คงที่:</b> คุณสามารถแทรกรายรับหรือคำหักพนักงานแบบอิสระรายบุคคลได้ไม่จำกัด:
            </p>
            <ul className="list-none pl-0 space-y-2 text-[11px] font-medium text-[#606a5f]">
              <li className="bg-[#f0f9f6] p-2.5 rounded-lg border border-[#e2f0ee]">
                <b className="text-[#508660]">+ Add Fixed Income</b> สำหรับจัดตั้งค่ารายรับคงที่พิเศษ เช่น ค่าทักษะภาษา, ค่าความเชี่ยวชาญเครื่องจักร
              </li>
              <li className="bg-[#fff5f5] p-2.5 rounded-lg border border-[#ffe5e5]">
                <b className="text-[#932c2e]">+ Add Fixed Deduction</b> เพื่อจัดแต่งยอดหักบัญชีพิเศษ นอกเหนือจากประกันสังคมปกติ
              </li>
            </ul>
          </section>
        </div>
        
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-8 py-2.5 bg-[#851c24] text-white font-black rounded-xl uppercase text-[11px] hover:bg-[#932c2e] transition-all shadow-md tracking-[0.1em]"
          >
            รับทราบ (Got it)
          </button>
        </div>
      </div>
    </>, 
    document.body
  );
}
