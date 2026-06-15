import React, { useState } from 'react';
import { Plus, AlertCircle, FileSearch, FileText, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const THEME = {
    warning: '#a94228',
    skyBlue: '#3f809e',
    c6: '#d1a45f',
    c11: '#99b4aa',
};

export const QuickActions = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
      <div className="relative flex flex-col items-end">
        {isOpen && (
            <div className="absolute bottom-full mb-2 right-0 flex flex-col gap-3 animate-fadeIn origin-bottom">
                {[
                    { label: 'Bulk Upload', icon: Plus, color: THEME.c6, bg: 'white', path: '/certificates/supplier-halal' },
                    { label: 'Review Pending', icon: AlertCircle, color: THEME.warning, bg: 'white', path: '/compliance/tracking' },
                    { label: 'Search Registry', icon: FileSearch, color: THEME.c11, bg: 'white', path: '/certificates/company-halal' },
                    { label: 'Generate Report', icon: FileText, color: THEME.skyBlue, bg: 'white', path: '/reports/compliance' }
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
            className={`w-10 h-10 p-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border hover:opacity-100 ${isOpen ? 'bg-[#1c273e] border-[#1c273e] text-white rotate-90 opacity-100' : 'bg-[#212c46] border-[#1c273e] text-[#d1a45f] opacity-80'}`}
            title="Quick Actions"
        >
            {isOpen ? <X size={16} /> : <Zap size={16} />}
        </button>
      </div>
    );
};
