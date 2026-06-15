import React from 'react';
import * as Icons from 'lucide-react';
import { User, PERMISSION_LEVELS, THEME } from '../types';
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

const PermissionBadges = ({ user, moduleId }: { user: User; moduleId: string }) => {
    let perms: number[] = [];
    let isFullAccess = user.isDev || (user.permissions && user.permissions['*']);
    
    if (isFullAccess) {
        perms = [1, 2, 3, 4];
    } else if (user.permissions && user.permissions[moduleId]) {
        perms = user.permissions[moduleId];
    }

    if (!perms || perms.length === 0) {
        return <span className="text-[#7a8b95] font-black text-[14px] opacity-50">-</span>;
    }

    return (
        <div className="flex items-center justify-center gap-1.5">
            {perms.sort().map((level: number) => {
                const permInfo = PERMISSION_LEVELS.find(p => p.level === level);
                if (!permInfo || level === 0) return null;
                
                const IconComp = (isFullAccess ? Icons.Check : (Icons[kebabToPascal(permInfo.icon) as keyof typeof Icons] || Icons.Circle)) as React.ElementType;

                return (
                    <div key={level} className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm border" style={{ backgroundColor: permInfo.color + '15', borderColor: permInfo.color + '30', color: permInfo.color }}>
                        <IconComp size={12} strokeWidth={isFullAccess ? 4 : 2.5} />
                    </div>
                );
            })}
        </div>
    );
};

