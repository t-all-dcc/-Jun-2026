import React from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';

interface Props {
  spreadsheetId: string;
  setSpreadsheetId: (val: string) => void;
  isFormatting: boolean;
  formatLogs: string[];
  handleRunSetup: () => void;
}

export default function SpreadsheetFormationCard({
  spreadsheetId,
  setSpreadsheetId,
  isFormatting,
  formatLogs,
  handleRunSetup
}: Props) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-2xl text-[#b58c4f] shrink-0 shadow-sm">
          <FileSpreadsheet size={24} />
        </div>
        <div className="text-left">
          <h3 className="text-[15px] font-black text-[#212c46] uppercase tracking-widest">
            Spreadsheet Formation Control
          </h3>
          <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1 leading-relaxed">
            Run setup to inject standard schemas, styles, and tabs dynamically.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block">
            Spreadsheet Drive Document ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              disabled={isFormatting}
              placeholder="Enter Google Spreadsheet ID..."
              className="flex-1 bg-white border border-[#eaeaec] rounded-xl px-4 py-3 text-xs font-bold font-mono outline-none focus:border-[#b58c4f] shadow-sm text-[#212c46]"
            />
            <button
              onClick={handleRunSetup}
              disabled={isFormatting}
              className="px-8 py-3 bg-[#b58c4f] hover:bg-[#a57c3f] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isFormatting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> FORMATTING...
                </>
              ) : (
                'RUN SETUP'
              )}
            </button>
          </div>
        </div>
        
        {formatLogs.length > 0 && (
          <div className="bg-[#1e293b] text-slate-200 p-4 rounded-xl font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto border-2 border-slate-800 text-left mt-4 custom-scrollbar">
            {formatLogs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-[#657f4d] font-bold">►</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
