import React, { useState } from 'react';
import { Plane, Calendar, UserMinus, ShieldAlert, ArrowRight, UserCheck, Sparkles, ExternalLink } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { useLanguage } from '../../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export const LeaveDistribution = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAbsentee, setSelectedAbsentee] = useState<any>(null);
    const [leavePeriodFilter, setLeavePeriodFilter] = useState<'all' | 'half_day'>('all');

    // Mock data for today's absent employees (Today's Leaves list)
    const allAbsentees = [
      { id: 'ab1', name: 'Nathapon Chaisiri', dept: 'Digital Tech', type: 'Annual Leave', rawType: 'annual', duration: 'Full Day', reason: 'Personal holiday trip to Japan', img: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&h=150&fit=crop', isHalfDay: false, contact: '081-445-XXXX' },
      { id: 'ab2', name: 'Pimchanok Sripai', dept: 'Marketing & Brand', type: 'Sick Leave', rawType: 'sick', duration: 'Morning Half', reason: 'Severe headache & doctor clinic visit', img: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&h=150&fit=crop', isHalfDay: true, contact: '085-321-XXXX' },
      { id: 'ab3', name: 'Tanapat Meedee', dept: 'Research & Innovation', type: 'Business Leave', rawType: 'business', duration: 'Afternoon Half', reason: 'Urgent family land office transaction', img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop', isHalfDay: true, contact: '089-998-XXXX' },
      { id: 'ab4', name: 'Vipa Chuenthai', dept: 'Accounting & Audit', type: 'Maternity/Other', rawType: 'other', duration: 'Full Day', reason: 'Pregnancy final trimester routing checkup', img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop', isHalfDay: false, contact: '083-772-XXXX' }
    ];

    const displayedAbsentees = allAbsentees.filter(abs => {
      if (leavePeriodFilter === 'all') return true;
      return abs.isHalfDay;
    });

    const openDetails = (abs: any) => {
      setSelectedAbsentee(abs);
      setIsModalOpen(true);
    };

    const getLeaveBadgeColor = (rawType: string) => {
      switch (rawType) {
        case 'sick':
          return 'text-[#b00303] bg-[#b00303]/10 border-[#b00303]/20';
        case 'annual':
          return 'text-[#7397ab] bg-[#7397ab]/10 border-[#7397ab]/20';
        case 'business':
          return 'text-[#b48b21] bg-[#b48b21]/10 border-[#b48b21]/20';
        default:
          return 'text-[#798a9a] bg-[#798a9a]/10 border-[#798a9a]/20';
      }
    };

    const toggleFilterRange = () => {
      setLeavePeriodFilter(prev => prev === 'all' ? 'half_day' : 'all');
    };

    return (
      <>
      <GlassCard className="bg-white border-[#eaeaec] flex flex-col relative overflow-hidden h-full">
         <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] pointer-events-none transform -rotate-12 z-0">
           <UserMinus size={200} />
         </div>

         <div className="flex items-center gap-2 mb-6 relative z-10 font-sans pl-2 pt-2">
           <UserMinus size={18} className="text-[#cb5d3d]" />
           <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
             {t('TODAYS LEAVES', 'สถิติการลาหยุดวันนี้')}
           </h2>
           <span className="ml-auto text-[8px] font-black uppercase bg-[#cb5d3d]/10 text-[#cb5d3d] px-2 py-0.5 rounded border border-[#cb5d3d]/20 shadow-sm">
             {leavePeriodFilter === 'all' ? t('ALL LEAVES', 'ทั้งหมด') : t('HALF DAY', 'ลาครึ่งวัน')}
           </span>
         </div>

         <div className="space-y-3 flex-1 relative z-10 min-h-[140px] pl-2 pr-2">
           {displayedAbsentees.map((abs, i) => (
             <div 
               key={i} 
               onClick={() => openDetails(abs)} 
               className="flex items-center gap-4 bg-white border border-[#f3f3f1] hover:border-[#cb5d3d]/60 rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
             >
               <img src={abs.img} alt={abs.name} className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm" />
               
               <div className="flex-1 min-w-0">
                 <h3 className="text-[#212c46] font-bold text-xs truncate">{abs.name}</h3>
                 <p className="text-[#798a9a] text-[10px] font-medium truncate flex items-center gap-1.5 mb-0.5">
                   <span>{abs.dept}</span>
                 </p>
                 <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                   <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${getLeaveBadgeColor(abs.rawType)}`}>
                     {t(abs.type, abs.type)}
                   </span>
                   <span className="text-[8px] font-black text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                     {abs.duration}
                   </span>
                 </div>
               </div>

               <div className="text-[9px] font-black text-[#cb5d3d] tracking-widest shrink-0 uppercase">
                 {t('ABSENT', 'ลาหยุด')}
               </div>
             </div>
           ))}
           
           {displayedAbsentees.length === 0 && (
             <div className="text-center py-6 text-xs text-[#798a9a] font-bold">
               {t('No absences in this filter!', 'ไม่มีรายชื่อลางานวันนี้')}
             </div>
           )}
         </div>

         <div className="p-2 mt-4">
             <button 
               onClick={toggleFilterRange} 
               className="w-full bg-[#1e2636] hover:bg-[#cb5d3d] text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2 shadow-md relative z-10 cursor-pointer"
             >
               <Calendar size={14} className="text-[#b48b21]" /> 
               {leavePeriodFilter === 'all' ? t('SHOW HALF-DAY LEAVES ONLY', 'แสดงเฉพาะการลาครึ่งวัน') : t('SHOW ALL LEAVES TODAY', 'แสดงรายชื่อลาทั้งหมดวันนี้')}
             </button>
         </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={
          <span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2">
            <UserMinus size={16} className="text-[#cb5d3d]"/> {t('ABSENTEE PROFILE', 'รายละเอียดข้อมูลบุคลากรลาหยุดวันนี้')}
          </span>
        }
        width="max-w-md"
      >
        <div className="p-6">
          {selectedAbsentee && (
             <div className="flex flex-col items-center gap-3 mb-6 relative z-10">
                <img src={selectedAbsentee.img} alt={selectedAbsentee.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
                <div className="text-center">
                   <p className="text-[10px] text-[#cb5d3d] font-bold uppercase tracking-[0.2em] mb-1">{t('TODAY LEAVE RECORD', 'บันทึกการลาวันนี้ ✈️')}</p>
                   <h3 className="text-xl font-sans font-black text-[#212c46]">{selectedAbsentee.name}</h3>
                   <p className="text-[11px] font-bold text-[#798a9a] mt-1">{selectedAbsentee.dept}</p>
                </div>

                <div className="w-full bg-[#fdfbf7] p-4 rounded-xl border border-[#ece7dc] mt-2 text-left font-sans shadow-sm">
                  <div className="space-y-2.5">
                     <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                        <span className="text-xs font-bold text-gray-400">{t('Leave Category', 'ประเภทการลา')}</span>
                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded border ${getLeaveBadgeColor(selectedAbsentee.rawType)}`}>
                          {selectedAbsentee.type}
                        </span>
                     </div>
                     <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                        <span className="text-xs font-bold text-gray-400">{t('Time Period', 'ช่วงเวลาการลา')}</span>
                        <span className="text-xs font-black text-slate-800">{selectedAbsentee.duration}</span>
                     </div>
                     <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                        <span className="text-xs font-bold text-gray-400">{t('Primary Contact', 'โทรศัพท์ติดต่อ')}</span>
                        <span className="text-xs font-mono font-bold text-slate-800">{selectedAbsentee.contact}</span>
                     </div>
                     <div>
                        <span className="text-[10px] font-black text-[#b48b21] uppercase tracking-wider block mb-1">{t('Reason Indicated', 'เหตุผลระบุการลา')}</span>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{selectedAbsentee.reason}</p>
                     </div>
                  </div>
                </div>
             </div>
          )}

          <div className="mt-6 flex flex-col gap-2 font-sans w-full">
             <button 
                onClick={() => { setIsModalOpen(false); navigate('/hr/leave/balances'); }}
                className="w-full bg-[#3f809e] hover:bg-[#3f809e]/90 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
             >
                {t('CHECK LEAVE BALANCES', 'ตรวจสอบยอดโควตาคงเหลือคงคลัง')} <ExternalLink size={12} />
             </button>
             <button 
                onClick={() => { setIsModalOpen(false); navigate('/hr/employees/directory'); }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
             >
                {t('VIEW EMPLOYEE DIRECTORY', 'ไปที่สารบบที่อยู่กำลังพลเพื่อติดต่องาน')}
             </button>
          </div>

          <div className="mt-4 flex justify-end">
             <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-gray-50 hover:bg-gray-100 text-slate-400 font-black uppercase tracking-widest rounded-lg text-[9px] cursor-pointer">
                {t('Go Back', 'กลับพอร์ทัล')}
             </button>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};
