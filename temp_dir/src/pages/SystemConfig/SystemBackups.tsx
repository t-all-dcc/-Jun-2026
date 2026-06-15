import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { 
  Database, 
  Download, 
  Trash2, 
  RefreshCw, 
  Play, 
  Clock, 
  HardDrive, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  X, 
  Check, 
  Compass, 
  HeartHandshake
} from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import UserGuideButton from '../../components/shared/UserGuideButton';
import KpiCard from '../../components/shared/KpiCard';

interface BackupItem {
  id: string;
  timestamp: Date;
  type: 'Full Backup' | 'Incremental' | 'Manual';
  status: 'Success' | 'Failed';
  size?: string;
  duration?: string;
  notes?: string;
}

// --- Theme Sync with SMART CERT ---
const THEME = {
  primary: '#212c46',
  skyBlue: '#3f809e',
  gold: '#b58c4f',
  success: '#657f4d',
  danger: '#932c2e',
  dustyBlue: '#7a8b95'
};

// --- User Guide ---
function UserGuidePanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-[#f8f9fa] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-4 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-[16px] xl:text-lg"><BookOpen size={22} className="text-[#b58c4f]"/> USER GUIDE</h3>
            <p className="text-[10px] xl:text-[11px] font-bold text-white/70 uppercase tracking-widest mt-1.5">SYSTEM BACKUPS HUB</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 xl:p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-[#f8f9fa]">
            <section className="animate-fadeIn">
                <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
                    <Database size={18} className="text-[#b58c4f]" /> 1. SYSTEM BACKUPS LOGGING
                </h4>
                <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-4 shadow-sm">
                    <p className="text-[12px] text-[#414757] leading-relaxed">
                        ระบบจัดการบันทึกประวัติการสำรองรายละเอียดคลังข้อมูล ใบอนุญาต และการตั้งค่าของคลังเอกสารใบรับรองฮาลาลในระบบ SMART CERT:
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
                        <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 shrink-0"><Check size={16}/></div>
                        <div className="text-slate-600 font-medium leading-relaxed">
                            <strong className="text-[#212c46]">Success State:</strong> ข้อมูลระบุขนาดเนื้อที่ไฟล์ (เช่น 4.2 GB) และระยะเวลานาทีที่ประมวลผลเสร็จสิ้น ปุ่มทดลองดาวน์โหลด (ไอคอนเก็บไฟล์) จะเปิดใช้งานอย่างสมบูรณ์
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-rose-50 rounded-xl border border-rose-100 text-rose-700 shrink-0"><X size={16}/></div>
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
            <button onClick={onClose} className="px-8 py-3 bg-[#212c46] text-white font-black rounded-xl uppercase tracking-widest text-[11px] shadow-md hover:bg-[#b58c4f] transition-all duration-300">รับทราบ (Got it)</button>
        </div>
      </div>
    </>,
    document.body
  );
}

