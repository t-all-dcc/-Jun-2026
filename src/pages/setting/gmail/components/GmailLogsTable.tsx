import React from 'react';
import { History } from 'lucide-react';
import { EmailLog } from '../types';

interface Props {
  logs: EmailLog[];
  clearLogs: () => void;
}

export default function GmailLogsTable({ logs, clearLogs }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm text-left">
      <div className="flex justify-between items-center border-b border-[#eaeaec] pb-3 mb-4">
        <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-1.5">
          <History size={15} className="text-[#a54f6b]" /> Outbound Dispatch Register Logs
        </h3>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="text-[10px] font-black text-rose-700 uppercase hover:underline"
          >
            Clear History
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="py-8 text-center text-slate-400 font-bold uppercase text-[11px] tracking-widest">
          No outbound transmittals on record.
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left font-sans border-collapse">
            <thead className="bg-[#212c46] text-white uppercase tracking-widest text-[10px] font-black">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">ID</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 font-mono">Timestamp (UTC)</th>
                <th className="py-3 px-4 rounded-r-lg text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[11.5px] font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="py-2.5 px-4 text-[#4d87a8] font-black">{log.id}</td>
                  <td className="py-2.5 px-4 font-sans font-bold text-[#212c46] truncate max-w-[120px]">
                    {log.recipient}
                  </td>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-600 truncate max-w-[150px]">
                    {log.subject}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 text-[10.5px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {log.status === 'SUCCESS' ? (
                      <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-full border border-emerald-100">
                        SENT
                      </span>
                    ) : (
                      <span
                        className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-black rounded-full border border-rose-100 cursor-help"
                        title={log.error}
                      >
                        FAILED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
