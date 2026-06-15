import React from 'react';
import { RefreshCw, Clock, Database, Play } from 'lucide-react';
import { SyncStatusBadge, SyncState } from '../../../../components/shared/SyncStatusBadge';

interface Props {
  syncConfig: Record<string, boolean>;
  sheetStatuses: Record<string, SyncState>;
  syncInterval: string;
  setSyncInterval: (val: string) => void;
  handleToggleSync: (sheetName: string, value: boolean) => void;
  handleTestConnection: (sheetName: string) => void;
}

export default function SyncModuleCards({
  syncConfig,
  sheetStatuses,
  syncInterval,
  setSyncInterval,
  handleToggleSync,
  handleTestConnection
}: Props) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eaeaec] shadow-sm space-y-4">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shrink-0 shadow-sm">
          <RefreshCw size={20} />
        </div>
        <div className="text-left">
          <h3 className="text-[14px] sm:text-[16px] font-black text-[#212c46] uppercase tracking-wider flex items-center gap-2">
            <span>Background Auto-Sync</span>
          </h3>
          <p className="text-[12px] font-bold text-[#7a8b95] mt-1 leading-relaxed">
            การตั้งค่าแผนงานเชื่อมโยงไปยัง Google Sheets
          </p>
        </div>
      </div>
      
      <div className="bg-slate-50/50 p-4 rounded-xl border border-[#eaeaec]/60 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-wider">Automated Sync Interval</h4>
          <p className="text-[10px] font-bold text-[#7a8b95] mt-1">ตั้งค่าความถี่ในการซิงค์ข้อมูลเบื้องหลังอัตโนมัติ</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Clock size={16} className="text-[#3f809e] hidden sm:block" />
          <select 
            value={syncInterval}
            onChange={(e) => setSyncInterval(e.target.value)}
            className="bg-white border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] focus:outline-none focus:border-[#3f809e] shadow-sm cursor-pointer w-full sm:w-auto"
          >
            <option value="15m">Every 15 minutes</option>
            <option value="30m">Every 30 minutes</option>
            <option value="1h">Hourly</option>
            <option value="12h">Every 12 hours</option>
            <option value="24h">Daily</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-50/50 p-4 rounded-xl border border-[#eaeaec]/60 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(syncConfig).map(([sheetName, isEnabled]) => {
            const status = sheetStatuses[sheetName];
            return (
              <div 
                key={sheetName} 
                className="flex flex-col gap-3 p-4 bg-white border border-[#eaeaec] rounded-xl shadow-sm transition-all hover:border-[#b58c4f]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database size={16} className={isEnabled ? "text-emerald-500" : "text-slate-300"} />
                    <span className={`text-[12px] font-black uppercase tracking-wider ${isEnabled ? "text-[#212c46]" : "text-slate-400"}`}>
                      {sheetName}
                    </span>
                    
                    {/* Status Badges */}
                    <SyncStatusBadge status={status || 'idling'} className="hidden sm:inline-flex" />
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isEnabled}
                      onChange={(e) => handleToggleSync(sheetName, e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => handleTestConnection(sheetName)} 
                    disabled={status === 'testing'}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#3f809e] hover:text-white border-[#3f809e] border hover:bg-[#3f809e] transition-all flex items-center gap-1.5 px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {status === 'testing' ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                    Test Connection
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