export default function SystemBackups() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [backups, setBackups] = useState<BackupItem[]>(() => {
    const saved = localStorage.getItem('cfg_backups_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((b: any) => ({ ...b, timestamp: new Date(b.timestamp) }));
      } catch (e) {
        // Fallback below
      }
    }
    // Hardcoded initial list with a gorgeous history record layout
    return [
      { id: 'b-1', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), type: 'Manual', status: 'Success', size: '4.2 GB', duration: '12 mins' },
      { id: 'b-2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5), type: 'Incremental', status: 'Success', size: '1.1 GB', duration: '4 mins' },
      { id: 'b-3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3.2), type: 'Full Backup', status: 'Failed', notes: 'Authentication timeout with Google Cloud Storage API' },
      { id: 'b-4', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7.1), type: 'Full Backup', status: 'Success', size: '3.8 GB', duration: '15 mins' },
      { id: 'b-5', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14.5), type: 'Incremental', status: 'Success', size: '0.9 GB', duration: '3 mins' }
    ];
  });

  // Modal control & dynamic creation states
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [backupType, setBackupType] = useState<'Full Backup' | 'Incremental'>('Full Backup');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupStepText, setBackupStepText] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    localStorage.setItem('cfg_backups_list', JSON.stringify(backups));
  }, [backups]);

  // Calculations for KPI Cards
  const totalCount = backups.length;
  const successCount = backups.filter(b => b.status === 'Success').length;
  const lastSuccessItem = backups.find(b => b.status === 'Success');
  const lastSuccessTime = lastSuccessItem ? format(lastSuccessItem.timestamp, 'HH:mm:ss d MMM') : '--:--:--';
  
  const totalStorageGB = backups.reduce((acc, curr) => {
    if (curr.status === 'Success' && curr.size) {
      const parsedSize = parseFloat(curr.size);
      if (!isNaN(parsedSize)) return acc + parsedSize;
    }
    return acc;
  }, 0).toFixed(1);

  // Trigger real-time interactive fake backup with gorgeous loaders
  const handleTriggerBackup = () => {
    setIsBackupModalOpen(true);
    setBackupProgress(0);
    setIsBackingUp(false);
  };

  const handleStartProcess = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    setBackupStepText('Initializing cluster file manifest snapshot...');

    const interval = setInterval(() => {
      setBackupProgress(prev => {
        const next = Math.min(prev + Math.floor(Math.random() * 15) + 5, 100);
        
        // Dynamic step texts to simulate elite database operations
        if (next < 25) {
          setBackupStepText('Packing certificate database repositories...');
        } else if (next < 50) {
          setBackupStepText('Encoding GCS Halal Audit documents with SHA-256...');
        } else if (next < 75) {
          setBackupStepText('Compressing raw file streams into target binary standard...');
        } else if (next < 95) {
          setBackupStepText('Uploading build to remote cloud secure vaults...');
        } else if (next === 100) {
          setBackupStepText('Verifying backup hash signature status...');
        }

        if (next === 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Random success or intentional failed backup to make page functional and engaging
            const isLucky = Math.random() > 0.12; 
            const newBackup: BackupItem = isLucky ? {
              id: 'b-' + Math.random().toString(36).substr(2, 9),
              timestamp: new Date(),
              type: 'Manual',
              status: 'Success',
              size: (3.1 + Math.random() * 2).toFixed(1) + ' GB',
              duration: Math.floor(8 + Math.random() * 8) + ' mins'
            } : {
              id: 'b-' + Math.random().toString(36).substr(2, 9),
              timestamp: new Date(),
              type: 'Manual',
              status: 'Failed',
              notes: 'Gateway Connection Timeout on destination cluster Node #2'
            };

            setBackups(prev => [newBackup, ...prev]);
            setIsBackingUp(false);
            setIsBackupModalOpen(false);

            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: isLucky ? 'success' : 'error',
              title: isLucky ? 'Manual Backup Completed!' : 'Backup Process Failed',
              text: isLucky ? 'File was cached and uploaded gracefully.' : newBackup.notes,
              showConfirmButton: false,
              timer: 3500,
              background: '#f8f9fa'
            });
          }, 1000);
        }
        return next;
      });
    }, 450);
  };

  const handleDeleteBackup = (id: string) => {
    Swal.fire({
      title: 'ลบประวัติการสำรองข้อมูล?',
      text: "คุณกำลังจะลบข้อมูลประวัติสำรองนี้ออกจากสารบบฐานข้อมูล",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: THEME.danger,
      cancelButtonColor: THEME.dustyBlue,
      confirmButtonText: 'ยืนยันการลบ',
      cancelButtonText: 'ยกเลิก',
      background: '#f8f9fa'
    }).then((result) => {
      if (result.isConfirmed) {
        setBackups(prev => prev.filter(b => b.id !== id));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'รายการประวัติถูกล้างสำเร็จ',
          showConfirmButton: false,
          timer: 2000,
          background: '#f8f9fa'
        });
      }
    });
  };

  const handleDownloadFile = (item: BackupItem) => {
    if (item.status === 'Failed') return;
    Swal.fire({
      icon: 'success',
      title: 'กำลังเตรียมดาวน์โหลดไฟล์สำรองข้อมูล',
      html: `ประเภท: <b>${item.type}</b><br/>สแนปช็อต: <b>${format(item.timestamp, "dd MMM yyyy HH:mm")}</b><br/>ขนาดเนื้อที่ไฟล์: <b>${item.size}</b>`,
      confirmButtonColor: THEME.primary,
      confirmButtonText: 'ตกลงดาวน์โหลด (Safe Download)',
      background: '#f8f9fa'
    });
  };

  // Filter backups list
  const filteredBackups = backups.filter(b => {
    const matchType = filterType === 'All' || b.type === filterType;
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchType && matchStatus;
  });

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* USER GUIDE FLOATING TAB */}
      <UserGuideButton onClick={() => setIsGuideOpen(true)} />

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* HEADER SECTION - Precise structural parity with User Permissions */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Database size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header" style={{ fontSize: '24px' }}>
                      SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">BACKUPS</span> NODE
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      BACKUP LOGGING, RECOVERY PLANNING & DATABASE HISTORY
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={handleTriggerBackup} className="px-6 py-2.5 bg-[#212c46] hover:bg-[#3f809e] text-white rounded-lg text-[11px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2">
                     <Play size={14} className="fill-current" /> Create Backup
                  </button>
              </div>
          </div>
      </div>

      {/* Main container wrappers matching User Permissions layout spacing rules */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="w-full">
            
            {/* KPI STATS - Exact parity spacing of mb-3 shrink-0 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
                <KpiCard label="Total Backups Count" value={totalCount} icon={Database} color={THEME.primary} description="Total Recorded Cycles" />
                <KpiCard label="Successful Records" value={successCount} icon={CheckCircle2} color={THEME.success} description={`${successCount}/${totalCount} Success Runs`} />
                <KpiCard label="Overall Archive Size" value={`${totalStorageGB} GB`} icon={HardDrive} color={THEME.gold} description="Cloud Vault Storage" />
                <KpiCard label="Last Successful Safe" value={lastSuccessTime} icon={Clock} color={THEME.skyBlue} description="Latest Snapshot Time" />
            </div>

            {/* Main Core Layout & Controls below KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
              
              {/* Filter controls panel */}
              <div className="lg:col-span-3 bg-white/90 p-5 rounded-2xl shadow-sm border border-[#eaeaec] animate-fadeIn h-fit">
                <h3 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-4">
                  <Compass size={18} className="text-[#b58c4f]" /> 
                  FILTER CONTROLS
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Backup Category</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f] cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Full Backup">Full Backup</option>
                      <option value="Incremental">Incremental</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Success Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f] cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Success">Success Only</option>
                      <option value="Failed">Failed Only</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-[#eaeaec] text-[11px] font-medium text-slate-500 leading-normal bg-slate-50/50 p-3 rounded-lg flex items-center gap-2">
                    <HeartHandshake size={14} className="text-[#b58c4f] shrink-0" />
                    <span>สำรองรักษาประวัติตามโครงสร้าง SMART CERT อย่างเคร่งครัด</span>
                  </div>
                </div>
              </div>

              {/* Data Table Panel */}
              <div className="lg:col-span-9 bg-white rounded-2xl shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col h-full min-h-0">
                <div className="p-4 bg-[#f8f9fa] border-b border-[#eaeaec] flex items-center justify-between">
                  <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2">
                    <Database size={16} className="text-[#b58c4f]" /> 
                    BACKUP ARCHIVES HISTORY ({filteredBackups.length} logs)
                  </h4>
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">SMART SYSTEM CONTROL</span>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-[#1d2636] border-b-[2px] border-[#b7a159] text-white">
                        <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-[#d7d7d7] w-48">Date / Timestamp</th>
                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[#d7d7d7] w-32">Type</th>
                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[#d7d7d7] w-56">Backup Status & Details</th>
                        <th className="py-3 px-4 text-center text-[10px] font-black uppercase tracking-widest text-[#d7d7d7] w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaeaec] bg-white">
                      {filteredBackups.length > 0 ? (
                        filteredBackups.map((item) => {
                          return (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3.5 px-5 whitespace-nowrap text-[12px] font-bold text-[#414757]">
                                <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-[#7a8b95]" />
                                  <span className="font-mono">{format(item.timestamp, 'yyyy-MM-dd HH:mm:ss')}</span>
                                </div>
                              </td>
                              
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                {item.type === 'Full Backup' && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-purple-50 border border-purple-200 text-purple-700 uppercase tracking-wider">
                                    Full Set
                                  </span>
                                )}
                                {item.type === 'Incremental' && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-sky-50 border border-sky-200 text-[#3f809e] uppercase tracking-wider">
                                    Incremental
                                  </span>
                                )}
                                {item.type === 'Manual' && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wider">
                                    Manual
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                {item.status === 'Success' ? (
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                                      <CheckCircle2 size={13} className="text-[#657f4d] shrink-0" />
                                      <span>Success</span>
                                    </div>
                                    <div className="text-[10px] text-[#7a8b95] font-black uppercase tracking-wide">
                                      Size: <span className="text-[#212c46]">{item.size}</span> &bull; Extracted: <span className="text-[#212c46]">{item.duration}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-1 max-w-sm">
                                    <div className="flex items-center gap-1.5 text-rose-700 text-[11px] font-bold uppercase tracking-wider">
                                      <XCircle size={13} className="text-[#932c2e] shrink-0" />
                                      <span>Failed</span>
                                    </div>
                                    <div className="text-[11px] font-medium text-rose-600 leading-normal">
                                      {item.notes}
                                    </div>
                                  </div>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <div className="inline-flex items-center justify-center gap-2">
                                  {/* Download button active ONLY on success */}
                                  <button
                                    onClick={() => handleDownloadFile(item)}
                                    disabled={item.status === 'Failed'}
                                    title={item.status === 'Failed' ? 'Download Unavailable' : 'Download Snapshot File'}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all ${
                                      item.status === 'Success' 
                                        ? 'bg-white border-[#3f809e]/30 text-[#3f809e] hover:bg-[#3f809e] hover:text-white cursor-pointer hover:border-[#3f809e] shadow-sm' 
                                        : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    <Download size={14} />
                                  </button>

                                  {/* Delete button */}
                                  <button
                                    onClick={() => handleDeleteBackup(item.id)}
                                    title="Delete/L้าง LOG"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-rose-100 bg-white text-[#932c2e] hover:bg-[#932c2e] hover:text-white transition-all shadow-sm cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                            No backup records match your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#F0EAE1]/80 py-3 px-6 border-t border-[#eaeaec] flex justify-between items-center text-[11px] font-bold text-[#212c46] uppercase tracking-wider">
                  <span>Showing {filteredBackups.length} of {backups.length} archives</span>
                  <span>SMART CERT INFRASTRUCTURE</span>
                </div>
              </div>

            </div>

        </div>
      </div>

      {/* DRAGGABLE BACKUP INVOCATION MODAL */}
      <DraggableModal
        isOpen={isBackupModalOpen}
        onClose={() => !isBackingUp && setIsBackupModalOpen(false)}
        title="INVOKE MANUAL CLUSTER SNAPSHOT"
        width="max-w-lg"
      >
        <div className="p-6 space-y-6">
          {!isBackingUp ? (
            <>
              <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-xl flex items-center gap-3">
                <Database size={24} className="text-[#3f809e] shrink-0" />
                <div className="text-left text-[12px]">
                  <p className="font-black text-[#212c46] uppercase">Manual Backup Process</p>
                  <p className="text-slate-500 font-medium">บันทึกสแนปช็อตด่วน คัดลอกฐานข้อมูลระบบและบันทึกคาร์บอนเอกสารฮาลาลองค์กรเพื่อป้องกันความเสียหาย</p>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Backup Stream Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBackupType('Full Backup')}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        backupType === 'Full Backup'
                          ? 'border-[#212c46] bg-[#212c46]/5 text-[#212c46] font-black'
                          : 'border-[#eaeaec] bg-white text-slate-500 font-bold hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-[12px] uppercase tracking-wide">Full Backup</p>
                      <p className="text-[10px] text-[#7a8b95] font-medium mt-0.5">สำรองข้อมูลทั้งหมด (~4.0 GB)</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBackupType('Incremental')}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        backupType === 'Incremental'
                          ? 'border-[#212c46] bg-[#212c46]/5 text-[#212c46] font-black'
                          : 'border-[#eaeaec] bg-white text-slate-500 font-bold hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-[12px] uppercase tracking-wide">Incremental</p>
                      <p className="text-[10px] text-[#7a8b95] font-medium mt-0.5">บันทึกเฉพาะส่วนแก้ไข (~1.0 GB)</p>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#eaeaec] text-slate-400 text-[11px] font-medium flex items-center gap-2">
                  <AlertTriangle className="text-[#b58c4f] shrink-0" size={14} />
                  <span>ใช้ระยะเวลาราว 5-15 วินาทีในการรันขึ้นเว็บเซิร์ฟเวอร์เสร็จสิ้น</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#eaeaec]">
                <button
                  type="button"
                  onClick={() => setIsBackupModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-50"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleStartProcess}
                  className="px-6 py-2.5 bg-[#212c46] hover:bg-[#3f809e] text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
                >
                  <RefreshCw size={12} className="animate-spin" /> START BACKUP NOW
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-6 text-center space-y-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Spinning loader outer */}
                <div className="absolute inset-0 rounded-full border-4 border-[#eaeaec] border-t-[#3f809e] animate-spin"></div>
                <Database size={32} className="text-[#3f809e] animate-pulse" />
              </div>

              <div className="w-full max-w-xs bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-[#3f809e] to-[#b58c4f] h-full transition-all duration-300"
                  style={{ width: `${backupProgress}%` }}
                ></div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[13px] font-black text-[#212c46] uppercase tracking-wider">
                  Backup Progress ({backupProgress}%)
                </p>
                <p className="text-[11px] font-bold text-[#7a8b95] uppercase font-mono max-w-sm truncate animate-pulse">
                  {backupStepText}
                </p>
              </div>
            </div>
          )}
        </div>
      </DraggableModal>

    </div>
  );
}
