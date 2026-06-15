import React, { useState } from 'react';
import { ClipboardList, Check, X, AlertCircle, ExternalLink } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { useLanguage } from '../../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export const LeaveOverview = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [noteText, setNoteText] = useState('');
    
    // Manage pending leave requests locally to support live interactive approvals click
    const [requests, setRequests] = useState([
      { id: 'lr1', name: 'Kitti Somrak', role: 'SOFTWARE TESTER', dept: 'Digital Tech', dateStr: '15 - 16 Jun 2026', leaveType: 'Sick Leave', rawType: 'sick', reason: 'Severe Flu & Doctor appointment tracking', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', state: 'PENDING', note: '' },
      { id: 'lr2', name: 'Saranya Jaidee', role: 'UX DESIGNER', dept: 'Creative Design', dateStr: '17 - 19 Jun 2026', leaveType: 'Annual Leave', rawType: 'annual', reason: 'Family vacation to Chiang Mai flight', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop', state: 'PENDING', note: '' },
      { id: 'lr3', name: 'Wichai Rakpan', role: 'ACCOUNTANT', dept: 'Audit & Finance', dateStr: '16 Jun 2026', leaveType: 'Business Leave', rawType: 'business', reason: 'Personal driving license renewal', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', state: 'PENDING', note: '' }
    ]);

    const handleOpenClick = (r: any) => {
      setSelectedRequest(r);
      setNoteText(r.note || '');
      setIsModalOpen(true);
    };

    const handleApprove = (id: string) => {
      setRequests(prev => prev.map(req => req.id === id ? { ...req, state: 'APPROVED', note: noteText } : req));
      setIsModalOpen(false);
    };

    const handleReject = (id: string) => {
      setRequests(prev => prev.map(req => req.id === id ? { ...req, state: 'REJECTED', note: noteText } : req));
      setIsModalOpen(false);
    };

    const getLeaveBadgeStyle = (rawType: string) => {
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

    const pendingCount = requests.filter(r => r.state === 'PENDING').length;

    return (
      <>
      <GlassCard className="bg-white border-[#eaeaec] flex flex-col relative overflow-hidden h-full p-4">
        <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] pointer-events-none transform -rotate-12 z-0">
          <ClipboardList size={200} />
        </div>
        
        <div className="flex items-center gap-2 mb-4 relative z-10 font-sans">
           <ClipboardList size={18} className="text-[#cb5d3d]" />
           <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
             {t('PENDING LEAVE REQUESTS', 'คำร้องขออนุมัติการลาค้างพิจารณา')}
           </h2>
           <span className="ml-auto text-[8px] font-black uppercase bg-[#cb5d3d]/10 text-[#cb5d3d] px-2 py-0.5 rounded border border-[#cb5d3d]/20 shadow-sm">
             {pendingCount} {t('Pending', 'รอพิจารณา')}
           </span>
        </div>

        <div className="space-y-3 flex-1 relative z-10 min-h-[140px]">
          {requests.map((r, i) => (
            <div 
              key={i} 
              onClick={() => handleOpenClick(r)} 
              className={`flex items-center gap-4 bg-white border ${r.state === 'APPROVED' ? 'border-[#53694d]/40 bg-[#53694d]/5' : r.state === 'REJECTED' ? 'border-[#b00303]/40 bg-[#b00303]/5' : 'border-[#f3f3f1] hover:border-[#cb5d3d]/60'} rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group`}
            >
              <img src={r.img} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-[#212c46] font-bold text-xs truncate">{r.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">{r.dateStr.split(' ')[0]} {r.dateStr.split(' ')[1] || ''}</span>
                </div>
                <p className="text-[#798a9a] text-[10px] font-medium truncate flex items-center gap-1.5 mb-0.5">
                  <span>{r.dept}</span>
                </p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${getLeaveBadgeStyle(r.rawType)}`}>
                    {t(r.leaveType, r.leaveType)}
                  </span>
                  {r.state !== 'PENDING' && (
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${r.state === 'APPROVED' ? 'bg-[#53694d] text-white' : 'bg-[#b00303] text-white'}`}>
                      {r.state}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[9px] font-black text-[#cb5d3d] tracking-widest shrink-0 uppercase">
                {r.state === 'PENDING' ? t('REVIEW', 'ตรวจดู') : t('DONE', 'เสร็จสิ้น')}
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="text-center py-6 text-xs text-[#798a9a] font-bold">
              {t('No pending requests!', 'ไม่มีคำร้องค้างพิจารณา')}
            </div>
          )}
        </div>

        <div className="mt-4">
             <button 
               onClick={() => navigate('/hr/leave/requests')}
               className="w-full bg-[#1e2636] hover:bg-[#cb5d3d] text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2 shadow-md relative z-10 cursor-pointer"
             >
               <ClipboardList size={14} className="text-[#b48b21]" /> 
               {t('MANAGE ALL LEAVE REQUESTS', 'จัดการระบบพิจารณารวมสะพัด')}
             </button>
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><ClipboardList size={16} className="text-[#cb5d3d]"/> {t('LEAVE APPROVAL ACTION', 'การพิจารณาคำร้องอนุมัติการลา')}</span>}
        width="max-w-md"
      >
        <div className="p-6">
          {selectedRequest && (
             <div className="text-center mb-6">
               <img src={selectedRequest.img} alt={selectedRequest.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-[#cb5d3d]/20 shadow-md mx-auto mb-4" />
               <h3 className="text-xl font-black text-[#212c46] mb-1">{selectedRequest.name}</h3>
               <p className="text-[#798a9a] text-xs font-black uppercase tracking-widest mb-1">{selectedRequest.role}</p>
               <p className="text-[#10172a] text-xs font-bold">{selectedRequest.dept}</p>
               
               <div className="mt-3 flex justify-center">
                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getLeaveBadgeStyle(selectedRequest.rawType)}`}>
                    {selectedRequest.leaveType}
                  </span>
               </div>

               <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#ece7dc] mt-4 text-left font-sans shadow-sm">
                  <p className="text-[10px] font-black text-[#b48b21] uppercase tracking-wider mb-1">{t('REASON & DETAIL', 'สาเหตุและรายละเอียดการลา')}</p>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{selectedRequest.reason}</p>
                  
                  <div className="mt-3 flex justify-between text-[11px] font-bold text-[#798a9a]">
                     <span>{t('LEAVE PERIOD', 'ช่วงเวลาลา')}</span>
                     <span className="text-slate-800 font-mono font-black">{selectedRequest.dateStr}</span>
                  </div>
               </div>

               {selectedRequest.state !== 'PENDING' && (
                  <div className="mt-4 p-3 rounded-xl border text-center font-bold text-xs">
                     {selectedRequest.state === 'APPROVED' ? (
                       <span className="text-[#53694d] bg-[#53694d]/10 px-4 py-2 rounded-lg flex items-center justify-center gap-2 border border-[#53694d]/20">
                          <Check size={16} /> APPROVED BY ADMIN
                       </span>
                     ) : (
                       <span className="text-[#b00303] bg-[#b00303]/10 px-4 py-2 rounded-lg flex items-center justify-center gap-2 border border-[#b00303]/20">
                          <X size={16} /> REJECTED BY ADMIN
                       </span>
                     )}
                  </div>
               )}
             </div>
          )}
          
          <div className="mb-6 font-sans">
            <label className="block text-[10px] font-black text-[#212c46] uppercase tracking-widest mb-2">{t('ADMIN APPROVAL NOTE', 'บันทึกระบุเพิ่มเติมโดยเจ้าหน้าที่')}</label>
            <textarea 
              className="w-full h-20 p-3 border border-[#cdd0db] rounded-xl text-sm focus:border-[#cb5d3d] focus:ring-1 focus:ring-[#cb5d3d] outline-none transition-all resize-none bg-[#f3f3f1]/50 font-medium font-sans"
              placeholder={t('Optional approval/rejection description...', 'ระบุรายละเอียดคำชี้แจงในการพิจารณาคำร้องนี้ (ไม่บังคับ)...')}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
            />
          </div>

          {selectedRequest && selectedRequest.state === 'PENDING' && (
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleReject(selectedRequest.id)}
                  className="bg-white hover:bg-red-50 text-[#b00303] border-2 border-[#b00303]/20 hover:border-[#b00303] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                   <X size={14} /> {t('REJECT', 'ปฏิเสธคำลานี้')}
                </button>
                <button 
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="bg-[#53694d] hover:bg-[#53694d]/90 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                   <Check size={14} /> {t('APPROVE', 'อนุมัติการลา')}
                </button>
             </div>
          )}

          <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
             <button 
               onClick={() => { setIsModalOpen(false); navigate('/hr/leave/requests'); }}
               className="text-[#cb5d3d] hover:underline flex items-center gap-1 cursor-pointer"
             >
                {t('Go to main Registry', 'ไปที่สารบบคำขอการลาหลัก')} <ExternalLink size={10} />
             </button>
             <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-[#798a9a] cursor-pointer">
                {t('Close', 'ปิด')}
             </button>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};
