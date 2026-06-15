import React from 'react';
import * as Icons from 'lucide-react';
import { SYSTEM_MODULES } from '../../../../config/modules';

const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
const LucideIcon = ({ name, size = 16, className = "", color, style, strokeWidth = 2.5 }: any) => {
    if (!name) return null;
    if (typeof name !== 'string') {
        const IconComponent = name as React.ElementType;
        return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={strokeWidth} />;
    }
    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons[pascalName as keyof typeof Icons] as React.ElementType) || (Icons.CircleHelp as React.ElementType);
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={strokeWidth} />;
};

interface Props {
  confidentialityMap: any;
  toggleConfidentiality: (id: string) => void;
  expandedModules: any;
  toggleExpand: (id: string) => void;
}

export default function GlobalRegistryTab({ confidentialityMap, toggleConfidentiality, expandedModules, toggleExpand }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ACCESS POLICIES CARD */}
        <div className="lg:col-span-4 bg-white/90 p-6 rounded-3xl shadow-lg border border-[#eaeaec] animate-fadeIn h-fit">
            <h3 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-4 mb-6">
                <Icons.ShieldAlert size={20} className="text-[#b7a159]" /> ACCESS POLICIES
            </h3>
            <div className="space-y-5">
                <div className="p-5 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                    <div className="flex items-center gap-2 text-[#4d87a8] font-black text-[12px] uppercase tracking-widest mb-2"><Icons.Eye size={18}/> Public Node</div>
                    <p className="text-[12px] text-[#414757] font-bold leading-relaxed">โมดูลมาตรฐาน: พนักงานจะได้รับสิทธิ์อ่าน (Viewer) เบื้องต้นโดยอัตโนมัติ</p>
                </div>
                <div className="p-5 bg-[#932c2e]/10 border border-[#932c2e]/30 rounded-2xl shadow-sm hover:border-[#932c2e] transition-colors">
                    <div className="flex items-center gap-2 text-[#932c2e] font-black text-[12px] uppercase tracking-widest mb-2"><Icons.Lock size={18}/> Restricted Area</div>
                    <p className="text-[12px] text-[#414757] font-bold leading-relaxed">พื้นที่จำกัด: เมนูจะถูกซ่อนจากผู้ใช้ทั่วไป ต้องได้รับสิทธิ์แบบเจาะจงรายบุคคลเท่านั้น</p>
                </div>
            </div>
        </div>

        {/* GLOBAL MODULE REGISTRY (SYNCED) */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col h-full min-h-0">
            <div className="p-6 bg-[#f8f9fa] border-b border-[#eaeaec]">
                <h4 className="text-[14px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3"><Icons.ListTree size={20} className="text-[#b7a159]"/> GLOBAL MODULE REGISTRY</h4>
            </div>
            <div className="p-6 space-y-3 custom-scrollbar">
                {SYSTEM_MODULES.map((mod: any) => (
                    <div key={mod.id} className="space-y-2">
                        <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${confidentialityMap[mod.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/30 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[mod.id] ? 'bg-[#932c2e]/20 text-[#932c2e] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                    <LucideIcon name={mod.icon} size={22}/>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-[#212c46] text-[13px] uppercase tracking-widest">{mod.label}</span>
                                        {mod.subItems && (
                                            <button onClick={() => toggleExpand(mod.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
                                                <Icons.ChevronDown size={18} className={`transition-transform duration-300 ${expandedModules[mod.id] ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}
                                    </div>
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${confidentialityMap[mod.id] ? 'text-[#932c2e]' : 'text-[#7a8b95]'}`}>Module {confidentialityMap[mod.id] ? 'Restricted' : 'Public'}</span>
                                </div>
                            </div>
                            <button onClick={()=>toggleConfidentiality(mod.id)} className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-90 ${confidentialityMap[mod.id] ? 'bg-[#932c2e] text-white' : 'bg-white text-[#7a8b95] border border-[#eaeaec] hover:bg-[#f8f9fa]'}`}>
                                {confidentialityMap[mod.id] ? <Icons.Lock size={18}/> : <Icons.Eye size={18}/>}
                            </button>
                        </div>

                        {/* SUB-ITEMS CONFIDENTIALITY */}
                        {mod.subItems && expandedModules[mod.id] && (
                            <div className="ml-16 space-y-2 animate-fadeIn pr-4 pb-4">
                                {mod.subItems.map((sub: any) => (
                                    <div key={sub.id} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border bg-white transition-all ${confidentialityMap[sub.id] ? 'border-[#932c2e]/40 bg-[#932c2e]/5 shadow-inner' : 'border-[#d7d7d7] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${confidentialityMap[sub.id] ? 'bg-[#932c2e] animate-pulse' : 'bg-[#b7a159]'}`}></div>
                                            <span className="text-[12px] font-black text-[#212c46] uppercase tracking-widest">{sub.label}</span>
                                        </div>
                                        <button onClick={()=>toggleConfidentiality(sub.id)} className={`p-2 rounded-lg transition-all ${confidentialityMap[sub.id] ? 'bg-[#932c2e]/10 text-[#932c2e]' : 'text-[#7a8b95] hover:bg-[#f8f9fa]'}`}>
                                            {confidentialityMap[sub.id] ? <Icons.Lock size={16}/> : <Icons.Eye size={16}/>}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
