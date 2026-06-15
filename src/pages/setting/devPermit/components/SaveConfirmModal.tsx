import React from 'react';
import { createPortal } from 'react-dom';
import { Save, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SaveConfirmModal({ isOpen, onClose, onConfirm }: Props) {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#212c46]/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden relative border border-[#b7a159]">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-[#b7a159]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#b7a159]/40">
            <Save size={32} className="text-[#b7a159]" />
          </div>
          <h3 className="text-xl font-black text-[#212c46] uppercase tracking-widest mb-2">Save Configuration?</h3>
          <p className="text-[12px] text-[#7a8b95] font-medium leading-relaxed">
            การเปลี่ยนแปลงนี้จะส่งผลต่อเมนู Sidebar และ User Permission ของบุคลากรทุกคนในระบบแบบ Real-time ต้องการดำเนินการต่อหรือไม่?
          </p>
        </div>
        <div className="p-6 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-center gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="px-6 py-2.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7] transition-all active:scale-95 shadow-sm"
          >
            CANCEL
          </button>
          <button 
            type="button"
            onClick={() => { onConfirm(); onClose(); }} 
            className="px-8 py-2.5 bg-[#212c46] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2 active:scale-95 border border-[#212c46] cursor-pointer"
          >
            <CheckCircle2 size={16} /> Confirm & Sync
          </button>
        </div>
      </div>
    </div>, 
    document.body
  );
}
