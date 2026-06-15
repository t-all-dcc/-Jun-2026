import React from 'react';

export type SyncState = 'connected' | 'testing' | 'error' | 'disconnected' | 'idling';

interface SyncStatusBadgeProps {
  status: SyncState;
  className?: string;
}

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({ status, className = '' }) => {
  let styles = '';
  let label = '';

  switch (status) {
    case 'connected':
      styles = 'bg-emerald-50 border-emerald-100 text-emerald-700';
      label = 'CONNECTED';
      break;
    case 'testing':
      styles = 'bg-amber-50 border-amber-100 text-amber-700';
      label = 'TESTING';
      break;
    case 'error':
      styles = 'bg-rose-50 border-rose-100 text-rose-700';
      label = 'ERROR';
      break;
    case 'disconnected':
      styles = 'bg-slate-100 border-slate-200 text-slate-500';
      label = 'DISABLED';
      break;
    default:
      styles = 'bg-[#f8f9fa] border-[#eaeaec] text-[#7a8b95]';
      label = 'IDLE';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${styles} ${className}`}>
      {label}
    </span>
  );
};
