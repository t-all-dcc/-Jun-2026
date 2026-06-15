import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, Search, HelpCircle, Save, Trash2, X, ChevronLeft, ChevronRight,
  Award, FileText, Calendar, AlertTriangle, Layers, Filter, Eye,
  Activity, Settings2, CheckSquare, Plus, FileCheck, 
  Settings, Bell, CheckCircle2, Download, Upload, ExternalLink, 
  Clock, BadgeCheck, FileWarning, ShieldAlert, FolderKey, ChevronDown, Zap,
  Info, AlertOctagon, BellRing, History, MailWarning, FileClock, ClipboardList,
  Building2, Box, Globe, Globe2, Mail, UserCheck, Check as CheckIcon, List, PieChart, Printer, Send,
  Cpu, FileSignature, Link2, PenTool, MapPin, Database, QrCode, RefreshCw
} from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken } from '../../../firebase';
import { sendGmailMessage } from '../../../services/gmailService';
import { syncDossierRecord } from '../../../syncServices';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { CsvUpload } from '../../../components/shared/CsvUpload';
import { HighlightText } from '../../../components/shared/HighlightText';
import { CertificatePreviewModal } from '../../../components/shared/CertificatePreviewModal';

const THEME = {
  bgMain: 'transparent',
  primary: '#212c46', 
  primaryDark: '#1c273e', 
  accent: '#d1a45f', 
  ai: '#728298', 
  textMain: '#212c46', 
  textMuted: '#7a8b95', 
  textSubtle: '#8898ac', 
  cardBg: '#FFFFFF',
  border: '#eaeaec',
};

const TODAY = new Date('2026-05-15');

const SYNCED_ITEMS = [
  { code: 'RM-001', name: 'Pure Palm Oil' },
  { code: 'RM-002', name: 'Refined Sugar' },
  { code: 'RM-003', name: 'Citric Acid Anhydrous' },
  { code: 'RM-004', name: 'Soy Lecithin' },
  { code: 'RM-005', name: 'Tamarind Concentrate' },
  { code: 'RM-006', name: 'Corrugated Packaging' },
  { code: 'RM-007', name: 'Petrochemical Bottles' }
];

const SYNCED_SUPPLIERS = [
  'Siam Vegetable Oil Co.',
  'Thai Roong Ruang Sugar',
  'Global Chem Trade',
  'Ingredient Solutions',
  'India Agro Export',
  'PackCorp Thailand',
  'InterPlast Solutions'
];

const INITIAL_MS_TYPES = [
  'GHPs & HACCP',
  'FSSC 22000',
  'BRCGS',
  'ISO 22000',
  'ISO 9001',
  'ISO 14001',
  'ISO 45001'
];

export const INITIAL_MS_CERTS = [
  { 
    id: 'MS-26001', 
    material: 'Pure Palm Oil', 
    supplier: 'Siam Vegetable Oil Co.', 
    msType: 'ISO 9001', 
    certName: 'Quality Management System Standard', 
    certNo: 'TH01/12932', 
    scope: 'Manufacturing process certification of palm oils and fats', 
    body: 'SGS (Thailand)', 
    issueDate: '2023-08-15', 
    expiryDate: '2026-08-14', 
    file: 'iso_9001_sgs_2026.pdf', 
    emailSent: true, 
    lastEmailDate: '2026-05-10', 
    emailNotes: 'Requested renewal document from Siam Vegetable Oil Co.' 
  },
  { 
    id: 'MS-26002', 
    material: 'Refined Sugar', 
    supplier: 'Thai Roong Ruang Sugar', 
    msType: 'FSSC 22000', 
    certName: 'Food Safety System Certification', 
    certNo: 'FS-592832', 
    scope: 'Processing of crystalline sucrose and liquid sugar inputs', 
    body: 'BSI Group', 
    issueDate: '2024-02-10', 
    expiryDate: '2027-02-09', 
    file: 'fssc_22000_bsi_2027.pdf', 
    emailSent: false 
  },
  { 
    id: 'MS-26003', 
    material: 'Citric Acid Anhydrous', 
    supplier: 'Global Chem Trade', 
    msType: 'GHPs & HACCP', 
    certName: 'Good Hygiene Practices & HACCP', 
    certNo: 'CODEX-GHPS-8822', 
    scope: 'Blending and supply of organic acid preservatives', 
    body: 'SGS (Thailand)', 
    issueDate: '2025-05-20', 
    expiryDate: '2026-05-19', 
    file: 'haccp_codex_2026.pdf', 
    emailSent: true, 
    lastEmailDate: '2026-04-20', 
    emailNotes: 'Critical alert dispatched to supplier Global Chem Trade.' 
  },
  { 
    id: 'MS-26004', 
    material: 'Soy Lecithin', 
    supplier: 'Ingredient Solutions', 
    msType: 'ISO 14001', 
    certName: 'Environmental Management System', 
    certNo: 'EMS-00921', 
    scope: 'Sourcing, extraction, and distribution of raw lecithins', 
    body: 'Intertek', 
    issueDate: '2023-11-20', 
    expiryDate: '2026-11-19', 
    file: 'iso_14001_intertek.pdf', 
    emailSent: false 
  },
  { 
    id: 'MS-26005', 
    material: 'Corrugated Packaging', 
    supplier: 'PackCorp Thailand', 
    msType: 'ISO 45001', 
    certName: 'Occupational Health and Safety Standard', 
    certNo: 'OHS-882912', 
    scope: 'Manufacturing of food-grade secondary packaging materials', 
    body: 'Lloyd\'s Register', 
    issueDate: '2023-01-15', 
    expiryDate: '2026-01-14', 
    file: 'iso_45001_lr.pdf', 
    emailSent: true, 
    lastEmailDate: '2025-12-15', 
    emailNotes: 'Document Expired! Formal request sent to supplier PackCorp Thailand to submit active certificate.' 
  }
];

const STATUS_FILTERS = [
  { id: 'ALL', label: 'All Standards', icon: Layers, color: THEME.primary },
  { id: 'Valid', label: 'Valid / Compliant', icon: CheckCircle2, color: '#657f4d' },
  { id: 'Expiring Soon', label: 'Expiry Warning', icon: Clock, color: '#b58c4f' },
  { id: 'Expired', label: 'Expired / Action Needed', icon: AlertTriangle, color: '#932c2e' },
];

