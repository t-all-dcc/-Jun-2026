import React from 'react';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface LogItem {
  id: string;
  sheet: string;
  status: 'success' | 'failure';
  timestamp: Date;
}

interface Props {
  activityLogs: LogItem[];
}

export default function SyncActivityLog({ activityLogs }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#eaeaec] shadow-sm overflow-hidden min-w-0">
      <div className="p-5 border-b border-[#eaeaec] text-left">
        <h3 className="text-[14px] sm:text-[16px] font-black text-[#212c46] uppercase tracking-wider flex items-center gap-2">
          <Activity size={18} className="text-[#3f809e]" />
          <span>Sync Activity Log</span>
        </h3>
        <p className="text-[12px] font-bold text-[#7a8b95] uppercase mt-1">ประวัติการซิงโครไนซ์ข้อมูลล่าสุด</p>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-[#eaeaec]">
              <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">Timestamp</th>
              <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">Sheet / Module</th>
              <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaeaec] bg-white">
            {activityLogs.length > 0 ? (
              activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-5 whitespace-nowrap text-[12px] font-bold text-[#414757] font-mono">
                    {format(log.timestamp, 'dd MMM yyyy, HH:mm:ss')}
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap text-[12px] font-bold text-[#212c46]">
                    {log.sheet}
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap">
                    {log.status === 'success' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#657f4d]/10 border border-[#657f4d]/20 text-[#657f4d] uppercase tracking-widest">
                        <CheckCircle2 size={12} /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#932c2e]/10 border border-[#932c2e]/20 text-[#932c2e] uppercase tracking-widest">
                        <XCircle size={12} /> Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-6 text-center text-[12px] font-bold text-[#7a8b95] uppercase tracking-widest">
                  No activity logs recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