interface Props {
  viewMode: string;
  setViewMode: (mode: string) => void;
  search: string;
  setSearch: (val: string) => void;
  setEditModal: (val: any) => void;
  currentData: User[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function StaffAccessTab({
    viewMode, setViewMode, search, setSearch, setEditModal, currentData, currentPage, totalPages, setCurrentPage
}: Props) {
    return (
        <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col animate-fadeIn">
            <div className="px-8 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex bg-[#f8f9fa] border border-[#eaeaec] p-1 rounded-full shadow-sm inline-flex">
                        <button onClick={()=>setViewMode('list')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${viewMode==='list'?'bg-[#212c46] text-[#d7d7d7] shadow-md':'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.List size={14}/> List View
                        </button>
                        <button onClick={()=>setViewMode('matrix')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${viewMode==='matrix'?'bg-[#212c46] text-[#d7d7d7] shadow-md':'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.LayoutGrid size={14}/> Summary Matrix
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Icons.Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search personnel..." className="w-full pl-12 pr-6 py-2.5 text-[12px] border border-[#eaeaec] rounded-full font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46]" />
                    </div>
                    <button onClick={()=>setEditModal({isOpen: true, user: { id: Date.now(), name: 'NEW USER', position: 'POSITION', email: '', avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', isDev: false, permissions: {} }})} className="bg-[#212c46] text-white px-6 py-2.5 rounded-full font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2 shrink-0 border border-[#212c46]">
                        <Icons.UserPlus size={16} /> New User
                    </button>
                </div>
            </div>

            <div className="overflow-auto custom-scrollbar">
                {viewMode === 'list' ? (
                    <table className="w-full text-left font-sans border-collapse">
                        <thead className="bg-[#212c46] text-white">
                            <tr className="border-b-2 border-[#b7a159]">
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Personnel Identity</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Responsibility Node</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">E-Mail Channel</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center">Authorization</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-right">Modify</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaeaec]">
                            {currentData.map(u => (
                                <tr key={u.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                    <td className="py-3 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full border-2 border-[#eaeaec] overflow-hidden shrink-0 group-hover:border-[#b7a159] shadow-sm"><img src={u.avatar} alt="avatar" className="w-full h-full object-cover"/></div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[#212c46] text-[13px] tracking-tight">{u.name}</span>
                                                    {u.isDev && <span className="bg-[#b00303] text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-widest font-black shadow-sm">Super Admin</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6"><span className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest bg-white border border-[#eaeaec] px-2.5 py-1 rounded-md shadow-sm">{u.position}</span></td>
                                    <td className="py-3 px-6 text-[#7a8b95] text-[12px] font-medium font-mono">{u.email}</td>
                                    <td className="py-3 px-6 text-center">
                                        <span className="text-[11px] font-black text-[#b7a159] uppercase tracking-widest shadow-sm border border-[#b7a159]/20 bg-[#b7a159]/5 px-3 py-1.5 rounded-xl">{u.isDev || (u.permissions && u.permissions['*']) ? 'Full Stack Access' : `${Object.keys(u.permissions||{}).length} Modules Access`}</span>
                                    </td>
                                    <td className="py-3 px-6 text-right">
                                        <button onClick={()=>setEditModal({isOpen: true, user: u})} className="p-2.5 bg-white text-[#7a8b95] border border-[#eaeaec] hover:border-[#b7a159] hover:text-[#b7a159] rounded-xl shadow-sm transition-all inline-flex items-center gap-2 active:scale-95"><Icons.Edit3 size={15} /> <span className="text-[10px] uppercase font-black tracking-widest">EDIT ROOT</span></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full text-center border-collapse">
                        <thead className="bg-[#212c46] text-white">
                            <tr className="border-b-2 border-[#b7a159]">
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-left sticky left-0 z-10 bg-[#212c46] min-w-[250px] shadow-[2px_0_5px_rgba(0,0,0,0.1)]">Personnel Matrix</th>
                                {SYSTEM_MODULES.map((mod: any) => (
                                    <th key={mod.id} className="py-4 px-3 font-black tracking-widest text-[10px] min-w-[80px]">
                                        <div className="flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 uppercase">
                                            <LucideIcon name={mod.icon} size={16} />
                                            <span className="writing-vertical truncate h-16">{mod.label}</span>
                                        </div>
                                    </th>
                                ))}
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] border-l border-white/20 whitespace-nowrap">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaeaec] bg-white">
                            {currentData.map(u => (
                                <tr key={u.id} className="hover:bg-[#f8f9fa] transition-colors">
                                    <td className="py-3 px-6 text-left sticky left-0 z-10 bg-white group-hover:bg-[#f8f9fa] border-r border-[#eaeaec] shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#212c46] text-[12px] tracking-tight">{u.name}</span>
                                            <span className="text-[10px] font-black font-mono text-[#7a8b95] uppercase truncate mt-0.5">{u.position}</span>
                                        </div>
                                    </td>
                                    {SYSTEM_MODULES.map((mod: any) => (
                                        <td key={mod.id} className="py-3 px-3">
                                            <PermissionBadges user={u} moduleId={mod.id} />
                                        </td>
                                    ))}
                                    <td className="py-3 px-4 border-l border-[#eaeaec]">
                                        <button onClick={()=>setEditModal({isOpen: true, user: u})} className="w-8 h-8 flex items-center justify-center bg-[#f8f9fa] hover:bg-[#212c46] text-[#7a8b95] hover:text-white border border-[#eaeaec] rounded-lg shadow-sm mx-auto transition-colors"><Icons.Settings2 size={14}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {currentData.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-[#7a8b95] bg-white">
                        <Icons.SearchX size={48} className="text-[#eaeaec] mb-4"/>
                        <p className="font-black uppercase tracking-widest text-[14px]">No Personnel Evaluated</p>
                        <p className="text-[11px] font-bold mt-1">Try to rethink your search strategy</p>
                    </div>
                )}
            </div>
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-[#eaeaec] bg-[#f8f9fa] flex items-center justify-between shrink-0">
                    <span className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)} className="p-2 border border-[#eaeaec] rounded-lg bg-white disabled:opacity-50 text-[#212c46] hover:bg-[#eaeaec] transition-colors"><Icons.ChevronLeft size={16}/></button>
                        <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)} className="p-2 border border-[#eaeaec] rounded-lg bg-white disabled:opacity-50 text-[#212c46] hover:bg-[#eaeaec] transition-colors"><Icons.ChevronRight size={16}/></button>
                    </div>
                </div>
            )}
        </div>
    );
}
