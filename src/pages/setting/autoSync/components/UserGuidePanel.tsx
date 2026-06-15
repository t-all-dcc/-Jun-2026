import React from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, X, RefreshCw, ShieldAlert, Database, Clock, AlertTriangle } from 'lucide-react';

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
              <BookOpen size={22} className="text-[#b7a159]" /> USER GUIDE
            </h3>
            <p className="text-[10px] xl:text-[11px] font-bold text-white/70 uppercase tracking-widest mt-1.5">
              AUTO-SYNC GUIDE
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 xl:p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-[#f8f9fa] text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
              <RefreshCw size={18} className="text-emerald-600" /> 1. BACKGROUND AUTO-SYNC SYSTEM
            </h4>
            <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-4 shadow-sm">
              <p className="text-[12px] text-[#414757] leading-relaxed">
                ระบบ Background Auto-Sync ทำงานเบื้องหลังด้วยการส่ง/ตรวจสอบข้อมูลระหว่างเว็บ Smart HR และคลังสเปรดชีต Google Sheets ที่ลงทะเบียนไว้ผ่าน Google Apps Script API:
              </p>
              <ul className="list-disc pl-5 space-y-3 font-medium text-[12px]">
                <li>
                  <strong className="text-[#212c46]">Active Synchronization:</strong> ทุกการทำรายการของพนักงานในระบบ (เช่น ขออนุมัติลา, บันทึกประวัติ หรือลงเวลา) ข้อมูลจะส่งต่อไปบันทึกใน Google Sheets โดยอัตโนมัติหากเปิดสวิตช์ toggle ไว้
                </li>
                <li>
                  <strong className="text-[#212c46]">Manual Queue Testing:</strong> คุณสามารถกดทดสอบการสื่อสารแบบรายตารางได้ฟรีด้วยปุ่ม <strong className="text-[#3f809e]">Test Connection</strong> ดึงชุดข้อมูลทดลองและบันทึกในเวลานั้น
                </li>
              </ul>
            </div>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
              <ShieldAlert size={18} className="text-rose-600" /> 2. TOGGLE INDICATORS & STATUS
            </h4>
            <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-4 shadow-sm text-[12px]">
              <div className="flex items-start gap-3">
                <span className="inline-flex shrink-0 items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase tracking-widest min-w-[90px] justify-center">CONNECTED</span>
                <div className="text-slate-600 font-medium">ตารางนั้นเชื่อมต่อด้วยระบบออโต้ บันทึกข้อมูลและตอบสนองได้อย่างดีเยี่ยม</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex shrink-0 items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 border border-amber-100 text-amber-700 uppercase tracking-widest min-w-[90px] justify-center">TESTING</span>
                <div className="text-slate-600 font-medium">ระบบกำลังทดลองคุยกับ Google Apps Script Web App พอร์ต 3000 หรือ URL ที่เกี่ยวข้อง</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex shrink-0 items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700 uppercase tracking-widest min-w-[90px] justify-center">ERROR</span>
                <div className="text-slate-600 font-medium">ไม่สามารถติดต่อ Google sheets ได้เนื่องจากคีย์ไม่ถูกต้อง ข้ามสิทธิ์ หรือขาดการเปิดใช้เว็บแอปพลิเคชัน</div>
              </div>
            </div>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
              <Database size={18} className="text-[#b58c4f]" /> 3. SYSTEM IMPACT & RECOMMENDATIONS
            </h4>
            <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-4 shadow-sm">
              <p className="text-[12px] text-[#414757] font-bold">คำแนะนำสำหรับการดูแลทรัพยากร API ของแอปพลิเคชัน:</p>
              <ul className="list-disc pl-5 space-y-3 font-medium text-[12px] text-slate-600">
                <li>
                  <strong className="text-[#212c46]">Employees / SystemConfig</strong> แนะนำให้สวิตช์ Toggle ON ไว้เสมอเพื่อหลีกเลี่ยงความล่าช้าในการดึงข้อมูลหลักและค่ากำหนดทางธุรกรรม
                </li>
                <li>
                  <strong className="text-[#212c46]">ProductionRecords / QualityMetrics</strong> หากระบบไม่ได้ใช้กลุ่มงานผลิตหรือคิวโปรดักชั่นเป็นประจำ สามารถเลือกปิดซิงค์เพื่อลดภาระงานเขียนแผ่นสเปรดชีตและประหยัด API Limit ของทางฝั่ง Google Cloud ได้
                </li>
              </ul>
            </div>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-4 font-mono pb-3 border-b-2 border-[#eaeaec]">
              <Clock size={18} className="text-[#8b5cf6]" />
              <h4 className="text-[13px] font-black text-[#212c46] uppercase">4. SYNC INTERVAL SETTINGS</h4>
            </div>
            <div className="space-y-4">
              <p className="text-[12px] text-[#414757] font-bold">กำหนดความถี่ที่ระบบจะทำงานตรวจสอบและเชื่อมข้อมูลโดยอัตโนมัติ:</p>
              <ul className="list-disc pl-5 space-y-3 font-medium text-[12px] text-[#414757]">
                <li>
                  <strong className="text-[#212c46]">30 Mins:</strong> เหมาะสำหรับเวลาทำการปกติที่มีการเคลื่อนไหวของธุรกรรมสูง
                </li>
                <li>
                  <strong className="text-[#212c46]">Hourly:</strong> ระดับพื้นฐาน แนะนำสำหรับระบบที่มีผู้ใช้น้อยลง
                </li>
                <li>
                  <strong className="text-[#212c46]">Daily:</strong> สำหรับข้อมูลประเภทเก็บถาวรหรือระบบสำรองเท่านั้น
                </li>
              </ul>
            </div>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 mb-4 font-mono pb-3 border-b-2 border-[#eaeaec]">
              <AlertTriangle size={18} className="text-[#eab308]" />
              <h4 className="text-[13px] font-black text-[#212c46] uppercase">5. CONFLICT RESOLUTION</h4>
            </div>
            <div className="space-y-4">
              <p className="text-[12px] text-[#414757] font-bold">เมื่อพบว่ามีการแก้ไขข้อมูลที่จุดเดียวกัน ทั้งบนเว็บแอปพลิเคชันและใน Google Sheets ระบบจะแสดงรายการข้อขัดแย้ง (Data Conflicts) เพื่อให้คุณตัดสินใจเลือก:</p>
              <ul className="list-disc pl-5 space-y-3 font-medium text-[12px] text-[#414757]">
                <li>
                  <strong className="text-[#212c46]">Keep Local:</strong> บังคับใช้ข้อมูลบนเว็บนี้ และไปเขียนทับแผ่นงานบน Sheets
                </li>
                <li>
                  <strong className="text-[#212c46]">Overwrite:</strong> ดึงข้อมูลดั้งเดิมจาก Sheets มาเขียนทับประวัติที่ขัดแย้งบนเว็บ
                </li>
              </ul>
            </div>
          </section>
        </div>
        
        <div className="p-6 border-t border-[#eaeaec] bg-[#f8f9fa] flex justify-between items-center shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">SYSTEM MANUAL V4.0</span>
          <button 
            onClick={onClose} 
            className="px-8 py-3 bg-[#212c46] text-white font-black rounded-xl uppercase tracking-widest text-[11px] shadow-md hover:bg-[#b58c4f] transition-all duration-300 cursor-pointer"
          >
            รับทราบ (Got it)
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
