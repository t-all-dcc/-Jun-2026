import React from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';

interface UserGuidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserGuidePanel({ isOpen, onClose }: UserGuidePanelProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      />
      
      {/* Drawer Container */}
      <div 
        className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg">
              <Icons.BookOpen size={22} className="text-[#b7a159]"/> DIRECTORY DIRECTIVE
            </h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">
              Workforce Profile Management
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"
          >
            <Icons.X size={24}/>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.ShieldAlert size={18} className="text-[#b7a159]"/> 1. ระบบประวัติและการบังคับใช้ PDPA
            </h4>
            <p className="text-[12px] mb-3">
              ข้อมูลพนักงานทุกคนภายใต้โครงสร้างบริษัท **ชัยศรีอะโกรอินดัสเทรียล** ถือเป็นข้อมูลจำกัดสิทธิ์ขั้นสูง (Highly Confidential) ระบบนี้ทำหน้าที่เก็บข้อมูลรายบุคคลประกอบไปด้วย 4 มิติสำคัญ:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[12px]">
              <li><strong className="text-[#4d87a8]">Basic Info (ประวัติทั่วไป):</strong> ชือไทย-อังกฤษ, บัตรประชาชน, อายุ, สัญชาติ และเพศสภาพ</li>
              <li><strong className="text-[#b58c4f]">Work Detail (การทำงาน):</strong> วันเริ่มงาน, ตำแหน่งงาน, สังกัดหน่วย และข้อมูลบัญชีรับเงินเดือน</li>
              <li><strong className="text-[#657f4d]">Contact Route (การติดต่อ):</strong> เบอร์โทรศัพท์, อีเมลทางการ และข้อมูลที่อยู่พำนักจริง</li>
              <li><strong className="text-[#932c2e]">Health & Education (สุขภาพ/การศึกษา):</strong> ประวัติการศึกษา, ทหาร, โรคประจำตัว และญาติกรณีติดต่อฉุกเฉิน</li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.ClipboardList size={18} className="text-[#d96245]"/> 2. ระบบ Multi-step Wizard
            </h4>
            <p className="text-[12px] mb-3">การจัดเก็บ ป้อน และพูนข้อมูลพนักงานใหม่-เก่า จะใช้กระบวนการ 4 ขั้นตอนแบ่งแยกตามเมนูด้านซ้ายในหน้าต่างจัดการประวัติเพื่อลดความผิดพลาดในการป้อนข้อมูลเอกสารทางการ:</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] mt-2 font-semibold">
              <div className="p-3 bg-slate-50 border border-[#eaeaec] rounded-xl text-[#212c46]">👥 Step 1: ประวัติเบื้องต้น</div>
              <div className="p-3 bg-slate-50 border border-[#eaeaec] rounded-xl text-[#212c46]">💼 Step 2: ตำแหน่ง & สวัสดิการ</div>
              <div className="p-3 bg-slate-50 border border-[#eaeaec] rounded-xl text-[#212c46]">📍 Step 3: ที่อยู่ติดต่อ</div>
              <div className="p-3 bg-slate-50 border border-[#eaeaec] rounded-xl text-[#212c46]">🎓 Step 4: วุฒิ & ข้อมูลติดต่อฉุกเฉิน</div>
            </div>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.CheckSquare size={18} className="text-[#3f809e]"/> 3. สถิติพนักงานและหัวหน้างานประสานงาน
            </h4>
            <p className="text-[12px]">
              แผงควบคุม KPI ประเมินสถิติรวม (Headcount), พนักงานที่มีสถานะ Active ถือครองตารางปัจจุบัน รวมถึงสามารถส่งออกข้อมูลประวัติครอบคลุมการตรวจสอบจากฝ่ายทรัพยากรบุคคลแบบบูรณาการ
            </p>
          </section>
        </div>
        
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-[0.1em] cursor-pointer"
          >
            รับทราบระเบียบ (Acknowledge)
          </button>
        </div>
      </div>
    </>, 
    document.body
  );
}
