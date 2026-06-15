import React, { useState } from 'react';
import { PageConfig, CompanyConfig, StandardConfig, SignatureConfig } from '../types';
import { ChevronRight } from 'lucide-react';

interface Props {
  pages: PageConfig[];
  company: CompanyConfig;
  portraitStandard: StandardConfig;
  landscapeStandard: StandardConfig;
  signatures: SignatureConfig;
}

export default function LivePreviewTab({ pages, company, portraitStandard, landscapeStandard, signatures }: Props) {
  const [previewIndex, setPreviewIndex] = useState(0);

  const activePage = pages[previewIndex] || pages[0];
  const activeStandard = activePage?.orientation === 'landscape' ? landscapeStandard : portraitStandard;

  if (!activePage) return <div className="text-center p-10 font-bold text-slate-400">No pages configured.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-8">
       {/* Left Column: Page Selector */}
       <div className="lg:col-span-3 space-y-4">
          <div className="bg-white/90 p-5 rounded-2xl shadow-sm border border-[#eaeaec] text-left">
             <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-wider border-b pb-3 mb-3">
                Active Page Selector
             </h3>
             <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {pages.map((p, idx) => (
                   <div 
                     key={p.id}
                     onClick={() => setPreviewIndex(idx)}
                     className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all flex items-center justify-between ${
                       previewIndex === idx
                         ? 'border-[#212c46] bg-[#212c46]/5 text-[#212c46] font-black'
                         : 'border-[#eaeaec] bg-white text-slate-500 hover:bg-slate-50'
                     }`}
                   >
                     <div className="min-w-0">
                       <p className="text-[12px] font-black uppercase truncate text-[#212c46]">{p.moduleMenu || 'Untitled Menu'}</p>
                       <p className="text-[10px] text-[#7a8b95] font-bold truncate mt-0.5">{p.reportTitleTh}</p>
                     </div>
                     <ChevronRight size={14} className="shrink-0 text-[#7a8b95]" />
                   </div>
                ))}
             </div>
          </div>
       </div>

       {/* Right Column: Live Preview Render */}
       <div className="lg:col-span-9">
          <div className="bg-slate-100 border p-4 rounded-xl flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11.5px] font-black text-[#212c46] uppercase tracking-widest">
                  LIVE INTERACTIVE PREVIEW
                </span>
             </div>
             <span className="text-[10px] font-black text-slate-500 bg-white border px-2.5 py-1 rounded-lg uppercase">
               {activePage.orientation} Ratio
             </span>
          </div>

          <div className="overflow-x-auto pb-6 relative">
             <div 
               className={`bg-white border-2 border-slate-300 shadow-xl rounded flex flex-col mx-auto relative group text-left ${activePage.orientation === 'landscape' ? 'aspect-[1.414/1] w-[1000px]' : 'aspect-[1/1.414] w-[700px]'}`}
               style={{
                 paddingTop: `${activeStandard.marginTop * 1.6}px`,
                 paddingBottom: `${activeStandard.marginBottom * 1.6}px`,
                 paddingLeft: `${activeStandard.marginLeft * 1.6}px`,
                 paddingRight: `${activeStandard.marginRight * 1.6}px`
               }}
             >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#212c46] via-[#3f809e] to-[#b58c4f]"></div>

                {/* Header Content */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                   <div className="flex items-center gap-4">
                      {company.companyLogo && (
                         <div className="w-[80px] h-[80px] p-2 flex items-center justify-center shrink-0">
                            <img src={company.companyLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                         </div>
                      )}
                      <div className="space-y-1">
                        <h4 className="font-black text-[#212c46] uppercase tracking-tight leading-tight" style={{ fontSize: `${activeStandard.fontCompany}px` }}>
                          {company.companyNameTh}
                        </h4>
                        <p className="font-bold text-slate-700 leading-tight" style={{ fontSize: `${activeStandard.fontCompany * 0.85}px` }}>
                          {company.companyNameEn}
                        </p>
                      </div>
                   </div>
                   <div className="text-right space-y-1 max-w-sm shrink-0">
                     <p className="text-[9.5px] text-slate-800 font-bold leading-relaxed">{company.companyAddressTh}</p>
                     <p className="text-[8.5px] text-slate-500 font-semibold leading-relaxed">{company.companyAddressEn}</p>
                     <p className="text-[8.5px] text-[#3f809e] font-black mt-1 leading-relaxed">
                       TAX ID: {company.taxId} &bull; TEL: {company.companyPhone}
                     </p>
                   </div>
                </div>

                <div className="w-full h-[3px] bg-[#212c46] mb-4"></div>

                <div className="flex justify-between items-center mb-6">
                   <div className="flex flex-col w-[30%]">
                      <span className="font-sans font-black text-slate-400 uppercase tracking-widest leading-tight" style={{ fontSize: `${activeStandard.fontMetaGrid}px` }}>
                         {activePage.moduleMenu}
                      </span>
                   </div>
                   <div className="text-center w-[40%] flex flex-col items-center">
                      <h2 className="font-black text-[#212c46] uppercase" style={{ fontSize: `${activeStandard.fontReportTitle}px` }}>
                         {activePage.reportTitleTh}
                      </h2>
                      <p className="font-bold text-slate-500 uppercase" style={{ fontSize: `${activeStandard.fontReportTitle * 0.85}px` }}>
                         {activePage.reportTitleEn}
                      </p>
                   </div>
                   <div className="text-right font-mono text-slate-500 space-y-0.5 w-[30%]" style={{ fontSize: `${activeStandard.fontMetaGrid * 0.9}px` }}>
                      <div>Doc No: <span className="font-sans font-black text-slate-800">{activePage.documentCode || '-'}</span></div>
                      <div>Rev No: <span className="font-sans font-black text-slate-800">{activePage.revisionNo || '00'}</span></div>
                      <div>Issue Date: <span className="font-sans font-black text-slate-800">{activePage.issueDate || '-'}</span></div>
                   </div>
                </div>

                {/* Body Content Example */}
                <div className="flex-1 space-y-4">
                   <div className="h-[200px] w-full border-2 border-dashed border-slate-200 bg-slate-50 rounded flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[11px]" style={{ fontSize: `${activeStandard.fontContent}px` }}>
                      [ REPORT DATA TABLE / CHARTS RESERVED AREA ]
                   </div>
                </div>

                {/* Signatures & Footer area aligned to bottom */}
                <div className="mt-auto pt-6 border-t border-slate-200 relative">
                   {activePage.showSignatures && (
                      <div className="border border-slate-300 rounded-xl overflow-hidden bg-[#fafbfc] mb-4">
                        <div className="grid grid-cols-3 divide-x divide-slate-300 text-center py-3" style={{ fontSize: `${activeStandard.fontSignature}px` }}>
                           <div className="flex flex-col px-2">
                             <span className="font-black text-slate-600 uppercase mb-4">Prepared By</span>
                             <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto mb-2"></div>
                             <span className="font-black text-[#212c46]">{signatures.preparedByName || 'N/A'}</span>
                             <span className="font-medium text-slate-500">{signatures.preparedByTitle || '-'}</span>
                           </div>
                           <div className="flex flex-col px-2">
                             <span className="font-black text-slate-600 uppercase mb-4">Reviewed By</span>
                             <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto mb-2"></div>
                             <span className="font-black text-[#212c46]">{signatures.reviewedByName || 'N/A'}</span>
                             <span className="font-medium text-slate-500">{signatures.reviewedByTitle || '-'}</span>
                           </div>
                           <div className="flex flex-col px-2">
                             <span className="font-black text-slate-600 uppercase mb-4">Approved By</span>
                             <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto mb-2"></div>
                             <span className="font-black text-[#212c46]">{signatures.approvedByName || 'N/A'}</span>
                             <span className="font-medium text-slate-500">{signatures.approvedByTitle || '-'}</span>
                           </div>
                        </div>
                      </div>
                   )}
                   <div className="flex justify-between items-center text-[#7a8b95] font-black uppercase tracking-wider" style={{ fontSize: `${activeStandard.fontFooter}px` }}>
                      <span>Powered by SMART HR SYSTEM &bull; CONFIDENTIAL DOCUMENT</span>
                      <span>Page 1 of 1</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
