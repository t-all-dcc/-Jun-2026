import React from 'react';
import { createPortal } from 'react-dom';
import { FileText, X, Activity, UserCheck, Server, Database } from 'lucide-react';

interface LogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  ip: string;
  module: string;
  action: string;
  status: string;
  details: string;
  userAgent: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  log: LogItem | null;
}

export default function LogDetailsModal({ isOpen, onClose, log }: Props) {
  if (!isOpen || !log) return null;

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Success': return 'text-[#657f4d] bg-[#657f4d]/10 border-[#657f4d]/20';
      case 'Failed': return 'text-[#932c2e] bg-[#932c2e]/10 border-[#932c2e]/20';
      case 'Warning': return 'text-[#d96245] bg-[#d96245]/10 border-[#d96245]/20';
      default: return 'text-[#7a8b95] bg-[#f8f9fa] border-[#eaeaec]';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-[#212c46]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-[28px] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-[#eaeaec]/50">
        <div className="bg-[#212c46] px-8 py-4 flex justify-between items-center text-[#b7a159] shrink-0 border-b border-[#414757]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shadow-inner border border-white/20">
              <FileText size={24} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-black uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm text-white">
                LOG DETAILS
              </h3>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-2 drop-shadow-sm">
                <Activity size={12} className="text-[#b7a159]" /> System Event Inspector
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-[#932c2e]"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6 bg-[#f8f9fa] overflow-y-auto custom-scrollbar text-left"> 
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black text-[#212c46] font-mono tracking-tighter">{log.id}</h2>
              <p className="text-[11px] font-bold text-[#7a8b95] mt-1 uppercase tracking-widest font-mono">{log.timestamp}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full border-2 font-black text-[12px] uppercase tracking-widest ${getStatusStyle(log.status)}`}>
              {log.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] shadow-sm space-y-4">
              <h4 className="text-[11px] font-black text-[#212c46] uppercase tracking-widest border-b border-[#d7d7d7] pb-2 flex items-center gap-2">
                <UserCheck size={14} className="text-[#4d87a8]" /> User Identity
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-black text-[#7a8b95] uppercase tracking-widest">Username / ID</p>
                  <p className="text-[13px] font-black text-[#212c46] font-mono">{log.user}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#7a8b95] uppercase tracking-widest">Access Role</p>
                  <p className="text-[12px] font-bold text-[#b7a159] uppercase tracking-wider">{log.role}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] shadow-sm space-y-4">
              <h4 className="text-[11px] font-black text-[#212c46] uppercase tracking-widest border-b border-[#d7d7d7] pb-2 flex items-center gap-2">
                <Server size={14} className="text-[#4d87a8]" /> Network & Device
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-black text-[#7a8b95] uppercase tracking-widest">IP Address</p>
                  <p className="text-[13px] font-black text-[#3f809e] font-mono">{log.ip}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#7a8b95] uppercase tracking-widest">User Agent</p>
                  <p className="text-[11px] font-medium text-[#414757] truncate" title={log.userAgent}>{log.userAgent}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] shadow-sm space-y-4">
            <h4 className="text-[11px] font-black text-[#212c46] uppercase tracking-widest border-b border-[#d7d7d7] pb-2 flex items-center gap-2">
              <Database size={14} className="text-[#4d87a8]" /> Action Payload
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[9px] font-black text-[#7a8b95] uppercase tracking-widest">Target Module</p>
                <p className="text-[12px] font-bold text-[#212c46]">{log.module}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-[#7a8b95] uppercase tracking-widest">Action Performed</p>
                <p className="text-[12px] font-black text-[#4d87a8] uppercase font-mono">{log.action}</p>
              </div>
            </div>
            <div className="bg-slate-100 p-4 rounded-xl border border-[#eaeaec] font-mono text-[11px] text-[#414757]">
              <span className="text-[#932c2e] font-bold">"Message"</span>: "{log.details}"
            </div>
          </div>
        </div>

        <div className="px-8 py-4 bg-white border-t border-[#eaeaec] flex justify-end items-center shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="px-10 py-3 bg-[#212c46] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all border border-[#212c46] cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