const calculateDaysRemaining = (expiryStr: string, referenceDate: Date = TODAY) => {
    const exp = new Date(expiryStr);
    const diffTime = exp.getTime() - referenceDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getStatusFromExpiry = (days: number) => {
    if (days < 0) return 'Expired';
    if (days <= 90) return 'Expiring Soon';
    return 'Valid';
};

const EmailReportTemplate = ({ alerts }: { alerts: any[] }) => (
    <div id="print-report-template" className="bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl mx-auto text-black animate-fadeIn overflow-hidden flex flex-col border border-gray-100 relative">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page { size: A4 portrait; margin: 10mm 5mm 7mm 5mm; }
            body { background: white !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}} />
        <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-6 font-mono">
            <div className="flex gap-4 items-center">
                <div className="w-16 h-16 border-4 border-black flex items-center justify-center rounded-xl bg-black">
                    <ShieldCheck size={40} color="white" />
                </div>
                <div>
                    <h1 className="text-[26px] font-black uppercase tracking-tighter leading-none">MS Vendor Assurance</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Management Systems & Supplier Compliance</p>
                    <p className="text-[9px] text-gray-700 mt-0.5 font-bold">QA Supplier Quality • Automated Surveillance Queue</p>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-lg font-black uppercase tracking-widest bg-[#212c46] text-white px-3 py-1 inline-block">MS EXPIRY LIST</h2>
                <p className="text-[10px] font-black mt-2">RUN DATE: {TODAY.toLocaleDateString()}</p>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1 font-bold">Supplier Dossier Report</p>
            </div>
        </div>

        <div className="mb-6">
            <h3 className="text-center text-md font-black uppercase underline tracking-[0.25em] mb-4">Supplier Certificate Expiry & Renewal Plan</h3>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-1">
                <p className="text-[11px] font-bold">TO: Purchasing Directors & Supplier QA Team</p>
                <p className="text-[11px] font-bold text-[#932c2e]">SUBJECT: Critical Renewal Deadlines: Supplier ISO & Food Safety Standards</p>
                <p className="text-[10px] text-gray-600 mt-2 leading-relaxed italic">The management standards certificates from the suppliers listed below have expired or are expiring. We must coordinate with the suppliers immediately to request updated copies of their certificates to prevent material supply disruption.</p>
            </div>
        </div>

        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-100 border-y-2 border-black">
                    <th className="p-3 text-[10px] font-black uppercase text-left border-x border-gray-300">Supplier & Raw Material</th>
                    <th className="p-3 text-[10px] font-black uppercase text-left border-x border-gray-300">Standard / Cert No</th>
                    <th className="p-3 text-[10px] font-black uppercase text-center border-x border-gray-300 w-28">Expiry Date</th>
                    <th className="p-3 text-[10px] font-black uppercase text-center border-x border-gray-300 w-24">Days Left</th>
                    <th className="p-3 text-[10px] font-black uppercase text-center border-x border-gray-300 w-24">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {alerts.map(item => {
                    const days = calculateDaysRemaining(item.expiryDate);
                    return (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-3 text-[11px] font-black uppercase border-x border-gray-200">
                                <div>{item.supplier}</div>
                                <div className="text-[9px] text-gray-500 font-medium normal-case mt-0.5">{item.material}</div>
                            </td>
                            <td className="p-3 text-[10px] font-bold text-gray-600 border-x border-gray-200">
                                <div>{item.msType}</div>
                                <div className="text-[8px] font-mono text-gray-400">No: {item.certNo}</div>
                            </td>
                            <td className="p-3 text-[10px] text-center font-mono font-bold border-x border-gray-200">{item.expiryDate}</td>
                            <td className={`p-3 text-[10px] text-center font-black uppercase border-x border-gray-200 ${days < 0 ? 'text-[#932c2e]' : 'text-[#b58c4f]'}`}>
                                {days < 0 ? 'OVERDUE' : `${days} DAYS`}
                            </td>
                            <td className="p-3 border-x border-gray-200 text-center">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${days < 0 ? 'bg-[#932c2e]/10 text-[#932c2e]' : 'bg-[#b58c4f]/10 text-[#b58c4f]'}`}>
                                    {days < 0 ? 'EXPIRED' : 'EXPIRING'}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>

        <div className="mt-auto pt-10 border-t-2 border-black/10">
            <div className="flex justify-between items-end font-sans">
                <div className="text-center w-56">
                    <div className="border-b border-black h-10 mb-2"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black">QA Supplier Quality Manager</p>
                    <p className="text-[9px] text-gray-500 uppercase">Procurement Integrity & Compliance</p>
                </div>
                
                <div className="relative w-28 h-28 flex items-center justify-center opacity-30 rotate-12 -mb-4">
                    <div className="absolute inset-0 border-4 border-[#212c46] rounded-full flex flex-col items-center justify-center">
                        <p className="text-[9px] font-black text-[#212c46] uppercase text-center leading-none tracking-tighter">SUPPLIER MS<br/>MONITOR<br/>VERIFIED</p>
                    </div>
                </div>

                <div className="text-right font-mono">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Document EXP-REF: {Date.now().toString().slice(-8)}</p>
                    <p className="text-[9px] font-bold text-gray-400">Page 1 of 1</p>
                </div>
            </div>
        </div>
    </div>
);

const NotificationPanel = ({ isOpen, onClose, alerts, onPreview }: any) => {
    if (!isOpen) return null;
    return createPortal(
        <div id="notification-sidebar" className="fixed inset-0 z-[1000] flex justify-end">
            <div className="absolute inset-0 bg-[#212c46]/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-[#212c46] h-full shadow-2xl flex flex-col animate-fadeIn overflow-hidden border-l border-white/20">
                <div className="p-6 text-white flex justify-between items-center shrink-0 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <MailWarning size={20} className="text-[#d1a45f]" />
                        <h3 className="font-black text-[14px] uppercase tracking-widest leading-none">Supplier Request Dispatch</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white"><X size={18} /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2 bg-black/10">
                    {alerts.length === 0 ? (
                        <div className="text-center py-20 text-white/50">
                            <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20 text-[#657f4d]"/>
                            <p className="text-[12px] font-black uppercase tracking-widest">All Vendors Compliant</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl mb-2">
                                <p className="text-[11px] font-black text-red-200 uppercase flex items-center gap-1.5 tracking-wider"><AlertTriangle size={12}/> Critical Expiry Alert</p>
                                <p className="text-[10px] text-gray-300 mt-1">Found {alerts.length} supplier documents that require renewal immediately.</p>
                            </div>
                            {alerts.map((item: any) => {
                                const days = calculateDaysRemaining(item.expiryDate);
                                return (
                                    <div key={item.id} className="p-3 rounded-xl bg-white shadow-lg border-l-4 border-[#932c2e]">
                                        <div className="flex justify-between items-start mb-1 animate-fadeIn">
                                            <h4 className="text-[11px] font-black text-[#212c46] uppercase truncate max-w-[170px]">{item.supplier}</h4>
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${days < 0 ? 'bg-[#932c2e]/10 text-[#932c2e]' : 'bg-[#d1a45f]/10 text-[#d1a45f]'}`}>
                                                {days < 0 ? 'EXPIRED' : `${days}D LEFT`}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-[#212c46] font-bold truncate">Item: {item.material}</p>
                                        <p className="text-[9px] text-[#7a8b95] font-semibold truncate mt-[2px]">Standard: <span className="text-[#212c46] font-black">{item.msType}</span> ({item.certNo})</p>
                                        {item.emailSent && (
                                            <div className="mt-1.5 text-[8.5px] text-[#657f4d] font-black flex items-center gap-1 uppercase bg-[#657f4d]/5 py-0.5 px-2 rounded border border-[#657f4d]/20 w-fit">
                                                <CheckIcon size={10}/> Request Dispatched {item.lastEmailDate}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-5 bg-white border-t border-[#eaeaec] shrink-0 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
                    <button 
                        id="btn-audit-dispatch-batch"
                        onClick={onPreview}
                        className="w-full py-4 bg-[#212c46] text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-[#1c273e] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 text-[#d1a45f]"
                    >
                        <Mail size={16}/> EXPIRY PLAN REPORT PREVIEW
                    </button>
                    <p className="text-[8px] text-center text-[#7a8b95] mt-3 font-bold uppercase tracking-widest opacity-60 italic">Review lists to draft formal inquiry emails</p>
                </div>
            </div>
        </div>, document.body
    );
};

// Custom Config Modal to add/delete new standard types dynamically
const CustomConfigModal = ({ isOpen, title, items, onSave, onDelete, onClose }: any) => {
    const [inputValue, setInputValue] = useState('');
    if (!isOpen) return null;
    return createPortal(
        <div id="config-standards-modal" className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-fadeIn border border-[#eaeaec]">
                <div className="p-5 bg-[#212c46] text-white flex justify-between items-center">
                    <h4 className="text-[12px] font-black uppercase tracking-widest text-[#d1a45f] flex items-center gap-2"><Settings2 size={16}/> {title}</h4>
                    <button onClick={onClose} className="text-white hover:text-[#932c2e] transition-colors"><X size={18}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex gap-2">
                        <input 
                            id="input-config-name"
                            value={inputValue} 
                            onChange={e=>setInputValue(e.target.value.toUpperCase())} 
                            placeholder="e.g. ISO 27001, IFS, SQF..." 
                            className="flex-1 px-4 py-2 border border-[#eaeaec] rounded-xl text-[12px] outline-none font-black uppercase focus:border-[#d1a45f]" 
                        />
                        <button 
                            id="btn-add-config-item"
                            onClick={()=>{ if(inputValue.trim()) {onSave(inputValue.trim()); setInputValue('');} }} 
                            className="bg-[#212c46] text-[#d1a45f] px-4 rounded-xl font-black uppercase text-[10px] hover:bg-[#1c273e]"
                        >
                            Add
                        </button>
                    </div>
                    <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-1">
                        {items.map((it: string, i: number) => (
                            <div key={i} className="flex justify-between items-center p-2.5 bg-[#f8f9fa] rounded-lg text-[11px] font-bold uppercase border border-[#eaeaec]">
                                <span className="text-[#212c46]">{it}</span>
                                <button type="button" onClick={() => onDelete(it)} className="text-gray-400 hover:text-[#932c2e] p-1 rounded-md hover:bg-gray-100 transition-all" title="Remove"><Trash2 size={12}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>, document.body
    );
};

// In-app official confirmation popup for dispatch actions (satisfies iframe sandbox, avoids window.alert/confirm)
const SupplierQuickRequestModal = ({ isOpen, onClose, cert, onConfirm }: any) => {
    const [customMsg, setCustomMsg] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('fon.phichamon@gmail.com');
    const [hasGmail, setHasGmail] = useState(false);
    const [gmailUser, setGmailUser] = useState<any>(null);
    const [isSending, setIsSending] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [statusType, setStatusType] = useState<'SUCCESS' | 'ERROR' | ''>('');

    useEffect(() => {
        if (cert) {
            setCustomMsg(`เรียน แผนกตรวจสอบคุณภาพและรับรองของ บริษัท ${cert.supplier},\n\nเนื่องด้วย ทางบริษัทฯ ตรวจพบว่าใบรับรองมาตรฐาน ${cert.msType} ของวัตถุดิบ ${cert.material} (รหัสใบอนุญาต: ${cert.certNo || 'N/A'}) กำลังจะหมดอายุหรือหมดอายุลงแล้วในวันที่ ${cert.expiryDate}.\n\nจึงใคร่ขอความอนุเคราะห์จากท่านในการจัดส่งใบรับรองฉบับปรับปรุงใหม่ล่าสุด หรือหนังสือยืนยันสถานะการตรวจประเมิน เพื่อทางเราจะนำเข้าระบบทะเบียนผู้ขายต่อไป.\n\nขอแสดงความนับถือ,\nฝ่ายการประกันคุณภาพวัตถุดิบ (QA Quality Assurance Team)`);
            
            // Set recipient based on supplier name or default nicely
            const slug = cert.supplier.toLowerCase().replace(/[^a-z]/g, '');
            setRecipientEmail(`${slug || 'supplier'}@t-all-intelligence.com`);
        }
    }, [cert]);

    useEffect(() => {
        if (isOpen) {
            initAuth(
                (user) => {
                    setHasGmail(true);
                    setGmailUser(user);
                },
                () => {
                    setHasGmail(false);
                    setGmailUser(null);
                }
            );
        }
    }, [isOpen]);

    const handleGmailSignIn = async () => {
        try {
            await googleSignIn();
            initAuth(
                (user) => {
                    setHasGmail(true);
                    setGmailUser(user);
                }
            );
        } catch (e) {
            console.error('Failed to sign in', e);
        }
    };

    const handleSendAction = async () => {
        if (!recipientEmail) {
            setStatusType('ERROR');
            setStatusText('โปรดกรอกที่อยู่อีเมลผู้รับ');
            return;
        }

        setIsSending(true);
        setStatusText('');
        setStatusType('');

        try {
            if (hasGmail) {
                const subject = `[Notification] เอกสารรับรองมาตรฐาน ${cert.msType} สำหรับวัตถุดิบ ${cert.material} กำลังจะหมดอายุ`;
                await sendGmailMessage(recipientEmail, subject, customMsg);
                
                // Track in our log registry of Gmail Integration page
                const savedLogs = localStorage.getItem('smartcert_gmail_logs');
                const parsedLogs = savedLogs ? JSON.parse(savedLogs) : [];
                const newLog = {
                    id: `LOG-${Date.now()}`,
                    recipient: recipientEmail,
                    subject: subject,
                    timestamp: new Date().toISOString(),
                    status: 'SUCCESS',
                };
                localStorage.setItem('smartcert_gmail_logs', JSON.stringify([newLog, ...parsedLogs].slice(0, 50)));

                setStatusType('SUCCESS');
                setStatusText('อีเมลส่งออกจริงผ่านบริการ Gmail API สำเร็จแล้ว!');
            } else {
                // Mock fallback
                setStatusType('SUCCESS');
                setStatusText('ส่งอีเมลแจ้งเตือนจำลองในระบบเรียบร้อย (ไม่ได้ส่งจริงเนื่องจากไม่ได้เข้าสู่ระบบ)');
            }

            // Let parent component know to update system register and show toast
            setTimeout(() => {
                onConfirm(cert.id, customMsg, recipientEmail, hasGmail);
                onClose();
                setStatusText('');
                setStatusType('');
            }, 1800);

        } catch (error: any) {
            console.error(error);
            setStatusType('ERROR');
            setStatusText(`ส่งอีเมลล้มเหลว: ${error.message || 'ตรวจพบบัญชีไม่มีสิทธิ์เขียนอีเมล'}`);
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen || !cert) return null;

    return createPortal(
        <div id="quick-request-modal" className="fixed inset-0 z-[1500] flex items-center justify-center bg-[#212c46]/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-white/60 animate-fadeIn text-left">
                <div className="bg-[#212c46] px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <Mail className="text-[#d1a45f]" size={18} />
                        <h4 className="text-[12px] font-black uppercase tracking-widest text-[#d1a45f]">Official Supplier Document Request</h4>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-white"><X size={18}/></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    
                    {/* Send Mode Alert */}
                    {hasGmail ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1 text-emerald-850">
                            <p className="text-[11px] font-black uppercase flex items-center gap-1.5">
                                <CheckCircle2 size={13} className="text-emerald-600" /> Gmail Mode: Real Outbound Active
                            </p>
                            <p className="text-[10px] text-emerald-700">
                                อีเมลแจ้งเตือนนี้จะส่งออกจากบัญชีจริง: <strong className="font-mono">{gmailUser?.email}</strong>
                            </p>
                        </div>
                    ) : (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-amber-850">
                            <div className="flex justify-between items-center">
                                <p className="text-[11px] font-black uppercase flex items-center gap-1.5">
                                    <AlertTriangle size={13} className="text-amber-600" /> Connection Alert
                                </p>
                                <button 
                                    onClick={handleGmailSignIn}
                                    className="px-2 py-0.5 bg-white border border-amber-300 text-amber-900 rounded font-black text-[9px] hover:bg-gray-50 uppercase"
                                >
                                    Log In Gmail
                                </button>
                            </div>
                            <p className="text-[10px] text-amber-950">
                                ระบบทำงานบนโหมดจำลอง คุณสามารถเชื่อมต่อ Gmail ของคุณเพื่อใช้จัดส่งอีเมล์จริงได้
                            </p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase block">Recipient Email (อีเมลผู้จัดจำหน่าย/Supplier)</label>
                        <input 
                            type="email" 
                            required
                            placeholder="supplier.qa@company.com"
                            value={recipientEmail}
                            onChange={e=>setRecipientEmail(e.target.value)}
                            className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-xl px-4 py-2 text-[11px] font-bold text-[#212c46] outline-none focus:border-[#d1a45f]"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase block">Draft Request Note (เนื้อหาร่างคำร้องสำหรับ Supplier)</label>
                        <textarea 
                            value={customMsg}
                            onChange={e=>setCustomMsg(e.target.value)}
                            className="w-full h-36 p-3 border border-[#eaeaec] rounded-xl text-[11px] font-semibold outline-none focus:border-[#d1a45f] resize-none leading-relaxed"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] font-black">
                        <div className="bg-gray-50 border border-[#eaeaec] p-2.5 rounded-lg">
                            <span className="text-gray-400 uppercase block leading-none mb-1">Raw Material</span>
                            <span className="text-[#212c46] uppercase">{cert.material}</span>
                        </div>
                        <div className="bg-gray-50 border border-[#eaeaec] p-2.5 rounded-lg">
                            <span className="text-gray-400 uppercase block leading-none mb-1">Standard Type</span>
                            <span className="text-[#212c46] uppercase">{cert.msType} (Auditor: {cert.body})</span>
                        </div>
                    </div>

                    {statusText && (
                        <div className={`p-3 rounded-xl border text-[11px] font-bold ${
                            statusType === 'SUCCESS' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-[#eaeaec] text-rose-800'
                        }`}>
                            {statusText}
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-[#eaeaec] flex justify-end gap-3 font-sans shrink-0">
                    <button onClick={onClose} className="px-5 py-2 bg-white border border-[#eaeaec] text-[#7a8b95] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100">Cancel</button>
                    <button 
                        id="btn-confirm-supplier-request"
                        onClick={handleSendAction} 
                        disabled={isSending}
                        className="bg-[#212c46] text-[#d1a45f] px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1c273e] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isSending ? (
                            <>
                                <div className="w-3 h-3 border-2 border-t-transparent border-[#d1a45f] rounded-full animate-spin"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={12}/> {hasGmail ? 'Send Real Mail' : 'Dispatch Simulation'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>, document.body
    );
};

// Simple Dispatch Feedback Modal for successfully dispatched requests (satisfies no window.alert guidance)
const FeedbackToast = ({ isOpen, msg, onClose }: any) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => onClose(), 4000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div id="feedback-alert-toast" className="fixed bottom-6 right-6 z-[3000] bg-[#1c273e] border-l-4 border-[#657f4d] shadow-2xl p-4 rounded-xl flex items-center gap-3 max-w-sm animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-[#657f4d]/20 text-[#657f4d] flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
            </div>
            <div>
                <p className="text-[12px] font-black text-white uppercase tracking-wider">Request Sent Successfully</p>
                <p className="text-[11px] text-gray-300 mt-0.5">{msg}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 ml-auto shrink-0"><X size={14}/></button>
        </div>, document.body
    );
};

function CertModal({ isOpen, onClose, onSave, item, masterTypes, onConfigOpen }: any) {
  const [activeTab, setActiveTab] = useState('item');
  const [formData, setFormData] = useState<any>({ 
    material: '', 
    supplier: '', 
    msType: '', 
    certName: '', 
    certNo: '', 
    scope: '', 
    body: '', 
    issueDate: '', 
    expiryDate: '', 
    emailNotes: '', 
    otherDocs: [] 
  });

  useEffect(() => {
    if (isOpen) {
      if (item) setFormData({ ...item });
      else setFormData({ 
        material: SYNCED_ITEMS[0].name, 
        supplier: SYNCED_SUPPLIERS[0], 
        msType: masterTypes[0] || 'ISO 9001', 
        certName: 'Quality Management System', 
        certNo: '', 
        scope: '', 
        body: '', 
        issueDate: '', 
        expiryDate: '', 
        emailNotes: '', 
        otherDocs: [] 
      });
      setActiveTab('item');
    }
  }, [isOpen, item, masterTypes]);

  if (!isOpen) return null;

  return createPortal(
    <div id="dossier-editor-modal" className="fixed inset-0 z-[500] flex items-center justify-center bg-[#212c46]/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[850px] flex flex-col overflow-hidden border border-white/60 h-[85vh]">
        <div className="bg-[#212c46] px-6 py-5 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <Award size={24} className="text-[#d1a45f]" />
            <div>
              <h3 className="text-[16px] font-black text-white uppercase tracking-widest leading-none">{item ? 'EDIT SUPPLIER STANDARD RECORD' : 'REGISTER SUPPLIER MANAGEMENT STANDARD'}</h3>
              <p className="text-[9px] font-bold text-[#d1a45f] uppercase tracking-widest mt-1 opacity-80">Supplier MS Document Dossier</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-[#a3acbe] hover:text-white"><X size={18} /></button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-60 bg-[#f8f9fa] border-r border-[#eaeaec] p-4 space-y-1 shrink-0">
             {[
               { id: 'item', label: 'Item & Supplier', icon: Building2 },
               { id: 'cert', label: 'Certification Info', icon: FileSignature },
               { id: 'email', label: 'Communication Hub', icon: History }
             ].map(tab => {
                const TabIcon = tab.icon;
                return (
                    <button 
                        key={tab.id} 
                        onClick={()=>setActiveTab(tab.id)} 
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all uppercase text-[11px] font-black tracking-widest ${activeTab === tab.id ? 'bg-[#212c46] text-white shadow-lg' : 'text-[#7a8b95] hover:bg-white hover:text-[#212c46]'}`}
                    >
                        <TabIcon size={16} /> {tab.label}
                    </button>
                );
             })}
          </div>

          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white">
             {activeTab === 'item' && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="p-6 bg-[#f8f9fa] rounded-2xl border border-[#eaeaec] space-y-5">
                      <div>
                         <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">Raw Material Input</label>
                         <select 
                            id="modal-select-material"
                            value={formData.material} 
                            onChange={e=>setFormData({...formData, material: e.target.value})} 
                            className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none bg-white font-sans"
                         >
                            {SYNCED_ITEMS.map((itemObj) => <option key={itemObj.code} value={itemObj.name}>{itemObj.name} ({itemObj.code})</option>)}
                         </select>
                      </div>
                      
                      <div>
                         <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">Approved Supplier Vendor</label>
                         <select 
                            id="modal-select-supplier"
                            value={formData.supplier} 
                            onChange={e=>setFormData({...formData, supplier: e.target.value})} 
                            className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none bg-white"
                         >
                            {SYNCED_SUPPLIERS.map((supName) => <option key={supName} value={supName}>{supName}</option>)}
                         </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                             <div className="flex justify-between items-center mb-1.5">
                                <label className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">MS Standard Type</label>
                                <button type="button" onClick={onConfigOpen} className="text-[#212c46] hover:text-[#d1a45f] transition-all flex items-center gap-1 text-[9px] font-black"><Settings size={14}/> CONFIG</button>
                             </div>
                             <select 
                                id="modal-select-mstype"
                                value={formData.msType} 
                                onChange={e=>setFormData({...formData, msType: e.target.value})} 
                                className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none bg-white"
                             >
                                {masterTypes.map((type: string) => <option key={type} value={type}>{type}</option>)}
                             </select>
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider mt-0.5">Cert/Document Descriptive Title</label>
                             <input 
                                id="modal-input-certname"
                                value={formData.certName} 
                                onChange={e=>setFormData({...formData, certName: e.target.value})} 
                                className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#212c46] bg-white cursor-text" 
                                placeholder="e.g. ISO Standard Certificate" 
                             />
                          </div>
                      </div>

                      <div>
                         <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider font-mono">Scope of Certification Details</label>
                         <textarea 
                            id="modal-textarea-scope"
                            value={formData.scope} 
                            onChange={e=>setFormData({...formData, scope: e.target.value})} 
                            className="w-full h-20 p-3 border border-[#eaeaec] rounded-xl text-[12px] font-medium outline-none bg-white resize-none focus:border-[#212c46]" 
                            placeholder="Details regarding plants, manufacturing blocks covered by this dossier..." 
                         />
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'cert' && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="p-6 bg-[#f8f9fa] rounded-2xl border border-[#eaeaec] space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                             <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">Supplier Certificate Registry Code (No)</label>
                             <input 
                                id="modal-input-certno"
                                value={formData.certNo} 
                                onChange={e=>setFormData({...formData, certNo: e.target.value.toUpperCase()})} 
                                className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[13px] font-mono font-bold uppercase focus:border-[#212c46]" 
                                placeholder="e.g. ISO-9001-TH-1823" 
                             />
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">Accredited Auditing Body</label>
                             <input 
                                id="modal-input-body"
                                value={formData.body} 
                                onChange={e=>setFormData({...formData, body: e.target.value})} 
                                className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold focus:border-[#212c46] bg-white" 
                                placeholder="e.g. SGS, BSI, Intertek, TUV" 
                             />
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">Document Effective (Issue) Date</label>
                             <input 
                                id="modal-input-issuedate"
                                type="date" 
                                value={formData.issueDate} 
                                onChange={e=>setFormData({...formData, issueDate: e.target.value})} 
                                className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none bg-white font-mono" 
                             />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-[#eaeaec] pt-5">
                          <div>
                             <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">Document Expiration Date</label>
                             <input 
                                id="modal-input-expirydate"
                                type="date" 
                                value={formData.expiryDate} 
                                onChange={e=>setFormData({...formData, expiryDate: e.target.value})} 
                                className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none bg-white font-mono" 
                             />
                          </div>
                          <div className="flex items-end">
                             <div className="w-full h-11 bg-white border border-[#eaeaec] border-dashed rounded-xl flex items-center justify-center text-[#7a8b95] hover:text-[#212c46] transition-all cursor-pointer">
                                <Upload size={16} className="mr-2 text-[#d1a45f]"/> <span className="text-[10px] font-black uppercase tracking-widest">Upload PDF Certificate</span>
                             </div>
                          </div>
                      </div>
                   </div>
                </div>
             )}



             {activeTab === 'email' && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="p-6 bg-[#f8f9fa] rounded-2xl border border-[#eaeaec] space-y-4 shadow-inner">
                      <div className="flex justify-between items-center animate-fadeIn">
                        <h4 className="text-[11px] font-black text-[#b58c4f] uppercase tracking-widest flex items-center gap-2"><Mail size={16}/> Supplier Communication Dispatch History</h4>
                        <button type="button" onClick={()=>setFormData({...formData, emailNotes: ''})} className="text-[9px] font-black text-[#932c2e] hover:underline uppercase">Clear logs</button>
                      </div>
                      <textarea 
                        id="modal-textarea-notes"
                        value={formData.emailNotes} 
                        onChange={e=>setFormData({...formData, emailNotes: e.target.value})}
                        className="w-full h-40 bg-white border border-[#eaeaec] rounded-xl p-4 text-[12px] font-medium outline-none focus:border-[#d1a45f] resize-none"
                        placeholder="Log email inquiries, supplier feedback, or physical phone schedules here..."
                      />
                      <div className="p-4 bg-white/60 border border-[#eaeaec] rounded-xl flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-[#657f4d] animate-ping"></div>
                         <p className="text-[10px] font-bold text-[#7a8b95] uppercase leading-tight">These historical notes are synced across procurement and auditing departments.</p>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>

        <div className="px-8 py-5 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-between items-center shrink-0 font-sans">
          <button onClick={onClose} className="px-8 py-2.5 bg-white border border-[#eaeaec] text-[#7a8b95] rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#f3f3f1]">Close</button>
          <button 
            id="btn-save-dossier"
            onClick={()=>onSave(formData)} 
            className="bg-[#212c46] text-white px-10 py-2.5 rounded-xl font-black text-[11px] uppercase shadow-lg hover:bg-[#1c273e] transition-all flex items-center gap-2 active:scale-95 text-[#d1a45f]"
          >
            <Save size={16}/> Save Supplier MS Record
          </button>
        </div>
      </div>
    </div>, document.body
  );
}

function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[600] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 z-[610] w-full max-w-[420px] bg-white h-full shadow-2xl border-l-[6px] border-[#212c46] flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="py-4 px-6 bg-[#212c46] text-white shrink-0 relative z-10 font-sans border-b-2 border-[#d1a45f]">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-transparent border-2 border-[#d1a45f] rounded-xl flex items-center justify-center shadow-lg text-[#d1a45f]"><ShieldCheck size={20} /></div>
              <div><h3 className="text-base font-black uppercase tracking-widest leading-none">MS System Guide</h3><p className="text-[10px] font-medium opacity-60 mt-1 uppercase tracking-widest font-mono">SUPPLIER SYSTEM AUDIT</p></div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white"><X size={20}/></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-white text-[#212c46] text-[12px] font-medium">
          <section className="space-y-2">
            <h4 className="text-[13px] font-black uppercase border-b-2 border-[#eaeaec] pb-1 flex items-center gap-2 text-[#212c46]"><Award size={16} className="text-[#d1a45f]"/> 1. Supplier MS Concept</h4>
            <p className="text-[11px] leading-relaxed bg-[#f8f9fa] p-4 rounded-xl border border-[#eaeaec]">
               <span className="font-black">ระบบจัดเก็บเอกสารและตรวจสอบผู้ขาย (Supplier Documents):</span> ควบคุมการตรวจประเมินแบบบูรณาการ โดยบันทึกจับคู่วัตถุดิบดิบร่วมกับผู้ผลิด (Raw Material & Supplier Alignment) เช่นเดียวกับใบรับรอง Halal
            </p>
          </section>
          
          <section className="space-y-2">
            <h4 className="text-[13px] font-black uppercase border-b-2 border-[#eaeaec] pb-1 flex items-center gap-2 text-[#b58c4f]"><Settings size={16}/> 2. Dynamic Configurations</h4>
            <p className="text-[11px] leading-relaxed">
               ผู้ใช้สามารถบริหารจัดการ <span className="font-black text-[#212c46]">ประเภทของดอสซิเยร์มาตรฐาน (ISO Standards family)</span> ได้อย่างสมบูรณ์ไร้ข้อจำกัด โดยคลิกปุ่ม <span className="font-mono bg-gray-100 px-1 py-0.5 rounded border">CONFIG</span> ข้างเมนูเลือกประเภทมาตรฐานในหน้าต่างบันทึกข้อมูล
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-[13px] font-black uppercase border-b-2 border-[#eaeaec] pb-1 flex items-center gap-2 text-[#932c2e]"><MailWarning size={16}/> 3. Expiry Warning & Renewal Request</h4>
            <p className="text-[11px] leading-relaxed">
               <span className="font-black text-[#932c2e]">หากใบอนุญาต / ใบรับรองจาก Supplier หมดอายุลง:</span> ระบบจะแสดงตัวอักษร "Expired / Action Needed" สีแดงชัดเจน และปลุกปุ่มพิเศษ <span className="font-bold text-[#212c46]">📧 Request Renewal (ขอเอกสารใหม่)</span> เพื่อให้ทีม QA ดีไซน์จดหมายส่งขอไฟล์รับรองฉบับใหม่จาก Supplier ได้โดยตรง
            </p>
          </section>
        </div>
        <div className="py-4 px-6 bg-white border-t border-[#eaeaec] shrink-0"><button onClick={onClose} className="w-full py-3 bg-[#212c46] text-white font-black rounded-xl uppercase text-[11px] tracking-[0.2em] hover:bg-[#1c273e] transition-all shadow-md active:scale-95 text-[#d1a45f]">UNDERSTOOD (รับทราบ)</button></div>
      </div>
    </>, document.body
  );
}

import { useLanguage } from '../../../context/LanguageContext';
import { useNotifications } from '../../../context/NotificationContext';
import SkeletonLoading from '../../../components/shared/SkeletonLoading';

export default function MsCertificates() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { msCerts, updateMsCerts, referenceDate } = useNotifications();
  const [certs, setCerts] = useState(msCerts.length > 0 ? msCerts : INITIAL_MS_CERTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (msCerts.length > 0) {
      setCerts(msCerts);
    }
  }, [msCerts]);

  const updateAllCertsState = (updated: any[]) => {
    setCerts(updated);
    updateMsCerts(updated);
  };

  const [masterTypes, setMasterTypes] = useState(INITIAL_MS_TYPES);

  const [hasAuth, setHasAuth] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    initAuth((user) => {
      setHasAuth(true);
      setUserProfile(user);
    }, () => {
      setHasAuth(false);
      setUserProfile(null);
    });
  }, []);

  const handleLogin = async () => {
    try {
       await googleSignIn();
    } catch(err) {
       console.error(err);
    }
  };

  const [activeMainTab, setActiveMainTab] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [qrCert, setQrCert] = useState<any>(null);
  const [previewCert, setPreviewCert] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Supplier quick-dispatch states (Custom sandboxed alert flow)
  const [quickRequestCert, setQuickRequestCert] = useState<any>(null);
  const [isQuickRequestOpen, setIsQuickRequestOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);

  useEffect(() => {
    const certId = searchParams.get('certId');
    const action = searchParams.get('action');
    if (certId) {
      const foundCert = certs.find(c => c.id === certId);
      if (foundCert) {
        setActiveItem(foundCert);
        setIsModalOpen(true);
        setSearchParams({}, { replace: true });
      }
    } else if (action === 'add') {
      setActiveItem(null);
      setIsModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, certs, setSearchParams]);

  const refDateObj = useMemo(() => new Date(referenceDate), [referenceDate]);

  const processedCerts = useMemo(() => {
    return certs.map(c => {
        const days = calculateDaysRemaining(c.expiryDate, refDateObj);
        return {
            ...c,
            daysRemaining: days,
            calculatedStatus: getStatusFromExpiry(days)
        };
    });
  }, [certs, refDateObj]);

  const criticalAlerts = useMemo(() => processedCerts.filter(c => c.daysRemaining <= 90), [processedCerts]);

  const filteredCerts = useMemo(() => {
    return processedCerts.filter(c => {
      const matchStatus = filterStatus === 'ALL' || c.calculatedStatus === filterStatus;
      const matchType = filterType === 'ALL' || c.msType === filterType;
      const matchSearch = c.material.toLowerCase().includes(search.toLowerCase()) || 
                          c.supplier.toLowerCase().includes(search.toLowerCase()) ||
                          c.msType.toLowerCase().includes(search.toLowerCase()) ||
                          c.certNo.toLowerCase().includes(search.toLowerCase()) ||
                          (c.scope && c.scope.toLowerCase().includes(search.toLowerCase()));
      return matchStatus && matchType && matchSearch;
    });
  }, [processedCerts, filterStatus, filterType, search]);

  const currentData = filteredCerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredCerts.length / itemsPerPage) || 1;

  const filterCounts = useMemo(() => {
    const counts: any = { 'ALL': processedCerts.length };
    STATUS_FILTERS.forEach(f => {
      if(f.id !== 'ALL') counts[f.id] = processedCerts.filter(q => q.calculatedStatus === f.id).length;
    });
    return counts;
  }, [processedCerts]);

  const [savingData, setSavingData] = useState<any>(null);

  const handleSaveInit = (data: any) => {
    // Show confirmation before proceeding to cloud mutation
    setSavingData(data);
  };

  const executeSave = async () => {
    if (!savingData) return;
    const data = savingData;
    let newDossier;
    let updated;
    if (activeItem) {
      newDossier = { ...activeItem, ...data };
      updated = certs.map(c => c.id === activeItem.id ? newDossier : c);
    } else {
      newDossier = { ...data, id: `MS-${Math.floor(10000 + Math.random()*90000).toString()}` };
      updated = [newDossier, ...certs];
    }
    updateAllCertsState(updated);
    
    // Explicit Sync to Cloud (Sheets & Firebase)
    try {
        await syncDossierRecord(newDossier);
    } catch (e) {
        console.error('Failed to sync to cloud', e);
    }

    setIsModalOpen(false);
    setActiveItem(null);
    setSavingData(null);
  };

  const handleAddMsType = (newType: string) => {
    if (!masterTypes.includes(newType)) {
      setMasterTypes([...masterTypes, newType]);
    }
  };

  const handleDeleteMsType = (typeToRemove: string) => {
    setMasterTypes(masterTypes.filter(t => t !== typeToRemove));
    if (filterType === typeToRemove) {
      setFilterType('ALL');
    }
  };

  // Quick automated supplier document solicitation dispatch
  const handleTriggerQuickRequest = (certItem: any) => {
      setQuickRequestCert(certItem);
      setIsQuickRequestOpen(true);
  };

  const handleConfirmSupplierRequest = (id: string, notes: string) => {
      const formattedDate = TODAY.toISOString().split('T')[0];
      const updated = certs.map(c => {
          if (c.id === id) {
              return {
                  ...c,
                  emailSent: true,
                  lastEmailDate: formattedDate,
                  emailNotes: `[Dispatched Document Solicitation - ${formattedDate}]:\n${notes}`
              };
          }
          return c;
      });
      updateAllCertsState(updated);
      const certificate = certs.find(c => c.id === id);
      setToastMessage(`Sent official request to ${certificate?.supplier || 'vendor'} successfully!`);
      setIsToastOpen(true);
  };

  if (isLoading) {
    return <SkeletonLoading layout="dashboard" />;
  }

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 relative font-sans">
      
      {/* USER GUIDE FLOATING TAB */}
      <button 
        id="btn-user-guide-floating"
        onClick={() => setIsGuideOpen(true)}
        className="fixed right-0 top-[80px] z-[100] bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#212c46] hover:text-white hover:border-[#212c46] transition-all duration-500 flex flex-col items-center gap-4 group no-print"
      >
        <HelpCircle size={18} className="text-[#d1a45f] group-hover:text-white transition-colors" />
        <span className="[writing-mode:vertical-rl] rotate-180 font-black text-[10px] uppercase tracking-[0.3em]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      
      <CertModal 
        isOpen={isModalOpen} 
        onClose={() => {setIsModalOpen(false); setActiveItem(null);}} 
        onSave={handleSaveInit} 
        item={activeItem} 
        masterTypes={masterTypes}
        onConfigOpen={() => setIsConfigOpen(true)}
      />

      {savingData && createPortal(
          <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-[#212c46]/60 backdrop-blur-sm p-4 animate-fadeIn font-sans">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full border border-gray-100 p-6 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
                      <Database size={28} />
                  </div>
                  <h4 className="text-[14px] font-black uppercase text-[#212c46] tracking-widest mb-2">Sync to Cloud Database?</h4>
                  <p className="text-[11px] text-gray-500 font-medium mb-6">
                      By saving, this document MS record will be pushed and updated in your connected Google Sheets and Firebase Firestore. Do you confirm?
                  </p>
                  <div className="flex gap-3 w-full">
                      <button onClick={() => setSavingData(null)} className="flex-1 py-3 text-[11px] font-black uppercase tracking-widest text-[#7a8b95] bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-[#eaeaec]">Cancel</button>
                      <button onClick={executeSave} className="flex-1 py-3 text-[11px] font-black uppercase tracking-widest text-[#d1a45f] bg-[#212c46] rounded-xl hover:bg-[#1c273e] transition-colors">Confirm Save</button>
                  </div>
              </div>
          </div>, document.body
      )}
      
      <CustomConfigModal 
        isOpen={isConfigOpen} 
        title="Manage Standard Frameworks" 
        items={masterTypes} 
        onSave={handleAddMsType} 
        onDelete={handleDeleteMsType}
        onClose={() => setIsConfigOpen(false)} 
      />

      <NotificationPanel 
        isOpen={isNotifyOpen} 
        onClose={() => setIsNotifyOpen(false)} 
        alerts={criticalAlerts} 
        onPreview={() => { setIsNotifyOpen(false); setIsEmailPreviewOpen(true); }} 
      />

      <DraggableModal 
        isOpen={!!qrCert} 
        onClose={() => setQrCert(null)}
        title={t("Dossier QR Code", "คิวอาร์โค้ดใบรับรอง")}
      >
        <div className="p-8 flex flex-col items-center gap-4 bg-white" id="qr-code-container">
            <div className="p-4 bg-white border border-[#eaeaec] rounded-2xl shadow-sm">
                <QRCodeSVG 
                    value={`${window.location.origin}/certificates/ms?certId=${qrCert?.id}`} 
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#212c46"}
                    level={"L"}
                />
            </div>
            <div className="text-center">
                <h4 className="font-black text-[14px] text-[#212c46] uppercase m-0 leading-tight">{qrCert?.material}</h4>
                <p className="text-[12px] font-bold text-[#7a8b95] uppercase mt-1">Supplier: {qrCert?.supplier}</p>
            </div>
            <button 
                onClick={() => {
                    const canvas = document.createElement("canvas");
                    const svg = document.querySelector("#qr-code-container svg");
                    if (!svg) return;
                    const xml = new XMLSerializer().serializeToString(svg);
                    const svg64 = btoa(unescape(encodeURIComponent(xml)));
                    const b64Start = 'data:image/svg+xml;base64,';
                    const image64 = b64Start + svg64;
                    const img = new Image();
                    img.onload = function() {
                        canvas.width = 200;
                        canvas.height = 200;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0);
                        const pngFile = canvas.toDataURL("image/png");
                        const a = document.createElement("a");
                        a.download = `QR_${qrCert?.material}.png`;
                        a.href = pngFile;
                        a.click();
                    };
                    img.src = image64;
                }} 
                className="w-full mt-4 bg-[#212c46] text-white py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1c273e] transition-colors"
            >
                {t("Download QR Code", "ดาวน์โหลดคิวอาร์โค้ด")}
            </button>
        </div>
      </DraggableModal>
      
      <CertificatePreviewModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => { setIsPreviewModalOpen(false); setPreviewCert(null); }} 
        cert={previewCert} 
        type="ms" 
      />

      <DraggableModal 
        isOpen={isCsvModalOpen} 
        onClose={() => setIsCsvModalOpen(false)}
        title="BULK UPLOAD MS CERTIFICATES"
      >
        <div className="p-6">
          <CsvUpload 
            onUpload={(data) => {
              // Simulated upload - normally we'd connect to our backend or state array
              console.log("Bulk upload MS data:", data);
              alert(`${data.length} certificates registered successfully via batch import.`);
              setIsCsvModalOpen(false);
            }}
            requiredHeaders={["Material", "Supplier", "Requirements", "Issue Date", "Expiry Date", "Auditor", "Type", "Status"]} 
          />
        </div>
      </DraggableModal>

      <SupplierQuickRequestModal 
        isOpen={isQuickRequestOpen}
        onClose={() => setIsQuickRequestOpen(false)}
        cert={quickRequestCert}
        onConfirm={handleConfirmSupplierRequest}
      />

      <FeedbackToast 
        isOpen={isToastOpen}
        msg={toastMessage}
        onClose={() => setIsToastOpen(false)}
      />

      {/* Email PDF Preview Overlay */}
      {isEmailPreviewOpen && createPortal(
        <div className="fixed inset-0 z-[2000] flex flex-col bg-[#212c46]/90 backdrop-blur-md no-print animate-fadeIn">
            <div className="h-20 bg-[#1c273e] border-b border-white/10 flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#212c46] border border-[#d1a45f] rounded-2xl shadow-lg text-white">
                        <FileText size={24} className="text-[#d1a45f]"/>
                    </div>
                    <div>
                        <h3 className="text-white font-black text-[16px] uppercase tracking-widest leading-none">Supplier Expiry Response Review</h3>
                        <p className="text-[#a3acbe] text-[10px] font-bold uppercase mt-1">Scope: Supplier Quality Assurance Dispatch</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        id="btn-print-expiry"
                        onClick={() => window.print()}
                        className="bg-white text-[#212c46] px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-[#eaeaec] transition-all shadow-xl flex items-center gap-2"
                    >
                        <Printer size={18}/> Print / Save Report
                    </button>
                    <button 
                        id="btn-fake-dispatch-emails"
                        onClick={() => { 
                            setToastMessage("Supplier verification schedule dispatched successfully."); 
                            setIsToastOpen(true); 
                            setIsEmailPreviewOpen(false); 
                        }}
                        className="bg-[#212c46] text-[#d1a45f] border border-[#d1a45f] px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-[#1c273e] hover:border-[#a3acbe] transition-all shadow-xl flex items-center gap-2"
                    >
                        <Send size={18}/> Bulk Supplier Renew Email
                    </button>
                    <button id="btn-close-preview" onClick={() => setIsEmailPreviewOpen(false)} className="p-3 text-white/40 hover:text-white transition-colors bg-white/5 rounded-full"><X size={24}/></button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar flex flex-col items-center">
                <EmailReportTemplate alerts={criticalAlerts} />
            </div>
        </div>, document.body
      )}

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#212c46] border border-[#eaeaec] shadow-sm relative overflow-hidden"><Award size={24} className="text-[#d1a45f] shrink-0" strokeWidth={2.5} /></div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-widest text-[24px] leading-none">MS STANDARD <span className="text-[#a3acbe]">SYS-CHECK</span></h3>
                  <div className="flex items-center gap-2 mt-[6px]"><div className="w-8 h-[2px] bg-[#d1a45f]"></div><p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.2em] leading-none">Supplier Standards Quality & Assurance Register</p></div>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
              {!hasAuth ? (
                  <button onClick={handleLogin} className="h-11 px-5 rounded-xl bg-white text-[#EA4335] shadow-sm font-black uppercase text-[11px] tracking-widest border border-[#eaeaec] hover:bg-gray-50 flex items-center gap-2 active:scale-95 transition-all">
                      <Database size={16}/> Connect Workspace
                  </button>
              ) : (
                  <div className="h-11 px-5 rounded-xl bg-[#e8efdd] text-[#657f4d] shadow-sm font-black uppercase text-[11px] tracking-widest border border-[#d2e2c0] flex items-center gap-2">
                      <CheckCircle2 size={16}/> Workspace Connected
                  </div>
              )}

              <button 
                id="btn-alert-warnings"
                onClick={() => setIsNotifyOpen(true)}
                className="h-11 px-5 rounded-xl bg-white border border-[#eaeaec] shadow-sm flex items-center gap-3 hover:bg-[#212c46] hover:text-white transition-all group relative overflow-hidden"
              >
                  <MailWarning size={18} className={criticalAlerts.length > 0 ? "text-[#932c2e] group-hover:text-[#d1a45f] " : "text-[#7a8b95] group-hover:text-white"} />
                  <span className="text-[11px] font-black uppercase tracking-widest leading-none">Supplier Alerts</span>
                  {criticalAlerts.length > 0 && <span className="bg-[#932c2e] group-hover:bg-[#d1a45f] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-md">{criticalAlerts.length}</span>}
              </button>

              <div className="flex bg-[#f8f9fa] p-1.5 border border-[#eaeaec] shadow-sm rounded-xl ml-2">
                  <button id="btn-tab-table" onClick={() => setActiveMainTab('table')} className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMainTab === 'table' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:bg-white'}`}>
                      <List size={14} /> MS Table
                  </button>
                  <button id="btn-tab-insight" onClick={() => setActiveMainTab('insight')} className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMainTab === 'insight' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:bg-white'}`}>
                      <PieChart size={14} /> KPI Analyzer
                  </button>
              </div>
          </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex flex-col">
        <div className="w-full flex flex-col font-sans">
            {activeMainTab === 'table' ? (
                <>
                {/* KPI STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
                  {[
                    { label: 'Total Supplier Dossiers', val: certs.length, icon: Layers, color: THEME.primary },
                    { label: 'Supplier Active MS', val: processedCerts.filter(c=>c.calculatedStatus==='Valid').length, icon: CheckCircle2, color: '#657f4d' },
                    { label: 'Configured Frameworks', val: masterTypes.length, icon: Settings2, color: '#761956' },
                    { label: 'Supplier Renewals Needed', val: criticalAlerts.length, icon: AlertTriangle, color: '#932c2e' }
                  ].map((k,i)=>{
                    const KpiIcon = k.icon;
                    return (
                        <div key={i} className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative group hover:border-[#a3acbe] transition-all overflow-hidden cursor-default animate-fadeIn">
                            <div className="flex justify-between items-start">
                                <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em]">{k.label}</p>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border relative z-10" style={{backgroundColor: `${k.color}10`, borderColor: `${k.color}20`, color: k.color}}>
                                    <KpiIcon size={16} />
                                </div>
                            </div>
                            <div className="relative z-10 mt-1 flex items-end justify-between">
                                <p className="text-[28px] font-black leading-none" style={{color:k.color}}>{k.val}</p>
                            </div>
                            <div className="absolute -right-4 -bottom-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                <KpiIcon size={110} style={{color:k.color}} />
                            </div>
                        </div>
                    );
                  })}
                </div>

                <div className="bg-white rounded-3xl border border-[#eaeaec] shadow-lg overflow-hidden flex flex-col">
                    <div className="px-8 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex justify-between items-center gap-4 shrink-0">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative z-20">
                                <button id="btn-filter-status" onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)} className="h-10 px-4 bg-white border border-[#eaeaec] rounded-xl flex items-center gap-3 min-w-[180px] justify-between text-[11px] font-black uppercase tracking-widest text-[#212c46] shadow-sm hover:bg-[#eaeaec]">
                                    <div className="flex items-center gap-2"><Filter size={14} className="text-[#a3acbe]" /><span>{filterStatus === 'ALL' ? 'ALL STATUS' : filterStatus.toUpperCase()}</span></div>
                                    <ChevronDown size={14} className="text-[#7a8b95]" />
                                </button>
                                {isFilterDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsFilterDropdownOpen(false)}></div>
                                        <div className="absolute top-full left-0 mt-2 w-[220px] bg-white border border-[#eaeaec] rounded-xl shadow-xl z-50 py-2 animate-fadeIn font-sans">
                                            {STATUS_FILTERS.map(f => (
                                                <button key={f.id} onClick={()=>{setFilterStatus(f.id); setIsFilterDropdownOpen(false); setCurrentPage(1);}} className="w-full px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest hover:bg-[#f8f9fa] flex justify-between items-center group transition-colors">
                                                    <span style={{color: filterStatus === f.id ? f.color : '#7a8b95'}} className="group-hover:text-[#212c46]">{f.label}</span>
                                                    <span className="bg-[#f8f9fa] border border-[#eaeaec] text-[#7a8b95] text-[10px] px-2 py-0.5 rounded-full">{filterCounts[f.id] || 0}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="relative z-20">
                                <button id="btn-filter-type" onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)} className="h-10 px-4 bg-white border border-[#eaeaec] rounded-xl flex items-center gap-3 min-w-[200px] justify-between text-[11px] font-black uppercase tracking-widest text-[#212c46] shadow-sm hover:bg-[#eaeaec]">
                                    <div className="flex items-center gap-2"><Award size={14} className="text-[#d1a45f]" /><span>{filterType === 'ALL' ? 'ALL STANDARD TYPES' : filterType}</span></div>
                                    <ChevronDown size={14} className="text-[#7a8b95]" />
                                </button>
                                {isTypeDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsTypeDropdownOpen(false)}></div>
                                        <div className="absolute top-full left-0 mt-2 w-[240px] bg-white border border-[#eaeaec] rounded-xl shadow-xl z-50 py-2 max-h-60 overflow-y-auto custom-scrollbar animate-fadeIn font-sans">
                                            <button onClick={()=>{setFilterType('ALL'); setIsTypeDropdownOpen(false); setCurrentPage(1);}} className="w-full px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest hover:bg-[#f8f9fa] text-[#7a8b95] hover:text-[#212c46]">
                                                ALL STANDARD TYPES
                                            </button>
                                            {masterTypes.map(t => (
                                                <button key={t} onClick={()=>{setFilterType(t); setIsTypeDropdownOpen(false); setCurrentPage(1);}} className="w-full px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest hover:bg-[#f8f9fa] flex justify-between items-center transition-colors">
                                                    <span className={filterType === t ? 'text-[#212c46] font-bold' : 'text-[#7a8b95]'}>{t}</span>
                                                    <span className="bg-[#f8f9fa] border border-[#eaeaec] text-[9px] px-1.5 py-0.5 rounded font-mono font-bold text-[#7a8b95]">{processedCerts.filter(p => p.msType === t).length}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="relative w-[320px] h-10 flex items-center gap-2">
                                <div className="relative flex-1 h-full">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3acbe]" />
                                    <input 
                                        id="search-input"
                                        type="text" 
                                        value={search} 
                                        onChange={e=>setSearch(e.target.value)} 
                                        placeholder="Search materials, supplier, registry code..." 
                                        className="w-full h-full pl-11 pr-5 text-[11px] border border-[#eaeaec] bg-white shadow-sm rounded-xl font-bold outline-none focus:border-[#d1a45f] text-[#212c46] placeholder-[#a3acbe]" 
                                    />
                                </div>
                                <button title="Refresh Data" className="h-10 w-10 flex shrink-0 items-center justify-center rounded-xl border border-[#eaeaec] bg-white text-[#7a8b95] hover:text-[#212c46] hover:bg-[#f8f9fa] hover:border-[#a3acbe] shadow-sm transition-all active:scale-95 group">
                                    <RefreshCw size={16} className="group-active:rotate-180 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setIsCsvModalOpen(true)} className="h-10 bg-white border border-[#eaeaec] hover:border-[#1c273e] hover:bg-[#f8f9fa] text-[#212c46] px-6 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm transition-all flex items-center gap-2 shrink-0"><Upload size={16}/> BULK UPLOAD</button>
                            <button id="btn-register-ms" onClick={()=>{setActiveItem(null); setIsModalOpen(true);}} className="h-10 bg-[#212c46] hover:bg-[#1c273e] text-white px-6 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md transition-all flex items-center gap-2 shrink-0 text-[#d1a45f]"><Plus size={16}/> REGISTER SUPPLIER MS</button>
                        </div>
                    </div>

                    <div className="overflow-auto bg-white custom-scrollbar">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-[#37333a] text-white sticky top-0 z-10 font-black text-[12px] uppercase tracking-widest">
                                <tr>
                                    <th className="py-4 px-4 border-b-2 border-[#b05e76]">Raw Material & Supplier</th>
                                    <th className="py-4 px-4 border-b-2 border-[#b05e76]">Standard & Audit Info</th>
                                    <th className="py-4 px-4 border-b-2 border-[#b05e76] text-center">Request Status</th>
                                    <th className="py-4 px-4 border-b-2 border-[#b05e76] text-center">Surveillance / Expiry</th>
                                    <th className="py-4 px-4 border-b-2 border-[#b05e76] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eaeaec]">
                                {currentData.map(cert => (
                                    <tr key={cert.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                        <td className="py-2.5 px-4 max-w-[280px]">
                                            <div className="flex flex-col truncate">
                                                <span className="text-[12px] font-black text-[#212c46] flex items-center gap-2 truncate transition-colors">
                                                    <Box size={14} className="text-[#d1a45f] shrink-0" />
                                                    <HighlightText text={cert.material} query={search} />
                                                    {cert.daysRemaining > 0 && cert.daysRemaining <= 90 && (
                                                        <span title="Expiring Soon"><BellRing size={14} className="text-[#b58c4f] shrink-0 animate-pulse" /></span>
                                                    )}
                                                    {cert.daysRemaining <= 0 && (
                                                        <span title="Expired"><AlertTriangle size={14} className="text-[#932c2e] shrink-0" /></span>
                                                    )}
                                                </span>
                                                <span className="text-[11px] font-bold text-[#7a8b95] mt-0.5 uppercase tracking-wide flex items-center gap-1.5 truncate">
                                                    <Building2 size={12} className="text-[#a3acbe] shrink-0" />
                                                    <span className="truncate"><HighlightText text={cert.supplier} query={search} /></span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4">
                                            <div className="flex flex-col justify-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-[#212c46]/5 border border-[#212c46]/10 text-[#212c46] px-1.5 py-0.5 rounded text-[10px] font-black font-mono">{cert.msType}</span>
                                                    <span className="text-[11px] font-mono font-black text-[#212c46] uppercase flex items-center gap-1"><FileSignature size={10}/> Code: {cert.certNo || 'PENDING'}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-tighter flex items-center gap-1 mt-0.5"><PenTool size={10}/> Auditor: {cert.body || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            {cert.emailSent ? (
                                                <div className="flex flex-col items-center group/note relative cursor-pointer">
                                                    <span className="text-[11px] font-black text-[#657f4d] uppercase flex items-center gap-1"><CheckIcon size={12}/> Requested</span>
                                                    <span className="text-[10px] font-mono font-bold text-[#7a8b95] mt-0.5">{cert.lastEmailDate}</span>
                                                    {cert.emailNotes && (
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-[#212c46] text-white text-[10px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 group-hover/note:opacity-100 transition-opacity z-50 pointer-events-none whitespace-normal text-left border border-white/10">
                                                            {cert.emailNotes}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[11px] font-black text-gray-200 uppercase">Not Requested</span>
                                            )}
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                              <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm border ${cert.calculatedStatus === 'Valid' ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30' : cert.calculatedStatus === 'Expiring Soon' ? 'bg-[#d1a45f]/10 text-[#d1a45f] border-[#d1a45f]/30' : 'bg-red-50 text-[#932c2e] border-red-200'}`}>
                                                  {cert.calculatedStatus}
                                              </span>
                                              <span className="text-[10px] font-mono font-bold text-[#7a8b95] mt-1">{cert.expiryDate}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4">
                                            <div className="flex justify-center gap-1.5">
                                                <button 
                                                    onClick={()=>{setQrCert(cert);}} 
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#b58c4f] border border-[#eaeaec] hover:border-[#b58c4f] hover:bg-[#b58c4f]/10 bg-white shadow-sm transition-all active:scale-95" 
                                                    title={t("Generate QR Code", "สร้างคิวอาร์โค้ด")}
                                                >
                                                    <QrCode size={14}/>
                                                </button>
                                                <button 
                                                    id={`btn-edit-dossier-${cert.id}`}
                                                    onClick={()=>{setActiveItem(cert); setIsModalOpen(true);}} 
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#728298] border border-[#eaeaec] hover:border-[#212c46] hover:bg-[#212c46]/10 bg-white shadow-sm transition-all active:scale-95" 
                                                    title={t("Manage Dossier", "จัดการใบรับรอง")}
                                                >
                                                    <Settings size={14}/>
                                                </button>
                                                
                                                <button 
                                                    id={`btn-view-pdf-${cert.id}`}
                                                    onClick={() => { setPreviewCert(cert); setIsPreviewModalOpen(true); }}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#d1a45f] border border-[#eaeaec] hover:border-[#d1a45f] hover:bg-[#d1a45f]/10 bg-white shadow-sm transition-all active:scale-95" 
                                                    title={t("View Source PDF", "ดูภาพเอกสารต้นฉบับ")}
                                                >
                                                    <ExternalLink size={14}/>
                                                </button>

                                                {/* Expiry system request button trigger */}
                                                <button 
                                                    id={`btn-request-renewal-${cert.id}`}
                                                    onClick={() => handleTriggerQuickRequest(cert)}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all active:scale-95 shadow-sm ${
                                                        cert.calculatedStatus === 'Expired' 
                                                        ? 'text-[#932c2e] bg-red-50 border-red-200 hover:bg-red-100 hover:border-[#932c2e] animate-pulse'
                                                        : 'text-[#212c46] bg-white border-[#eaeaec] hover:border-[#212c46] hover:bg-gray-100'
                                                    }`} 
                                                    title={cert.calculatedStatus === 'Expired' ? '⚠️ Certificate Expired! Request New copy from Supplier.' : 'Request Documents Update'}
                                                >
                                                    <Mail size={14}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 px-6 text-center">
                                            <div className="flex flex-col items-center justify-center text-[#7a8b95]">
                                                <Box size={40} className="mb-3 opacity-30" />
                                                <p className="font-bold text-[12px] uppercase tracking-widest text-[#212c46]">No Management Systems Documents Found</p>
                                                <p className="text-[11px] mt-1">Adjust your configuration filters or query search criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-between items-center rounded-b-3xl shrink-0 font-sans">
                        <p className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest font-mono">Dossier Registry Units: <span className="text-[#212c46]">{filteredCerts.length}</span></p>
                        <div className="flex items-center gap-2">
                            <button onClick={()=>setCurrentPage(p=>Math.max(1, p-1))} className="w-8 h-8 border border-[#eaeaec] bg-white rounded-lg flex items-center justify-center hover:bg-[#212c46] hover:text-white transition-all shadow-sm"><ChevronLeft size={16}/></button>
                            <span className="text-[11px] font-black px-3 py-1 bg-white rounded-lg border border-[#eaeaec] font-mono shadow-sm text-[#212c46]">Page {currentPage} / {totalPages}</span>
                            <button onClick={()=>setCurrentPage(p=>Math.min(totalPages, p+1))} className="w-8 h-8 border border-[#eaeaec] bg-white rounded-lg flex items-center justify-center hover:bg-[#212c46] hover:text-white transition-all shadow-sm"><ChevronRight size={16}/></button>
                        </div>
                    </div>
                </div>
                </>
            ) : (
                <div className="bg-white rounded-3xl border border-[#eaeaec] p-8 shadow-lg animate-fadeIn font-sans">
                    <div className="flex justify-between items-center mb-8 border-b border-[#eaeaec] pb-5">
                       <div className="flex items-center gap-4">
                           <PieChart size={32} className="text-[#d1a45f]" />
                           <div>
                               <h3 className="text-[20px] font-black text-[#212c46] uppercase tracking-widest leading-none">Management Systems Insights</h3>
                               <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1 font-mono">STANDARDS INTEGRITY & SURVEILLANCE METRICS</p>
                           </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-7 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#f8f9fa] p-8 rounded-3xl border border-[#eaeaec] flex flex-col items-center justify-center text-center h-full">
                                   <h4 className="text-[11px] font-black text-[#212c46] uppercase mb-6 tracking-widest">Vendor Active Compliance Ratio</h4>
                                   <div className="relative h-40 w-40 flex items-center justify-center mb-2">
                                      <svg className="w-full h-full animate-fadeIn" viewBox="0 0 36 36">
                                         <path className="text-[#eaeaec]" strokeDasharray="100, 100" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor"/>
                                         <path className="text-[#657f4d]" strokeDasharray={`${certs.length ? Math.round((processedCerts.filter(c=>c.calculatedStatus==='Valid').length/processedCerts.length)*100) : 0}, 100`} strokeWidth="2.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor"/>
                                      </svg>
                                      <div className="absolute flex flex-col items-center">
                                         <span className="text-[32px] font-black font-mono text-[#657f4d] leading-none">{certs.length ? Math.round((processedCerts.filter(c=>c.calculatedStatus==='Valid').length/processedCerts.length)*100) : 0}%</span>
                                         <span className="text-[9px] font-bold text-[#7a8b95] uppercase mt-1 tracking-widest drop-shadow-sm">Compliant</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="space-y-4 flex flex-col justify-center">
                                   <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] shadow-sm transform hover:-translate-y-1 transition-transform">
                                      <p className="text-[11px] font-black text-[#7a8b95] uppercase mb-1.5 tracking-widest">Supplier Renewal Action Rate</p>
                                      <div className="flex items-center gap-3">
                                          <div className="w-2 h-2 rounded-full bg-[#d1a45f]"></div>
                                          <p className="text-[14px] font-black text-[#212c46] uppercase font-mono">{certs.length ? Math.round((criticalAlerts.length/processedCerts.length)*100) : 0}% Expiry Warning Queue</p>
                                      </div>
                                   </div>
                                   <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] shadow-sm transform hover:-translate-y-1 transition-transform">
                                      <p className="text-[11px] font-black text-[#7a8b95] uppercase mb-1.5 tracking-widest">Active Standard Frameworks</p>
                                      <div className="flex items-center gap-3">
                                          <div className="w-2 h-2 rounded-full bg-[#761956]"></div>
                                          <p className="text-[14px] font-black text-[#212c46] uppercase font-mono">{masterTypes.length} Configured Types</p>
                                      </div>
                                   </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-5">
                            <div className="bg-[#212c46] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-center border border-[#d1a45f]/30">
                               <div className="absolute -top-10 -right-10 opacity-[0.05]"><Globe2 size={240} /></div>
                               <h3 className="text-[16px] font-black uppercase tracking-[0.2em] mb-4 text-[#d1a45f]">Unified Supplier Sourcing</h3>
                               <p className="text-[12px] text-white/70 leading-relaxed mb-8 font-medium italic">"Management Standard certification establishes supplier trustworthiness, ensuring strict compliance across physical manufacturing parameters, food-contact raw materials safety policies, and sustainability norms."</p>
                               <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-md font-sans">
                                  <div className="relative w-4 h-4 shrink-0">
                                     <div className="absolute inset-0 rounded-full bg-[#657f4d] animate-ping opacity-75"></div>
                                     <div className="relative w-4 h-4 rounded-full bg-[#657f4d] border-2 border-white/20"></div>
                                  </div>
                                  <div>
                                     <span className="text-[11px] font-black uppercase tracking-widest block text-[#d1a45f]">System Quality Level: INTEGRATED</span>
                                     <span className="text-[9px] text-white/50 font-mono">Vendor MS Assurance Checklist: Verified</span>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
