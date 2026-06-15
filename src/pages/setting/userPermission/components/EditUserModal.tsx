import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../../../components/shared/DraggableModal';
import { User, THEME, PERMISSION_LEVELS } from '../types';
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
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (user: User, permissions: any) => void;
}

export default function EditUserModal({ isOpen, onClose, user, onSave }: Props) {
    const [modalStep, setModalStep] = useState(0);
    const [tempPerms, setTempPerms] = useState<any>({});
    const [tempUser, setTempUser] = useState<Partial<User>>({});

    useEffect(() => {
        if (isOpen && user) {
            setModalStep(0);
            setTempPerms(JSON.parse(JSON.stringify(user.permissions || {})));
            setTempUser(JSON.parse(JSON.stringify(user)));
        }
    }, [isOpen, user]);

    if (!isOpen || !user || !tempUser) return null;

    const handleTogglePerm = (moduleId: string, level: number) => {
        if (tempUser.isDev) return;
        setTempPerms((prev: any) => {
            const newPerms = { ...prev };
            if (!newPerms[moduleId]) newPerms[moduleId] = [];
            if (level === 0) {
                newPerms[moduleId] = [];
                return newPerms;
            }
            if (newPerms[moduleId].includes(level)) {
                newPerms[moduleId] = newPerms[moduleId].filter((l: number) => l !== level);
            } else {
                newPerms[moduleId] = [...newPerms[moduleId], level].sort();
            }
            return newPerms;
        });
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[950px]"
            customHeader={
                <div className="bg-[#212c46] px-4 py-3 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-sm overflow-hidden">
                            <img src={tempUser.avatar} className="w-full h-full object-cover" alt={tempUser.name || 'User'} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#d7d7d7] uppercase tracking-widest leading-none">{tempUser.name || 'NEW USER'}</h3>
                            <p className="text-[10px] font-bold text-[#d7d7d7]/70 uppercase tracking-widest mt-1">{tempUser.position || 'POSITION'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-[#932c2e] transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-full"><Icons.X size={16} /></button>
                </div>
            }
        >
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#f8f9fa]">
                    <div className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-[#eaeaec] flex flex-row md:flex-col shrink-0">
                        <div className="hidden md:block px-4 py-4 text-[10px] font-black text-[#7a8b95] uppercase tracking-widest border-b border-[#eaeaec] bg-[#f8f9fa]">Configuration Nodes</div>
                        {[0, 1, 2].map(step => (
                            <button key={step} onClick={()=>setModalStep(step)} className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-left transition-all md:border-l-4 ${modalStep===step ? 'border-b-4 md:border-b-0 border-[#b7a159] bg-[#f8f9fa] text-[#212c46]' : 'border-transparent text-[#7a8b95] hover:bg-[#f8f9fa]/50'}`}>
                                <LucideIcon name={step===0 ? 'User' : 'ShieldCheck'} size={16} color={modalStep===step ? THEME.brightGold : undefined} />
                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">STEP {step+1}: {step===0 ? 'Profile' : step===1 ? 'Visibility' : 'Rights'}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-white">
                        {modalStep === 0 ? (
                            <div className="space-y-4 max-w-xl">
                                <div>
                                    <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Full Name</label>
                                    <input type="text" value={tempUser.name || ''} onChange={e => setTempUser({...tempUser, name: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-4 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Position / Role</label>
                                    <input type="text" value={tempUser.position || ''} onChange={e => setTempUser({...tempUser, position: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-4 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Email Address</label>
                                    <input type="email" value={tempUser.email || ''} onChange={e => setTempUser({...tempUser, email: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-4 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Profile Picture</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-white border border-[#eaeaec] rounded-lg p-3">
                                        <div className="w-16 h-16 rounded-xl bg-[#f8f9fa] border border-[#eaeaec] flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                                            {tempUser.avatar ? (
                                                <img src={tempUser.avatar} className="w-full h-full object-cover" alt="Avatar" />
                                            ) : (
                                                <Icons.User size={24} className="text-[#7a8b95]" />
                                            )}
                                        </div>
                                        <div className="flex-1 w-full space-y-2">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e: any) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (ev) => {
                                                                setTempUser({...tempUser, avatar: ev.target?.result as string});
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    };
                                                    input.click();
                                                }} className="bg-[#f8f9fa] border border-[#eaeaec] text-[#212c46] hover:text-[#a94228] hover:border-[#a94228] py-1.5 px-3 rounded-lg text-[10px] uppercase font-black tracking-widest shadow-sm flex items-center gap-1.5 flex-1 justify-center transition-colors"><Icons.Upload size={12}/> Computer</button>

                                                <button type="button" onClick={() => {
                                                    const Swal = typeof window !== 'undefined' ? (window as any).Swal || null : null;
                                                    if (Swal) {
                                                        Swal.fire({
                                                            title: 'Google Drive / URL',
                                                            input: 'url',
                                                            inputPlaceholder: 'Paste Image URL here...',
                                                            inputAttributes: {
                                                                autocapitalize: 'off'
                                                            },
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Preview',
                                                            confirmButtonColor: '#212c46',
                                                        }).then((result: any) => {
                                                            if (result.isConfirmed && result.value) {
                                                                setTempUser({...tempUser, avatar: result.value});
                                                            }
                                                        });
                                                    } else {
                                                        const url = prompt("Enter Google Drive Image URL or any URL");
                                                        if (url) setTempUser({...tempUser, avatar: url});
                                                    }
                                                }} className="bg-[#f8f9fa] border border-[#eaeaec] text-[#212c46] hover:text-[#a94228] hover:border-[#a94228] py-1.5 px-3 rounded-lg text-[10px] uppercase font-black tracking-widest shadow-sm flex items-center gap-1.5 flex-1 justify-center transition-colors"><Icons.Link size={12}/> URL / Drive</button>
                                            </div>
                                            <input type="text" value={tempUser.avatar || ''} onChange={e => setTempUser({...tempUser, avatar: e.target.value})} placeholder="Or paste image URL here..." className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded border-dashed px-2 py-1.5 text-[10px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] transition-colors" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <input type="checkbox" checked={tempUser.isDev || false} onChange={e => setTempUser({...tempUser, isDev: e.target.checked})} className="w-4 h-4 accent-[#212c46] cursor-pointer" id="isDevCheck" />
                                    <label htmlFor="isDevCheck" className="text-[11px] font-black text-[#212c46] uppercase tracking-widest cursor-pointer">Super Admin (Developer) Privileges</label>
                                </div>
                            </div>
                        ) : (
                        <div className="space-y-3">
                            {SYSTEM_MODULES.map((mod: any) => {
                                const userHasMod = tempPerms[mod.id] && tempPerms[mod.id].length > 0;
                                const isDev = tempUser.isDev;
                                return (
                                    <div key={mod.id} className={`px-4 py-3 rounded-xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${userHasMod || isDev ? 'bg-[#f8f9fa] border-[#b7a159]/50 shadow-sm' : 'bg-white border-[#eaeaec]'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${userHasMod || isDev ? 'bg-[#212c46] text-white border-[#212c46]' : 'bg-[#f8f9fa] text-[#7a8b95] border-[#eaeaec]'}`}>
                                                <LucideIcon name={mod.icon} size={16}/>
                                            </div>
                                            <span className="font-black text-[#212c46] uppercase text-[11px] tracking-widest leading-tight">{mod.label}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 p-1.5 bg-white rounded-lg border border-[#eaeaec] w-full md:w-auto">
                                            {PERMISSION_LEVELS.filter(p => modalStep===1 ? p.level <= 1 : p.level===0 || p.level>=2).map(p => {
                                                const isSelected = isDev || (p.level === 0 && !userHasMod) || (tempPerms[mod.id] && tempPerms[mod.id].includes(p.level));
                                                return (
                                                    <button key={p.level} onClick={()=>handleTogglePerm(mod.id, p.level)} disabled={isDev} className={`flex-1 md:flex-none h-8 px-2.5 rounded-md border flex items-center justify-center gap-1.5 transition-all ${isSelected ? 'bg-[#212c46] text-white border-[#212c46] shadow-sm' : 'bg-white border-transparent text-[#7a8b95] hover:bg-[#f8f9fa]'}`}>
                                                        <LucideIcon name={p.icon} size={12} color={isSelected ? THEME.brightGold : THEME.dustyBlue} />
                                                        {isSelected && <span className="text-[10px] font-black uppercase tracking-widest">{p.label}</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-5 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button onClick={()=>{onSave(tempUser as User, tempPerms); onClose();}} className="bg-[#212c46] text-white px-5 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2"><Icons.Save size={14}/> Save User</button>
                </div>
        </DraggableModal>
    );
}
