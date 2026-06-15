import React, { useRef } from 'react';
import { DraggableModal } from './DraggableModal';
import { 
  Award, 
  Printer, 
  Download, 
  ShieldCheck, 
  Calendar, 
  Hash, 
  User, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle,
  FileCheck2,
  FileText
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CertificatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cert: any | null;
  type: 'halal' | 'ms';
}

export function CertificatePreviewModal({
  isOpen,
  onClose,
  cert,
  type
}: CertificatePreviewModalProps) {
  const { t } = useLanguage();
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!cert) return null;

  const isHalal = type === 'halal';
  
  // Calculate status
  const today = new Date('2026-05-15'); // matching system TODAY
  const expiry = new Date(cert.expiryDate || '');
  const diffTime = expiry.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let status: 'valid' | 'expiring' | 'expired' = 'valid';
  if (daysRemaining <= 0) {
    status = 'expired';
  } else if (daysRemaining <= 30) {
    status = 'expiring';
  }

  const handlePrint = () => {
    const printContent = printAreaRef.current?.innerHTML;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { background: white; color: black; font-family: system-ui, sans-serif; }
        .no-print { display: none !important; }
        .print-card { border: 2px solid #b58c4f !important; padding: 40px !important; box-shadow: none !important; }
      }
    `;
    
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FileCheck2 size={18} className="text-[#d1a45f]" />
          <span className="text-xs font-black text-[#111f42] uppercase tracking-[0.1em]">
            {isHalal 
              ? t('Halal Certificate Preview', 'ตัวอย่างใบรับรองฮาลาล') 
              : t('Standard MS Certificate Preview', 'ตัวอย่างใบรับรองมาตรฐาน MS')}
          </span>
        </div>
      }
      width="max-w-3xl"
    >
      <div className="flex flex-col h-full bg-slate-50 overflow-y-auto max-h-[80vh]">
        {/* Certificate Card Container */}
        <div className="p-6 flex-1 flex justify-center items-center">
          <div 
            ref={printAreaRef}
            className="print-card w-full max-w-2xl bg-white rounded-2xl shadow-xl border-4 border-[#d1a45f]/20 p-8 relative overflow-hidden font-sans select-none"
            style={{
              backgroundImage: 'radial-gradient(#d1a45f06 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* Elegant Border Accents */}
            <div className="absolute inset-2 border border-[#d1a45f]/30 rounded-lg pointer-events-none"></div>
            <div className="absolute inset-3 border-2 border-[#d1a45f]/10 rounded-lg pointer-events-none"></div>

            {/* Status Stamp Watermark */}
            <div className="absolute -right-8 -top-8 w-44 h-44 pointer-events-none select-none opacity-10 flex items-center justify-center rotate-[25deg]">
              {status === 'valid' && (
                <div className="border-[8px] border-green-600 rounded-full px-6 py-4 text-center font-black text-[22px] text-green-600 tracking-wider uppercase">
                  ACTIVE / VALID
                </div>
              )}
              {status === 'expiring' && (
                <div className="border-[8px] border-amber-500 rounded-full px-6 py-4 text-center font-black text-[20px] text-amber-500 tracking-wider uppercase">
                  WARNING
                </div>
              )}
              {status === 'expired' && (
                <div className="border-[8px] border-red-600 rounded-full px-6 py-4 text-center font-black text-[22px] text-red-600 tracking-wider uppercase">
                  EXPIRED
                </div>
              )}
            </div>

            {/* Header Logos & Title */}
            <div className="text-center space-y-3 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-50 border border-[#d1a45f]/30 shadow-md">
                <Award size={36} className="text-[#d1a45f]" />
              </div>
              <div>
                <h1 className="font-serif text-[24px] font-bold text-[#111f42] uppercase tracking-widest">
                  {isHalal ? 'Halal Certification Authority' : 'Management Systems Certification'}
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {isHalal ? 'OFFICIAL CONFORMANCE COMPLIANCE CREDENTIAL' : 'ACC_REGISTRY_VERIFIED_DOCUMENTATION'}
                </p>
              </div>
              <div className="h-[2px] bg-gradient-to-r from-transparent via-[#d1a45f] to-transparent my-4"></div>
            </div>

            {/* Body Content */}
            <div className="mt-6 space-y-6 text-center relative z-10 px-4">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                This is to certify that the organization product formulation & documentation of
              </p>
              
              <div>
                <h2 className="text-[20px] font-extrabold text-[#111f42] tracking-tight">
                  {cert.supplier}
                </h2>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-slate-500 font-medium text-[11px] uppercase tracking-wide">
                  <Globe size={12} className="text-[#3f809e]" />
                  <span>Origin: {cert.countryOrigin || 'Approved Supply Chain'}</span>
                </div>
              </div>

              <div className="bg-slate-50/80 backdrop-blur-sm rounded-xl p-4 border border-slate-100 max-w-lg mx-auto text-left space-y-2.5">
                <div className="grid grid-cols-12 gap-2 text-[12px]">
                  <span className="col-span-4 font-black text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                    <FileText size={11} className="text-slate-400" /> Subject Material
                  </span>
                  <span className="col-span-8 font-extrabold text-slate-700">
                    {cert.material || 'N/A'}
                  </span>
                </div>

                {isHalal ? (
                  <>
                    <div className="grid grid-cols-12 gap-2 text-[12px]">
                      <span className="col-span-4 font-black text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                        <Award size={11} className="text-slate-400" /> HALAL Body
                      </span>
                      <span className="col-span-8 font-extrabold text-slate-700 flex items-center gap-1.5">
                        <span className="bg-[#3f809e]/10 text-[#3f809e] px-1.5 py-0.5 rounded text-[10px] font-black uppercase">
                          {cert.hcb || 'N/A'}
                        </span>
                        <span className="text-[11px] text-slate-500">({cert.countryHcb || 'International Body'})</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-12 gap-2 text-[12px]">
                      <span className="col-span-4 font-black text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                        <Award size={11} className="text-slate-400" /> MS Standard
                      </span>
                      <span className="col-span-8 font-extrabold text-[#3a6e86] uppercase tracking-wider">
                        {cert.msType || 'N/A'} - {cert.certName || 'Management Standard'}
                      </span>
                    </div>
                    {cert.scope && (
                      <div className="grid grid-cols-12 gap-2 text-[12px]">
                        <span className="col-span-4 font-black text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                          <CheckCircle size={11} className="text-slate-400" /> Scope of Audit
                        </span>
                        <span className="col-span-8 font-medium text-slate-600 text-[11px] leading-relaxed">
                          {cert.scope}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-12 gap-2 text-[12px]">
                      <span className="col-span-4 font-black text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                        <User size={11} className="text-slate-400" /> Certified Body
                      </span>
                      <span className="col-span-8 font-bold text-slate-700">
                        {cert.body || 'Approved Auditor Body'}
                      </span>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-12 gap-2 text-[12px]">
                  <span className="col-span-4 font-black text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                    <Hash size={11} className="text-slate-400" /> Credential No.
                  </span>
                  <span className="col-span-8 font-mono font-bold text-[#111f42]">
                    {cert.certNo || cert.id}
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                has been fully audited and reviewed, demonstrating compliant alignment with state regulations and premium QA metrics.
              </p>
            </div>

            {/* Dates & Signature section */}
            <div className="mt-8 grid grid-cols-2 gap-6 relative z-10 px-4">
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/80 text-left space-y-1.5 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <Calendar size={12} className="text-[#d1a45f]" />
                  <span>Validation Validity</span>
                </div>
                <div className="text-[11px] space-y-0.5">
                  <p className="text-slate-500">Issued On: <span className="font-bold text-slate-700">{cert.issueDate || '2025-01-01'}</span></p>
                  <p className="text-slate-500">Expires On: <span className="font-bold text-slate-700">{cert.expiryDate}</span></p>
                </div>
                
                {/* Expiry Badge */}
                <div className="mt-1 flex items-center gap-1">
                  {status === 'valid' && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                      Valid ({daysRemaining} Days Left)
                    </span>
                  )}
                  {status === 'expiring' && (
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} /> Expiring in {daysRemaining} Days
                    </span>
                  )}
                  {status === 'expired' && (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} /> Expired {Math.abs(daysRemaining)} Days Ago
                    </span>
                  )}
                </div>
              </div>

              {/* Signature stamp area */}
              <div className="text-center flex flex-col justify-end items-center relative">
                {/* Micro Stamp Graphics */}
                <div className="absolute right-4 bottom-2 opacity-15 text-[#3a6e86] border border-dashed border-[#3a6e86] p-1.5 rounded rotate-[12deg] flex flex-col items-center">
                  <ShieldCheck size={16} />
                  <span className="text-[6px] font-black uppercase tracking-widest mt-0.5">VERIFIED</span>
                </div>
                <div className="text-[11px] font-mono font-bold text-stone-400 mt-1 uppercase tracking-widest italic decoration-[#d1a45f] underline underline-offset-4 decoration-2">
                  System Authorized
                </div>
                <p className="text-[9px] text-[#7a8b95] font-bold uppercase tracking-widest mt-1">QA Auditor Seal</p>
              </div>
            </div>

            {/* Document Digital Filename footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 uppercase tracking-widest font-mono">
              <span>File Reference: {cert.file || 'e-document-vault'}</span>
              <span>SHA-256 Verified Security</span>
            </div>
          </div>
        </div>

        {/* Footer actions block */}
        <div className="no-print p-4 bg-white border-t border-[#eaeaec] flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 font-extrabold rounded-xl hover:bg-slate-200 hover:border-slate-300 transition-all text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Printer size={13} />
            {t('Print / Save PDF', 'พิมพ์ / บันทึก PDF')}
          </button>
          
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-[#212c46] hover:bg-[#1c273e] text-white font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider active:scale-95"
          >
            {t('Close', 'ปิดหน้าต่าง')}
          </button>
        </div>
      </div>
    </DraggableModal>
  );
}
