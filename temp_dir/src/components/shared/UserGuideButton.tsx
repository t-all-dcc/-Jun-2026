import React from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';

interface UserGuideButtonProps {
    onClick: () => void;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
}

export default function UserGuideButton({ 
    onClick, 
    className = "bg-white/80 text-slate-500 hover:bg-slate-800 hover:text-white",
    iconClassName = "text-current",
    textClassName = "text-current"
}: UserGuideButtonProps) {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <button 
            onClick={onClick} 
            className={`fixed right-0 top-[80px] py-8 px-1.5 bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group ${className}`}
        >
            <HelpCircle size={18} className={`shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white ${iconClassName}`} />
            <div 
                style={{ writingMode: 'vertical-rl' }} 
                className={`text-[11px] font-black tracking-[0.3em] rotate-180 whitespace-nowrap uppercase transition-colors ${textClassName}`}
            >
                USER GUIDE
            </div>
        </button>,
        document.body
    );
}
