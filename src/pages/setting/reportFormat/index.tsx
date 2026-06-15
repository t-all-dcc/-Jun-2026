import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Settings, Eye, Sliders, Layers
} from 'lucide-react';
import UserGuideButton from '../../../components/shared/UserGuideButton';
import KpiCard from '../../../components/shared/KpiCard';
import PageFormatTab from './components/PageFormatTab';
import ConfigCenterTab from './components/ConfigCenterTab';
import LivePreviewTab from './components/LivePreviewTab';
import { PageConfig, CompanyConfig, SignatureConfig, StandardConfig } from './types';
import { 
  DEFAULT_PAGES, 
  DEFAULT_COMPANY_CONFIG, 
  DEFAULT_SIGNATURE_CONFIG, 
  DEFAULT_PORTRAIT_STANDARD, 
  DEFAULT_LANDSCAPE_STANDARD 
} from './defaultData';

export default function ReportFormat() {
  const [activeTab, setActiveTab] = useState<'pages' | 'config' | 'preview'>('pages');

  // Load States from Local Storage
  const [pages, setPages] = useState<PageConfig[]>(() => {
    const d = localStorage.getItem('cfg_report_pages_v2'); return d ? JSON.parse(d) : DEFAULT_PAGES;
  });
  const [company, setCompany] = useState<CompanyConfig>(() => {
    const d = localStorage.getItem('cfg_report_company_v2'); return d ? JSON.parse(d) : DEFAULT_COMPANY_CONFIG;
  });
  const [signatures, setSignatures] = useState<SignatureConfig>(() => {
    const d = localStorage.getItem('cfg_report_signatures_v2'); return d ? JSON.parse(d) : DEFAULT_SIGNATURE_CONFIG;
  });
  const [portraitStandard, setPortraitStandard] = useState<StandardConfig>(() => {
    const d = localStorage.getItem('cfg_report_portrait_v2'); return d ? JSON.parse(d) : DEFAULT_PORTRAIT_STANDARD;
  });
  const [landscapeStandard, setLandscapeStandard] = useState<StandardConfig>(() => {
    const d = localStorage.getItem('cfg_report_landscape_v2'); return d ? JSON.parse(d) : DEFAULT_LANDSCAPE_STANDARD;
  });

  // Save States to Local Storage
  useEffect(() => {
    localStorage.setItem('cfg_report_pages_v2', JSON.stringify(pages));
    localStorage.setItem('cfg_report_company_v2', JSON.stringify(company));
    localStorage.setItem('cfg_report_signatures_v2', JSON.stringify(signatures));
    localStorage.setItem('cfg_report_portrait_v2', JSON.stringify(portraitStandard));
    localStorage.setItem('cfg_report_landscape_v2', JSON.stringify(landscapeStandard));
  }, [pages, company, signatures, portraitStandard, landscapeStandard]);

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION - Parity layout styling conforming to rules */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <FileSpreadsheet size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      REPORT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">FORMATS</span>
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                      ISO & REGULATORY COMPLIANCE EXPORT TEMPLATE SYSTEM
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="flex bg-white/50 p-1 rounded-xl border border-white/60 shadow-inner">
                  <button
                    onClick={() => setActiveTab('pages')}
                    className={`px-4 py-2 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                      activeTab === 'pages' ? 'bg-[#212c46] text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-[#212c46]'
                    }`}
                  >
                    <Layers size={14} /> PAGE FORMAT
                  </button>
                  <button
                    onClick={() => setActiveTab('config')}
                    className={`px-4 py-2 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                      activeTab === 'config' ? 'bg-[#212c46] text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-[#212c46]'
                    }`}
                  >
                    <Settings size={14} /> CONFIG CENTER
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                      activeTab === 'preview' ? 'bg-[#212c46] text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-[#212c46]'
                    }`}
                  >
                    <Eye size={14} /> LIVE PREVIEW
                  </button>
              </div>
          </div>
      </div>

      {/* CONTENT SECTION - Spaced perfectly inside standard wrapper */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        
        {/* KPI STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 shrink-0">
            <KpiCard label="Total ISO Pages" value={`${pages.length} Pages`} icon={Layers} color="#1e3347" description="Active report configurations" />
            <KpiCard label="Portrait Configs" value={`${portraitStandard.paperSize}`} icon={Sliders} color="#53694d" description="Vertical orientation defaults" />
            <KpiCard label="Landscape Configs" value={`${landscapeStandard.paperSize}`} icon={Sliders} color="#7397ab" description="Horizontal orientation defaults" />
            <KpiCard label="Global Signatures" value="3 Levels" icon={Settings} color="#b48b21" description="Prepare, Review, Approve" />
        </div>

        <div className="flex-1 overflow-y-auto mb-4 pb-4 custom-scrollbar">
           {activeTab === 'pages' && <PageFormatTab pages={pages} setPages={setPages} />}
           {activeTab === 'config' && (
             <ConfigCenterTab 
                company={company} setCompany={setCompany}
                signatures={signatures} setSignatures={setSignatures}
                portraitStandard={portraitStandard} setPortraitStandard={setPortraitStandard}
                landscapeStandard={landscapeStandard} setLandscapeStandard={setLandscapeStandard}
             />
           )}
           {activeTab === 'preview' && (
             <LivePreviewTab 
                pages={pages} company={company} 
                portraitStandard={portraitStandard} landscapeStandard={landscapeStandard}
                signatures={signatures}
             />
           )}
        </div>
      </div>
    </div>
  );
}
