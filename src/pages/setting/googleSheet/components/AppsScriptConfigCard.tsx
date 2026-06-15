import React from 'react';
import { Globe, Key, Save } from 'lucide-react';

interface Props {
  appsScriptUrl: string;
  setAppsScriptUrl: (val: string) => void;
  appsScriptApiKey: string;
  setAppsScriptApiKey: (val: string) => void;
  handleSaveAppsScriptConfig: () => void;
}

export default function AppsScriptConfigCard({
  appsScriptUrl,
  setAppsScriptUrl,
  appsScriptApiKey,
  setAppsScriptApiKey,
  handleSaveAppsScriptConfig
}: Props) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-2xl text-[#3f809e] shrink-0 shadow-sm">
          <Globe size={24} />
        </div>
        <div className="text-left">
          <h3 className="text-[15px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
            <span>Apps Script Web App Connection</span>
          </h3>
          <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1 leading-relaxed">
            Update Apps Script link and target API Key.
          </p>
        </div>
      </div>
      
      <div className="space-y-4 bg-[#f8f9fa] p-6 rounded-2xl border border-[#eaeaec]">
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block flex items-center gap-2">
            <Globe size={14} className="text-[#3f809e]" />
            <span>Apps Script Web App URL</span>
          </label>
          <input
            type="text"
            value={appsScriptUrl}
            onChange={(e) => setAppsScriptUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full bg-white border border-[#eaeaec] rounded-xl px-4 py-3 text-[11px] font-bold font-mono outline-none focus:border-[#b58c4f] shadow-sm text-[#212c46]"
          />
        </div>

        <div className="flex flex-col gap-1.5 text-left mt-4">
          <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block flex items-center gap-2">
            <Key size={14} className="text-[#b58c4f]" />
            <span>Apps Script API Key (Security external Token)</span>
          </label>
          <input
            type="text"
            value={appsScriptApiKey}
            onChange={(e) => setAppsScriptApiKey(e.target.value)}
            placeholder="API Key..."
            className="w-full bg-white border border-[#eaeaec] rounded-xl px-4 py-3 text-[11px] font-bold font-mono outline-none focus:border-[#b58c4f] shadow-sm text-[#212c46]"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveAppsScriptConfig}
            className="px-8 py-2.5 bg-[#212c46] hover:bg-[#3f809e] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md transition-all flex items-center gap-2 transform active:scale-95 duration-100 cursor-pointer text-xs"
          >
            <Save size={16} />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
