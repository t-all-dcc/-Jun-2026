import React, { useState } from 'react';
import { UserPlus, CalendarDays, Users, FileText, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const THEME = {
    warning: '#cb5d3d',
    skyBlue: '#7397ab',
    c6: '#b3afa4',
    c11: '#5d7abc',
};

export const QuickActions = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
      <div className="relative flex flex-col items-end">
        {isOpen && (
            <div className="absolute bottom-full mb-2 right-0 flex flex-col gap-3 animate-fadeIn origin-bottom">
                {[
                    { label: 'Add Onboarding', icon: UserPlus, color: THEME.c6, bg: 'white', path: '/hr/employees/onboarding' },
                    { label: 'Pending Leaves', icon: CalendarDays, color: THEME.warning, bg: 'white', path: '/hr/leave/requests' },
                    { label: 'Emp Directory', icon: Users, color: THEME.c11, bg: 'white', path: '/hr/employees/directory' },
                    { label: 'JD Repository', icon: FileText, color: THEME.skyBlue, bg: 'white', path: '/hr/jd' }
                ].map((action, i) => (
                    <button onClick={() => { setIsOpen(false); navigate(action.path); }} key={i} className="flex items-center gap-3 group justify-end">
                        <span className="bg-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#212c46] shadow-md border border-[#f3f3f1] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {action.label}
                        </span>
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-[#f3f3f1]" 
                            style={{ backgroundColor: action.bg, color: action.color }}
                        >
                            <action.icon size={20} />
                        </div>
                    </button>
                ))}
            </div>
        )}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-10 h-10 p-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border hover:opacity-100 ${isOpen ? 'bg-[#1c273e] border-[#1c273e] text-white rotate-90 opacity-100' : 'bg-[#212c46] border-[#1c273e] text-[#b48b21] opacity-80'}`}
            title="HR Quick Actions"
        >
            {isOpen ? <X size={16} /> : <Zap size={16} />}
        </button>
      </div>
    );
};
