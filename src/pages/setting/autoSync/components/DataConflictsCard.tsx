import React from 'react';
import { ShieldAlert, CheckCircle2, Activity, Database, RefreshCw } from 'lucide-react';

interface ConflictItem {
  id: string;
  sheet: string;
  recordName: string;
  localValue: string;
  remoteValue: string;
}

interface Props {
  dataConflicts: ConflictItem[];
  handleResolveConflict: (id: string, action: 'keep_local' | 'overwrite') => void;
}

export default function DataConflictsCard({ dataConflicts, handleResolveConflict }: Props) {
  return (
    <div className="bg-[#fffbfa] rounded-2xl border border-rose-100 shadow-sm overflow-hidden auto-sync-conflicts min-w-0">
      <div className="p-5 border-b border-rose-100 bg-[#932c2e]/5 text-left">
        <h3 className="text-[14px] sm:text-[16px] font-black text-[#932c2e] uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert size={18} className="text-[#932c2e]" />
          <span>Data Conflicts Resolution</span>
        </h3>
        <p className="text-[12px] font-bold text-[#932c2e]/70 uppercase mt-1">
          ตรวจพบข้อมูลที่ขัดแย้งกันขณะซิงค์ โปรดตรวจสอบและยืนยันการแก้ไข
        </p>
      </div>
      <div className="p-5">
        {dataConflicts.length === 0 ? (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 size={24} className="text-emerald-500" />
            </div>
            <h4 className="text-[13px] font-black text-[#212c46] uppercase tracking-wider">No Conflicts Found</h4>
            <p className="text-[11px] font-bold text-[#7a8b95] mt-1">ข้อมูลทุกระบบสอดคล้องกันดีเยี่ยม</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {dataConflicts.map((conflict) => (
              <div 
                key={conflict.id} 
                className="p-4 bg-white border border-[#eaeaec] rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-[#932c2e]/10 text-[#932c2e] text-[10px] font-black uppercase tracking-widest">
                      {conflict.sheet}
                    </span>
                    <span className="text-[12px] font-black text-[#212c46] uppercase tracking-wider">
                      {conflict.recordName}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div className="bg-[#f8f9fa] p-3 rounded-lg border border-[#eaeaec]">
                      <div className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Activity size={12} /> Local Web Application
                      </div>
                      <div className="text-[12px] font-medium text-[#932c2e] line-through opacity-80">
                        {conflict.localValue}
                      </div>
                    </div>
                    <div className="bg-[#657f4d]/5 p-3 rounded-lg border border-[#657f4d]/20">
                      <div className="text-[10px] font-black text-[#657f4d] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Database size={12} /> Google Sheets (Remote)
                      </div>
                      <div className="text-[12px] font-black text-[#657f4d]">{conflict.remoteValue}</div>
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => handleResolveConflict(conflict.id, 'keep_local')} 
                    className="flex-1 md:flex-none px-4 py-2 bg-white border-2 border-[#212c46] text-[#212c46] hover:bg-[#212c46] hover:text-white rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Keep Local
                  </button>
                  <button 
                    onClick={() => handleResolveConflict(conflict.id, 'overwrite')} 
                    className="flex-1 md:flex-none px-4 py-2 bg-[#932c2e] text-white rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors hover:bg-rose-800 flex items-center justify-center gap-1.5 shadow-md border-2 border-[#932c2e] cursor-pointer"
                  >
                    <RefreshCw size={14} /> Overwrite Local
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
