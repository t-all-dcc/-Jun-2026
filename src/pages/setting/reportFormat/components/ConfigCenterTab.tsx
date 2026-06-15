import React, { useRef, useState } from 'react';
import { CompanyConfig, SignatureConfig, StandardConfig } from '../types';
import { Upload, Trash2, Sliders, FileText, Signature } from 'lucide-react';
import Swal from 'sweetalert2';
import { DEFAULT_LOGO_BASE64 } from '../defaultData';

interface Props {
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
  signatures: SignatureConfig;
  setSignatures: React.Dispatch<React.SetStateAction<SignatureConfig>>;
  portraitStandard: StandardConfig;
  setPortraitStandard: React.Dispatch<React.SetStateAction<StandardConfig>>;
  landscapeStandard: StandardConfig;
  setLandscapeStandard: React.Dispatch<React.SetStateAction<StandardConfig>>;
}

export default function ConfigCenterTab({
  company, setCompany,
  signatures, setSignatures,
  portraitStandard, setPortraitStandard,
  landscapeStandard, setLandscapeStandard
}: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'signatures' | 'portrait' | 'landscape'>('profile');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processLogoFile = (file: File) => {
    if (!file) return;
    if (!file.type.match('image.*')) {
      Swal.fire({
        icon: 'error',
        text: 'กรุณาเลือกเฉพาะไฟล์ภาพมาตรฐานเท่านั้น (PNG, JPG, SVG)',
        confirmButtonColor: '#b00303'
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCompany({ ...company, companyLogo: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processLogoFile(e.dataTransfer.files[0]);
    }
  };

  const renderStandardConfig = (config: StandardConfig, setConfig: React.Dispatch<React.SetStateAction<StandardConfig>>, title: string) => (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-[#eaeaec] pb-3">
         <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-wider">{title}</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f8f9fa] p-6 rounded-2xl border border-[#eaeaec]">
         <div className="col-span-1 md:col-span-2 text-left mb-2">
            <h5 className="font-black text-[#b58c4f] text-[12px] uppercase">1. Paper & Margins (Margin Spacing)</h5>
         </div>
         {['marginTop', 'marginBottom', 'marginLeft', 'marginRight'].map(field => (
            <div key={field} className="flex flex-col text-left">
               <label className="text-[10px] font-black text-slate-500 uppercase mb-2">{field.replace('margin', 'Margin ')} (mm)</label>
               <input 
                  type="number" 
                  value={(config as any)[field]} 
                  onChange={e => setConfig({...config, [field]: parseInt(e.target.value) || 0})}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[12px] font-bold outline-none"
               />
            </div>
         ))}

         <div className="col-span-1 md:col-span-2 text-left mb-2 mt-4">
            <h5 className="font-black text-[#b58c4f] text-[12px] uppercase">2. Fonts Sizing (Typography)</h5>
         </div>
         {['fontCompany', 'fontMetaGrid', 'fontReportTitle', 'fontContent', 'fontSignature', 'fontFooter'].map(field => (
            <div key={field} className="flex flex-col text-left">
               <label className="text-[10px] font-black text-slate-500 uppercase mb-2">
                 {field.replace('font', 'Font ')} (px)
               </label>
               <input 
                  type="range"
                  min="5" max="30"
                  value={(config as any)[field]}
                  onChange={e => setConfig({...config, [field]: parseInt(e.target.value) || 0})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
               />
               <span className="text-right text-[10px] font-black text-[#212c46] mt-1">{(config as any)[field]} px</span>
            </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white border rounded-2xl shadow-sm flex flex-col md:flex-row min-h-[500px]">
       {/* Left Sub-tabs */}
       <div className="w-full md:w-64 bg-slate-50 border-r border-[#eaeaec] p-5 flex flex-col gap-2 shrink-0">
          <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest block px-2 mb-2 text-left">Config Categories</span>
          <button onClick={() => setActiveSubTab('profile')} className={`w-full p-3 rounded-xl text-left font-black text-[11px] uppercase transition-all flex items-center gap-3 ${activeSubTab === 'profile' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#414757] hover:bg-slate-200/60'}`}>
             <FileText size={16} /> 1. Company Profile
          </button>
          <button onClick={() => setActiveSubTab('signatures')} className={`w-full p-3 rounded-xl text-left font-black text-[11px] uppercase transition-all flex items-center gap-3 ${activeSubTab === 'signatures' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#414757] hover:bg-slate-200/60'}`}>
             <Signature size={16} /> 2. Global Signatures
          </button>
          <button onClick={() => setActiveSubTab('portrait')} className={`w-full p-3 rounded-xl text-left font-black text-[11px] uppercase transition-all flex items-center gap-3 ${activeSubTab === 'portrait' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#414757] hover:bg-slate-200/60'}`}>
             <Sliders size={16} /> 3. Portrait Standard
          </button>
          <button onClick={() => setActiveSubTab('landscape')} className={`w-full p-3 rounded-xl text-left font-black text-[11px] uppercase transition-all flex items-center gap-3 ${activeSubTab === 'landscape' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#414757] hover:bg-slate-200/60'}`}>
             <Sliders size={16} /> 4. Landscape Standard
          </button>
       </div>

       {/* Content Area */}
       <div className="flex-1 p-6 md:p-8 bg-white overflow-y-auto max-h-[700px] custom-scrollbar">
          {activeSubTab === 'profile' && (
             <div className="space-y-6 animate-fadeIn text-left">
                <div className="border-b border-[#eaeaec] pb-3">
                   <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-wider">Company Profile</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#f8f9fa] p-5 rounded-2xl border border-[#eaeaec]">
                  <div className="space-y-2 text-left">
                    <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">Logo File Stream</label>
                    <div 
                      onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all min-h-[110px] text-center ${dragActive ? 'border-[#3f809e] bg-[#3f809e]/5' : 'border-slate-300 hover:border-[#b58c4f] bg-white'}`}
                    >
                      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={e => {if(e.target.files) processLogoFile(e.target.files[0])}} />
                      <Upload size={16} className="text-[#3f809e]" />
                      <p className="text-[11px] font-black text-[#212c46]">Drag or Click logo</p>
                    </div>
                    <button onClick={() => setCompany({...company, companyLogo: DEFAULT_LOGO_BASE64})} className="text-[10px] font-black text-rose-700 uppercase hover:underline flex items-center gap-1">
                       <Trash2 size={11} /> Reset to standard emblem
                    </button>
                  </div>
                  <div className="bg-[#f8f9fa] border border-[#eaeaec] p-4 rounded-xl flex items-center justify-center">
                     <div className="w-24 h-24 bg-white border rounded-xl flex items-center justify-center p-2.5 shadow-inner">
                       <img src={company.companyLogo} alt="Preview Logo" className="max-w-full max-h-full object-contain" />
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['companyNameTh', 'companyNameEn', 'taxId', 'companyPhone', 'companyAddressTh', 'companyAddressEn', 'companyEmail'] as const).map(field => (
                     <div key={field} className={field.includes('Address') ? "col-span-1 md:col-span-2" : ""}>
                        <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <input
                          type="text"
                          value={company[field]}
                          onChange={(e) => setCompany({...company, [field]: e.target.value})}
                          className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                        />
                     </div>
                  ))}
                </div>
             </div>
          )}

          {activeSubTab === 'signatures' && (
             <div className="space-y-6 animate-fadeIn text-left">
                <div className="border-b border-[#eaeaec] pb-3">
                   <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-wider">Global Signatures Setup</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f8f9fa] p-5 rounded-2xl border border-[#eaeaec]">
                  {(['preparedByName', 'preparedByTitle', 'reviewedByName', 'reviewedByTitle', 'approvedByName', 'approvedByTitle'] as const).map((field, idx) => (
                     <div key={field}>
                        <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <input
                          type="text"
                          value={signatures[field]}
                          onChange={(e) => setSignatures({...signatures, [field]: e.target.value})}
                          className="w-full bg-white border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                        />
                     </div>
                  ))}
                </div>
             </div>
          )}

          {activeSubTab === 'portrait' && renderStandardConfig(portraitStandard, setPortraitStandard, 'Portrait Template Standard')}
          {activeSubTab === 'landscape' && renderStandardConfig(landscapeStandard, setLandscapeStandard, 'Landscape Template Standard')}
       </div>
    </div>
  );
}
