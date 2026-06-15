import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, Search, HelpCircle, Save, Trash2, X, ChevronLeft, ChevronRight,
  Award, FileText, Calendar, AlertTriangle, Layers, Filter, Eye,
  Activity, PlaySquare, Octagon, Settings2, CheckSquare, Plus, FileCheck, 
  Settings, Bell, CheckCircle2, Download, Upload, ExternalLink, 
  Clock, BadgeCheck, FileWarning, ShieldAlert, FolderKey, ChevronDown, Zap,
  Info, AlertOctagon, BellRing, History, MailWarning, FileClock, ClipboardList,
  Building2, Box, Globe, Globe2, ShieldAlert as MraIcon, Mail, UserCheck,
  FileSignature, Briefcase, MapPin, PlusCircle, PenTool, Link2, FileSearch, 
  Check as CheckIcon, List, PieChart, Printer, Send, QrCode, RefreshCw, Camera
} from 'lucide-react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { CsvUpload } from '../../../components/shared/CsvUpload';
import { CameraScanner } from '../../../components/shared/CameraScanner';
import Swal from 'sweetalert2';
import { HighlightText } from '../../../components/shared/HighlightText';
import { CertificatePreviewModal } from '../../../components/shared/CertificatePreviewModal';
import { initAuth, googleSignIn, logout, getAccessToken } from '../../../firebase';
import { sendGmailMessage } from '../../../services/gmailService';

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
  { code: 'RM-005', name: 'Tamarind Concentrate' }
];

const SYNCED_SUPPLIERS = [
  "Siam Vegetable Oil Co.", "Thai Roong Ruang Sugar", "Global Chem Trade", "Ingredient Solutions", "India Agro Export"
];

export const INITIAL_HALAL_CERTS = [
  { id: 'HL-26001', material: 'Pure Palm Oil', supplier: 'Siam Vegetable Oil Co.', certNo: 'CICOT.HL 10 A123 001 05 66', countryOrigin: 'Thailand', hcb: 'CICOT', countryHcb: 'Thailand', issueDate: '2025-05-01', expiryDate: '2026-05-30', file: 'halal_palm_2026.pdf', hcbStatus: ['CICOT recognise'], emailSent: true, lastEmailDate: '2026-05-01', emailNotes: 'Sent to procurement for renewal.' },
  { id: 'HL-26002', material: 'Refined Sugar', supplier: 'Thai Roong Ruang Sugar', certNo: 'CICOT.HL 10 B456 002 01 67', countryOrigin: 'Thailand', hcb: 'CICOT', countryHcb: 'Thailand', issueDate: '2026-01-10', expiryDate: '2027-01-09', file: 'halal_sugar_2027.pdf', hcbStatus: ['CICOT recognise'], emailSent: false },
  { id: 'HL-26003', material: 'Citric Acid Anhydrous', supplier: 'Global Chem Trade', certNo: 'JAKIM/(S)/(22.00)/492/2/1', countryOrigin: 'China', hcb: 'JAKIM', countryHcb: 'Malaysia', issueDate: '2024-11-20', expiryDate: '2025-11-19', file: 'halal_citric_2025.pdf', hcbStatus: ['JAKIM recognise'], emailSent: true, lastEmailDate: '2026-04-15', emailNotes: 'Supplier confirmed processing.' },
  { id: 'HL-26006', material: 'Soy Lecithin', supplier: 'Ingredient Solutions', certNo: 'USA-MRA-991', countryOrigin: 'USA', hcb: 'IFANCA', countryHcb: 'USA', issueDate: '2025-05-15', expiryDate: '2026-06-01', file: 'ifanica_cert.pdf', hcbStatus: ['JAKIM recognise'], emailSent: false },
  { id: 'HL-26007', material: 'Cocoa Powder', supplier: 'Global Chem Trade', certNo: 'MUI-ID-11', countryOrigin: 'Indonesia', hcb: 'HFCE', countryHcb: 'Belgium', issueDate: '2024-10-10', expiryDate: '2025-10-09', file: 'hfce_ cocoa.pdf', hcbStatus: ['BPJPH recognise'], emailSent: true, lastEmailDate: '2026-05-10', emailNotes: 'Critical alert sent to Purchase Head.' },
];

const STATUS_FILTERS = [
  { id: 'ALL', label: 'All Certificates', icon: Layers, color: THEME.primary },
  { id: 'Valid', label: 'Valid / Active', icon: CheckCircle2, color: '#657f4d' },
  { id: 'Expiring Soon', label: 'Expiry Alert', icon: Clock, color: '#b58c4f' },
  { id: 'Expired', label: 'Quarantined', icon: AlertTriangle, color: '#932c2e' },
  { id: 'MRA', label: 'MRA Check Req.', icon: MraIcon, color: '#761956' },
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
    <div className="bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl mx-auto text-black animate-fadeIn overflow-hidden flex flex-col border border-gray-100 relative">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page { size: A4 portrait; margin: 10mm 5mm 7mm 5mm; }
            body { background: white !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}} />
        <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-6">
            <div className="flex gap-4 items-center">
                <div className="w-16 h-16 border-4 border-black flex items-center justify-center rounded-xl bg-black">
                    <ShieldCheck size={40} color="white" />
                </div>
                <div>
                    <h1 className="text-[26px] font-black uppercase tracking-tighter leading-none">T All Intelligence</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Compliance & Regulatory Affairs</p>
                    <p className="text-[9px] text-gray-700 mt-0.5 font-bold">Bangkok, Thailand • ISO 22000 Certified System</p>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-lg font-black uppercase tracking-widest bg-[#932c2e] text-white px-3 py-1 inline-block">ALERT</h2>
                <p className="text-[10px] font-black mt-2 font-mono">DATE: {TODAY.toLocaleDateString()}</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Confidential Report</p>
            </div>
        </div>

        <div className="mb-6">
            <h3 className="text-center text-md font-black uppercase underline tracking-[0.25em] mb-4">Procurement Monthly Action Summary</h3>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-1">
                <p className="text-[11px] font-bold">TO: Procurement Department Team</p>
                <p className="text-[11px] font-bold text-[#932c2e]">SUBJECT: Immediate Action Required: Halal Certification Expiry</p>
                <p className="text-[10px] text-gray-600 mt-2 leading-relaxed italic">The materials listed below have reached critical threshold or expired. Please coordinate with suppliers immediately to obtain updated dossiers to maintain production compliance.</p>
            </div>
        </div>

        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-100 border-y-2 border-black">
                    <th className="p-3 text-[10px] font-black uppercase text-left border-x border-gray-300">Raw Material / Item</th>
                    <th className="p-3 text-[10px] font-black uppercase text-left border-x border-gray-300">Supplier Name</th>
                    <th className="p-3 text-[10px] font-black uppercase text-center border-x border-gray-300 w-28">Expiry Date</th>
                    <th className="p-3 text-[10px] font-black uppercase text-center border-x border-gray-300 w-24">Urgency</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {alerts.map(item => {
                    const days = calculateDaysRemaining(item.expiryDate);
                    return (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-3 text-[11px] font-black uppercase border-x border-gray-200">{item.material}</td>
                            <td className="p-3 text-[10px] font-bold text-gray-600 border-x border-gray-200">{item.supplier}</td>
                            <td className="p-3 text-[10px] text-center font-mono font-bold border-x border-gray-200">{item.expiryDate}</td>
                            <td className={`p-3 text-[10px] text-center font-black uppercase border-x border-gray-200 ${days < 0 ? 'text-[#932c2e]' : 'text-[#b58c4f]'}`}>
                                {days < 0 ? 'EXPIRED' : `${days} DAYS`}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>

        <div className="mt-auto pt-10 border-t-2 border-black/10">
            <div className="flex justify-between items-end">
                <div className="text-center w-56">
                    <div className="border-b border-black h-10 mb-2"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black">Authorized Compliance Officer</p>
                    <p className="text-[9px] text-gray-500 uppercase">T All Intelligence QA Dept.</p>
                </div>
                
                <div className="relative w-28 h-28 flex items-center justify-center opacity-30 rotate-12 -mb-4">
                    <div className="absolute inset-0 border-4 border-[#932c2e] rounded-full flex flex-col items-center justify-center">
                        <p className="text-[9px] font-black text-[#932c2e] uppercase text-center leading-none tracking-tighter">HALAL<br/>ALERT<br/>SYSTEM</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Document Registry: {Date.now()}</p>
                    <p className="text-[9px] font-bold text-gray-400">Page 1 of 1</p>
                </div>
            </div>
        </div>
    </div>
);

const NotificationPanel = ({ isOpen, onClose, alerts, onPreview }: any) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[1000] flex justify-end">
            <div className="absolute inset-0 bg-[#212c46]/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-[#932c2e] h-full shadow-2xl flex flex-col animate-fadeIn overflow-hidden border-l border-[#d7a1a1]">
                <div className="p-6 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <MailWarning size={20} className="text-white" />
                        <h3 className="font-black text-[14px] uppercase tracking-widest leading-none">Procurement Dispatch</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white"><X size={18} /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2 bg-black/10">
                    {alerts.length === 0 ? (
                        <div className="text-center py-20 text-white/50">
                            <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20"/>
                            <p className="text-[12px] font-black uppercase tracking-widest">No Priority Alerts</p>
                        </div>
                    ) : alerts.map((item: any) => {
                        const days = calculateDaysRemaining(item.expiryDate);
                        return (
                            <div key={item.id} className="p-3 rounded-xl bg-white shadow-lg border-l-4 border-[#932c2e]">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-[10px] font-black text-[#212c46] uppercase truncate max-w-[160px]">{item.material}</h4>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${days < 0 ? 'bg-[#932c2e]/10 text-[#932c2e]' : 'bg-[#d1a45f]/10 text-[#d1a45f]'}`}>
                                        {days < 0 ? 'EXPIRED' : `${days}D`}
                                    </span>
                                </div>
                                <p className="text-[9px] text-[#7a8b95] font-bold truncate">{item.supplier}</p>
                                {item.emailSent && <div className="mt-1 text-[8px] text-[#657f4d] font-black flex items-center gap-1 uppercase"><CheckIcon size={10}/> Sent on {item.lastEmailDate}</div>}
                            </div>
                        )
                    })}
                </div>

                <div className="p-5 bg-white border-t border-[#d7a1a1] shrink-0 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
                    <button 
                        onClick={onPreview}
                        className="w-full py-4 bg-[#cf7d65] text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-[#b9684a] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                    >
                        <Mail size={16}/> PREVIEW & SEND BULK MAIL
                    </button>
                    <p className="text-[8px] text-center text-[#7a8b95] mt-3 font-bold uppercase tracking-widest opacity-60 italic">Automated monthly summary dispatcher active</p>
                </div>
            </div>
        </div>, document.body
    );
};

const ConfigModal = ({ isOpen, title, items, onSave, onClose }: any) => {
    const [inputValue, setInputValue] = useState('');
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-fadeIn border border-white">
                <div className="p-5 bg-[#212c46] text-white flex justify-between items-center">
                    <h4 className="text-[12px] font-black uppercase tracking-widest">{title}</h4>
                    <button onClick={onClose}><X size={16}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex gap-2">
                        <input value={inputValue} onChange={e=>setInputValue(e.target.value)} placeholder="Add new value..." className="flex-1 px-4 py-2 border border-[#eaeaec] rounded-xl text-[12px] outline-none font-bold" />
                        <button onClick={()=>{ if(inputValue) {onSave(inputValue); setInputValue('');} }} className="bg-[#212c46] text-white px-4 rounded-xl font-bold uppercase text-[10px]">Add</button>
                    </div>
                    <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                        {items.map((it: string, i: number) => <div key={i} className="flex justify-between items-center p-2 bg-[#f8f9fa] rounded-lg text-[11px] font-bold uppercase">{it}</div>)}
                    </div>
                </div>
            </div>
        </div>, document.body
    );
};

function CertModal({ isOpen, onClose, onSave, item }: any) {
  const [activeTab, setActiveTab] = useState('item');
  const [formData, setFormData] = useState<any>({ material: '', supplier: '', certNo: '', countryOrigin: '', hcb: '', countryHcb: '', issueDate: '', expiryDate: '', hcbStatus: [], emailNotes: '', otherDocs: [] });
  
  const [masterCountries, setMasterCountries] = useState(['Thailand', 'Malaysia', 'Indonesia', 'China', 'USA', 'India', 'Belgium']);
  const [masterHcbs, setMasterHcbs] = useState(['CICOT', 'JAKIM', 'MUI', 'HFCE', 'JUH', 'SGS (Halal)', 'BPJPH', 'IFANCA']);
  const [masterHcbStatuses, setMasterHcbStatuses] = useState(['CICOT recognise', 'JAKIM recognise', 'BPJPH recognise', 'GSO recognise']);
  
  const [isConfigCountryOpen, setIsConfigCountryOpen] = useState(false);
  const [isConfigHcbStatusOpen, setIsConfigHcbStatusOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (item) setFormData({ ...item });
      else setFormData({ material: SYNCED_ITEMS[0].name, supplier: SYNCED_SUPPLIERS[0], certNo: '', countryOrigin: 'Thailand', hcb: 'CICOT', countryHcb: 'Thailand', issueDate: '', expiryDate: '', hcbStatus: [], emailNotes: '', otherDocs: [] });
      setActiveTab('item');
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const mraWarning = formData.countryOrigin && formData.countryHcb && formData.countryOrigin !== formData.countryHcb;

  const toggleHcbStatus = (status: string) => {
    setFormData((prev: any) => {
        const current = prev.hcbStatus || [];
        if (current.includes(status)) return { ...prev, hcbStatus: current.filter((s: string) => s !== status) };
        return { ...prev, hcbStatus: [...current, status] };
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#212c46]/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[850px] flex flex-col overflow-hidden border border-white/60 h-[85vh]">
        <div className="bg-[#212c46] px-6 py-5 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <Award size={24} className="text-[#d1a45f]" />
            <div>
              <h3 className="text-[16px] font-black text-white uppercase tracking-widest leading-none">{item ? 'EDIT DOSSIER RECORD' : 'NEW HALAL REGISTRATION'}</h3>
              <p className="text-[9px] font-bold text-[#d1a45f] uppercase tracking-widest mt-1 opacity-80">Supplier Quality Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-[#a3acbe] hover:text-white"><X size={18} /></button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-60 bg-[#f8f9fa] border-r border-[#eaeaec] p-4 space-y-1 shrink-0">
             {[
               { id: 'item', label: 'Item & Supplier', icon: Box },
               { id: 'cert', label: 'Halal Certificate', icon: FileSignature },
               { id: 'oth', label: 'OTH Document', icon: Link2 },
               { id: 'email', label: 'Email Note', icon: History }
             ].map(tab => {
                const TabIcon = tab.icon;
                return (
                    <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all uppercase text-[11px] font-black tracking-widest ${activeTab === tab.id ? 'bg-[#212c46] text-white shadow-lg' : 'text-[#7a8b95] hover:bg-white hover:text-[#212c46]'}`}>
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
                         <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">Raw Material (Sync Item Master)</label>
                         <select value={formData.material} onChange={e=>setFormData({...formData, material: e.target.value})} className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#212c46] bg-white cursor-pointer">
                            {SYNCED_ITEMS.map(it => <option key={it.code} value={it.name}>{it.code} : {it.name}</option>)}
                         </select>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">Supplier Name (Sync SupplierQA)</label>
                         <select value={formData.supplier} onChange={e=>setFormData({...formData, supplier: e.target.value})} className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#212c46] bg-white cursor-pointer">
                            {SYNCED_SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                      </div>
                      <div>
                         <div className="flex justify-between items-center mb-1.5">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">Country of Origin (COO)</label>
                            <button onClick={()=>setIsConfigCountryOpen(true)} className="text-[#212c46] hover:text-[#374425] transition-all"><Settings size={14}/></button>
                         </div>
                         <select value={formData.countryOrigin} onChange={e=>setFormData({...formData, countryOrigin: e.target.value})} className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none bg-white">
                            {masterCountries.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'cert' && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="p-6 bg-[#f8f9fa] rounded-2xl border border-[#eaeaec] space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="col-span-2">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">Halal Certificate Number</label>
                            <input value={formData.certNo} onChange={e=>setFormData({...formData, certNo: e.target.value.toUpperCase()})} className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[13px] font-mono font-bold uppercase focus:border-[#212c46]" placeholder="HC-XXXX-XXXX" />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">HCB Body</label>
                            <select value={formData.hcb} onChange={e=>setFormData({...formData, hcb: e.target.value})} className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none bg-white">
                               {masterHcbs.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">HCB Resident Country</label>
                            <select value={formData.countryHcb} onChange={e=>setFormData({...formData, countryHcb: e.target.value})} className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none bg-white">
                               {masterCountries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            {mraWarning && (
                                <div className="mt-3 bg-[#761956]/5 border border-[#761956]/30 p-4 rounded-xl flex gap-4 items-center animate-fadeIn shadow-sm">
                                    <MraIcon size={24} className="text-[#761956] shrink-0" />
                                    <div className="text-[10px] font-bold text-[#761956] uppercase leading-relaxed tracking-tight">
                                        Country Status Alert: Material originates from {formData.countryOrigin} but HCB is based in {formData.countryHcb}. 
                                        <br/><span className="font-black underline italic">Manual MRA Verification Protocol Triggered.</span>
                                    </div>
                                </div>
                            )}
                         </div>
                      </div>

                      <div>
                         <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">HCB Status / Recognitions (Multi-select)</label>
                            <button onClick={()=>setIsConfigHcbStatusOpen(true)} className="text-[#212c46] hover:text-[#1c273e] transition-all"><Settings size={14}/></button>
                         </div>
                         <div className="grid grid-cols-2 gap-2 p-3 bg-white border border-[#eaeaec]/40 rounded-xl">
                            {masterHcbStatuses.map(st => (
                                <label key={st} className="flex items-center gap-2 p-2 hover:bg-[#f3f3f1] rounded-lg cursor-pointer">
                                    <input type="checkbox" checked={formData.hcbStatus.includes(st)} onChange={()=>toggleHcbStatus(st)} className="w-4 h-4 rounded text-[#212c46] focus:ring-[#212c46]" />
                                    <span className="text-[10px] font-bold uppercase text-[#212c46]">{st}</span>
                                </label>
                            ))}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-[#eaeaec] pt-5">
                         <div>
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase mb-1.5 block tracking-wider">Expiry Date</label>
                            <input type="date" value={formData.expiryDate} onChange={e=>setFormData({...formData, expiryDate: e.target.value})} className="w-full h-11 px-4 border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none bg-white font-mono" />
                         </div>
                         <div className="flex items-end">
                            <div className="w-full h-11 bg-white border border-[#eaeaec] border-dashed rounded-xl flex items-center justify-center text-[#7a8b95] hover:text-[#212c46] transition-all cursor-pointer">
                               <Upload size={16} className="mr-2"/> <span className="text-[10px] font-black uppercase tracking-widest">Upload Cert (PDF)</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'oth' && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="p-6 bg-[#f8f9fa] rounded-2xl border border-[#eaeaec] space-y-4 shadow-inner">
                      <h4 className="text-[11px] font-black text-[#728298] uppercase tracking-widest flex items-center gap-2 border-b border-[#eaeaec] pb-2"><Link2 size={16}/> Mandatory Support Dossier</h4>
                      <div className="grid grid-cols-1 gap-3">
                         {['Process Flow Diagram', 'RM Specification Sheet', 'Composition / Formula', 'Third-Party Halal Lab Report'].map(doc => (
                             <div key={doc} className="flex justify-between items-center p-3 bg-white border border-[#eaeaec] rounded-xl hover:shadow-md transition-all">
                                <span className="text-[10px] font-bold uppercase text-[#212c46]">{doc}</span>
                                <div className="flex gap-2">
                                   <button type="button" className="p-2 text-[#7a8b95] hover:text-[#212c46] transition-colors"><Upload size={16}/></button>
                                   <button type="button" className="p-2 text-[#7a8b95] hover:text-[#212c46] transition-colors"><Eye size={16}/></button>
                                </div>
                             </div>
                         ))}
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'email' && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="p-6 bg-[#f8f9fa] rounded-2xl border border-[#eaeaec] space-y-4 shadow-inner">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-black text-[#b58c4f] uppercase tracking-widest flex items-center gap-2"><Mail size={16}/> Dispatch Communication Notes</h4>
                        <button onClick={()=>setFormData({...formData, emailNotes: ''})} className="text-[9px] font-black text-[#932c2e] hover:underline uppercase">Reset History</button>
                      </div>
                      <textarea 
                        value={formData.emailNotes} 
                        onChange={e=>setFormData({...formData, emailNotes: e.target.value})}
                        className="w-full h-40 bg-white border border-[#eaeaec] rounded-xl p-4 text-[12px] font-medium outline-none focus:border-[#d1a45f] resize-none"
                        placeholder="Log procurement emails, follow-up dates, or supplier feedback here..."
                      />
                      <div className="p-4 bg-white/60 border border-[#eaeaec] rounded-xl flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-[#d1a45f] animate-ping"></div>
                         <p className="text-[10px] font-bold text-[#7a8b95] uppercase leading-tight">Logs are historical. You can clear them once the new certificate is successfully integrated into the system.</p>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>

        <div className="px-8 py-5 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-between items-center shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-white border border-[#eaeaec] text-[#7a8b95] rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#f3f3f1]">Discard</button>
          <button onClick={()=>onSave(formData)} className="bg-[#212c46] text-white px-10 py-2.5 rounded-xl font-black text-[11px] uppercase shadow-lg hover:bg-[#1c273e] transition-all flex items-center gap-2 active:scale-95"><Save size={16}/> Save Master Record</button>
        </div>
      </div>
      
      <ConfigModal isOpen={isConfigCountryOpen} title="Manage Master Countries" items={masterCountries} onSave={(val: string)=>setMasterCountries([...masterCountries, val])} onClose={()=>setIsConfigCountryOpen(false)} />
      <ConfigModal isOpen={isConfigHcbStatusOpen} title="Manage Recognitions" items={masterHcbStatuses} onSave={(val: string)=>setMasterHcbStatuses([...masterHcbStatuses, val])} onClose={()=>setIsConfigHcbStatusOpen(false)} />
    </div>, document.body
  );
}

function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[600] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 z-[610] w-full max-w-[420px] bg-white h-full shadow-2xl border-l-[6px] border-[#212c46] flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="py-4 px-6 bg-[#212c46] text-white shrink-0 relative z-10">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-transparent border-2 border-[#d1a45f] rounded-xl flex items-center justify-center shadow-lg text-[#d1a45f]"><ShieldCheck size={20} /></div>
              <div><h3 className="text-base font-black uppercase tracking-widest leading-none">HALAL Dossier Guide</h3><p className="text-[10px] font-medium opacity-60 mt-1 uppercase tracking-widest">คู่มือบริหารจัดการใบรับรองขั้นสูง</p></div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white"><X size={20}/></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-white text-[#212c46]">
          <section>
            <h4 className="text-[13px] font-black uppercase border-b-2 border-[#eaeaec] pb-2 mb-3 flex items-center gap-2 text-[#761956]"><Globe size={16}/> 1. MRA Verification Logic</h4>
            <p className="text-[11px] font-medium leading-relaxed bg-[#761956]/5 p-4 rounded-xl border border-[#761956]/20">
               <span className="font-black text-[#761956]">Cross-Border Verification:</span> หากประเทศที่ผลิต (COO) และประเทศที่ตั้งของหน่วยงานรับรอง (COH) ไม่ตรงกัน ระบบจะแสดงป้ายกำกับ <span className="font-black underline">MRA REQ</span> 
               <br/><br/>
               ฝ่ายคุณภาพต้องรีวิวสถานะการ "Recognise" ของหน่วยงานนั้นๆ ว่าได้รับการรับรองร่วมกับมาตรฐานไทย (CICOT) หรือมาตฐานสากล (GSO/SMIIC) หรือไม่
            </p>
          </section>
          
          <section>
            <h4 className="text-[13px] font-black uppercase border-b-2 border-[#eaeaec] pb-2 mb-3 flex items-center gap-2 text-[#932c2e]"><MailWarning size={16}/> 2. Automated Dispatcher</h4>
            <p className="text-[11px] font-medium leading-relaxed">
               ระบบแจ้งเตือนอีเมลอัตโนมัติจะส่งข้อมูลสรุปให้ <span className="font-black underline italic">ฝ่ายจัดซื้อ (Procurement)</span> ประจำเดือน โดยคัดกรองดังนี้:
            </p>
            <div className="mt-3 space-y-2">
               <div className="flex gap-3 p-3 bg-[#fff9eb] rounded-xl border border-[#f5d098]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#e69e5d] mt-1.5"></div>
                  <p className="text-[10px] text-[#7a8b95] font-bold"><span className="font-black text-[#212c46]">PRE-WARNING (≤ 30 DAYS):</span> แจ้งล่วงหน้าเพื่อเตรียมขอเอกสารชุดใหม่จาก Supplier</p>
               </div>
               <div className="flex gap-3 p-3 bg-[#fdf2f2] rounded-xl border border-[#f5c6c6]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#932c2e] mt-1.5"></div>
                  <p className="text-[10px] text-[#7a8b95] font-bold"><span className="font-black text-[#932c2e]">CRITICAL (EXPIRED):</span> แจ้งระงับการสั่งซื้อทันทีจนกว่าจะมีเอกสารอัปเดต</p>
               </div>
            </div>
          </section>

          <section>
            <h4 className="text-[13px] font-black uppercase border-b-2 border-[#eaeaec] pb-2 mb-3 flex items-center gap-2 text-[#212c46]"><Zap size={16} /> 3. Smart Table Actions</h4>
            <div className="p-3 bg-[#f8f9fa] rounded-xl space-y-3 border border-[#eaeaec]">
              {[
                { label: 'Generate QR', icon: QrCode, bg: '#b58c4f', desc: 'สร้างและดาวน์โหลด QR Code ประจำใบรับรอง สำหรับการตรวจสอบอย่างรวดเร็ว' },
                { label: 'Manage Dossier', icon: FileSearch, bg: '#728298', desc: 'เปิดมอดัลเพื่อจัดการข้อมูลใบเซอร์ ตรวจสอบความถูกต้องและจัดการไฟล์แนบ' },
                { label: 'View Source', icon: ExternalLink, bg: '#d1a45f', desc: 'เรียกดูไฟล์ใบรับรองดิจิทัลต้นฉบับได้ทันที เพื่อเปรียบเทียบข้อมูล' },
                { label: 'Manual Mail', icon: Mail, bg: '#212c46', desc: 'ส่งอีเมลแจ้งเตือน Supplier เฉพาะรายการนี้โดยตรง กรณีต้องการเอกสารเร่งด่วน' }
              ].map((btn, idx) => {
                const ActIcon = btn.icon;
                return (
                    <div key={idx} className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white shadow-sm" style={{backgroundColor: btn.bg}}><ActIcon size={14}/></div>
                        <p className="text-[11px] text-[#7a8b95] leading-relaxed"><span className="font-black text-[#212c46]">{btn.label}:</span> {btn.desc}</p>
                    </div>
                );
              })}
            </div>
          </section>
        </div>
        <div className="py-4 px-6 bg-white border-t border-[#eaeaec] shrink-0"><button onClick={onClose} className="w-full py-3 bg-[#212c46] text-white font-black rounded-xl uppercase text-[11px] tracking-[0.2em] hover:bg-[#1c273e] transition-all shadow-md active:scale-95">UNDERSTOOD</button></div>
      </div>
    </>, document.body
  );
}

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
            setCustomMsg(`เรียน แผนกตรวจสอบคุณภาพและรับรองด่านฮาลาลของ บริษัท ${cert.supplier},\n\nเนื่องด้วย ทางบริษัทฯ ตรวจพบว่าใบรับรองฮาลาล ของวัตถุดิบ ${cert.material} (รหัสใบอนุญาต: ${cert.certNo || 'N/A'}) กำลังจะหมดอายุหรือหมดอายุลงแล้วในวันที่ ${cert.expiryDate}.\n\nจึงใคร่ขอความอนุเคราะห์จากท่านในการจัดส่งใบรับรองฉบับปรับปรุงใหม่ล่าสุด เพื่อให้แน่ใจว่าการดำเนินการเป็นไปตามข้อกำหนดของฮาลาลที่ถูกต้อง\n\nขอแสดงความนับถือ,\nฝ่ายการประกันคุณภาพ (QA Quality Assurance Team)`);
            
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
                const subject = `[Notification] เอกสารรับรองฮาลาลสำหรับวัตถุดิบ ${cert.material} กำลังจะหมดอายุ`;
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
                        <h4 className="text-[12px] font-black uppercase tracking-widest text-[#d1a45f]">Official Supplier Halal Request</h4>
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
                            <span className="text-gray-400 uppercase block leading-none mb-1">Cert Body</span>
                            <span className="text-[#212c46] uppercase">{cert.hcb} ({cert.countryHcb})</span>
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

// Simple Dispatch Feedback Modal for successfully dispatched requests
const FeedbackToast = ({ isOpen, msg, onClose }: any) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => onClose(), 4000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed bottom-6 right-6 z-[2000] animate-slideUp">
            <div className="bg-[#212c46] text-white px-5 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#657f4d]"/>
                <p className="text-[11px] font-bold tracking-wide">{msg}</p>
                <button onClick={onClose} className="ml-2 text-white/50 hover:text-white"><X size={14}/></button>
            </div>
        </div>, document.body
    );
};

import { useLanguage } from '../../../context/LanguageContext';
import { useNotifications } from '../../../context/NotificationContext';
import SkeletonLoading from '../../../components/shared/SkeletonLoading';

export default function HalalCertificates() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { halalCerts, updateHalalCerts, referenceDate } = useNotifications();
  const [certs, setCerts] = useState(halalCerts.length > 0 ? halalCerts : INITIAL_HALAL_CERTS);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (halalCerts.length > 0) {
      setCerts(halalCerts);
    }
  }, [halalCerts]);

  const [activeMainTab, setActiveMainTab] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [qrCert, setQrCert] = useState<any>(null);
  const [previewCert, setPreviewCert] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust to fit perfectly

  const [quickRequestCert, setQuickRequestCert] = useState<any>(null);
  const [isQuickRequestOpen, setIsQuickRequestOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);

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
                  emailNotes: notes
              };
          }
          return c;
      });
      setCerts(updated);
      updateHalalCerts(updated);
      const certificate = certs.find(c => c.id === id);
      setToastMessage(`Sent official request to ${certificate?.supplier || 'vendor'} successfully!`);
      setIsToastOpen(true);
  };

  const handleScanSuccess = (decodedText: string) => {
    console.log("Scanned text successfully:", decodedText);
    
    // Check if the decoded text contains is a URL and extract the certId query parameter
    let targetId = decodedText;
    try {
      if (decodedText.startsWith('http')) {
        const urlObj = new URL(decodedText);
        const certIdParam = urlObj.searchParams.get('certId');
        if (certIdParam) {
          targetId = certIdParam;
        }
      }
    } catch (e) {
      console.error("Failed to parse URL, matching text directly", e);
    }

    // Try to find a matching certificate by:
    // 1. ID (HL-xxxxx)
    // 2. Certificate Number (c.certNo)
    // 3. Or a case-insensitive matching in Material
    const foundCert = certs.find(c => 
      c.id.toLowerCase().trim() === targetId.toLowerCase().trim() ||
      c.certNo.toLowerCase().trim() === targetId.toLowerCase().trim() ||
      (targetId.length > 3 && c.certNo.toLowerCase().includes(targetId.toLowerCase())) ||
      c.material.toLowerCase().trim() === targetId.toLowerCase().trim()
    );

    if (foundCert) {
      // Instantly open details
      setActiveItem(foundCert);
      setIsScannerOpen(false);
      setIsModalOpen(true);
      setToastMessage(`SUCCESS: Identified Halal dossier for ${foundCert.material}!`);
      setIsToastOpen(true);
    } else {
      // If not, ask the user to link/register
      Swal.fire({
        title: 'HALAL DOSSIER UNRESOLVED',
        html: `No record found for <span class="font-mono font-bold text-[#932c2e]">${targetId}</span>.<br/><br/>Would you like to register a new Halal certificate and link it to this scanner input?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'YES, REGISTER NEW',
        cancelButtonText: 'CANCEL',
        confirmButtonColor: '#212c46',
        cancelButtonColor: '#7a8b95'
      }).then((result) => {
        if (result.isConfirmed) {
          setActiveItem({
            material: '',
            supplier: '',
            certNo: targetId, // Pre-link scanned barcode/QR value
            countryOrigin: 'Thailand',
            hcb: '',
            countryHcb: '',
            issueDate: '',
            expiryDate: '',
            hcbStatus: [],
            emailNotes: ''
          });
          setIsScannerOpen(false);
          setIsModalOpen(true);
        }
      });
    }
  };

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
            calculatedStatus: getStatusFromExpiry(days),
            hasMraIssue: c.countryOrigin !== c.countryHcb
        };
    });
  }, [certs, refDateObj]);

  const criticalAlerts = useMemo(() => processedCerts.filter(c => c.daysRemaining <= 90), [processedCerts]);
  const mraCount = useMemo(() => processedCerts.filter(c => c.hasMraIssue).length, [processedCerts]);

  const filteredCerts = useMemo(() => {
    return processedCerts.filter(c => {
      const matchStatus = filterStatus === 'ALL' || c.calculatedStatus === filterStatus || (filterStatus === 'MRA' && c.hasMraIssue);
      const matchSearch = c.material.toLowerCase().includes(search.toLowerCase()) || 
                          c.supplier.toLowerCase().includes(search.toLowerCase()) ||
                          c.certNo.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [processedCerts, filterStatus, search]);

  const currentData = filteredCerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredCerts.length / itemsPerPage) || 1;

  const filterCounts = useMemo(() => {
    const counts: any = { 'ALL': processedCerts.length, 'MRA': mraCount };
    STATUS_FILTERS.forEach(f => {
      if(f.id !== 'ALL' && f.id !== 'MRA') counts[f.id] = processedCerts.filter(q => q.calculatedStatus === f.id).length;
    });
    return counts;
  }, [processedCerts, mraCount]);

  const handleSave = (data: any) => {
    let updated;
    if (activeItem) {
      updated = certs.map(c => c.id === activeItem.id ? { ...c, ...data } : c);
    } else {
      updated = [{ ...data, id: `HL-${Math.floor(Math.random()*10000).toString().padStart(5, '0')}` }, ...certs];
    }
    setCerts(updated);
    updateHalalCerts(updated);
    setIsModalOpen(false);
    setActiveItem(null);
  };

  if (isLoading) {
    return <SkeletonLoading layout="dashboard" />;
  }

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 relative">
      
      {/* USER GUIDE FLOATING TAB */}
      <button 
        onClick={() => setIsGuideOpen(true)}
        className="fixed right-0 top-[80px] z-[100] bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#212c46] hover:text-white hover:border-[#212c46] transition-all duration-500 flex flex-col items-center gap-4 group no-print"
      >
        <HelpCircle size={18} className="text-[#d1a45f] group-hover:text-white transition-colors" />
        <span className="[writing-mode:vertical-rl] rotate-180 font-black text-[10px] uppercase tracking-[0.3em]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <CertModal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setActiveItem(null);}} onSave={handleSave} item={activeItem} />
      
      <CertificatePreviewModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => { setIsPreviewModalOpen(false); setPreviewCert(null); }} 
        cert={previewCert} 
        type="halal" 
      />
      
      <DraggableModal 
        isOpen={!!qrCert} 
        onClose={() => setQrCert(null)}
        title={t("Dossier QR Code", "คิวอาร์โค้ดใบรับรอง")}
      >
        <div className="p-8 flex flex-col items-center gap-4 bg-white" id="qr-code-halal-container">
            <div className="p-4 bg-white border border-[#eaeaec] rounded-2xl shadow-sm">
                <QRCodeSVG 
                    value={`${window.location.origin}/certificates/halal?certId=${qrCert?.id}`} 
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
                    const svg = document.querySelector("#qr-code-halal-container svg");
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

      <DraggableModal 
        isOpen={isCsvModalOpen} 
        onClose={() => setIsCsvModalOpen(false)}
        title="BULK UPLOAD HALAL CERTIFICATES"
      >
        <div className="p-6">
          <CsvUpload 
            onUpload={(data) => {
              console.log("Bulk upload Halal data from component:", data);
              let updatedCount = 0;
              let insertedCount = 0;

              // Copy of current certs to mutate/merge
              let tempCerts = [...certs];

              data.forEach((row, index) => {
                const material = row["Material"] || row["material"] || "";
                const supplier = row["Supplier"] || row["supplier"] || "";
                const issueDate = row["Issue Date"] || row["issueDate"] || row["IssueDate"] || "";
                const expiryDate = row["Expiry Date"] || row["expiryDate"] || row["ExpiryDate"] || "";
                const hcb = row["Certification Body"] || row["hcb"] || row["CertificationBody"] || "CICOT";
                const certNo = row["Cert No"] || row["certNo"] || row["Certificate Number"] || `CICOT.HL-${Math.floor(1000 + Math.random()*9000)}`;
                const countryOrigin = row["Country Origin"] || row["countryOrigin"] || "Thailand";
                const countryHcb = row["Country HCB"] || row["countryHcb"] || "Thailand";

                if (!material || !supplier) return;

                // Find existing cert with matching Material AND Supplier
                const existingIndex = tempCerts.findIndex(
                  c => c.material.toLowerCase().trim() === material.toLowerCase().trim() &&
                       c.supplier.toLowerCase().trim() === supplier.toLowerCase().trim()
                );

                if (existingIndex !== -1) {
                  // Update existing
                  tempCerts[existingIndex] = {
                    ...tempCerts[existingIndex],
                    issueDate: issueDate || tempCerts[existingIndex].issueDate,
                    expiryDate: expiryDate || tempCerts[existingIndex].expiryDate,
                    hcb: hcb || tempCerts[existingIndex].hcb,
                    certNo: certNo || tempCerts[existingIndex].certNo,
                    countryOrigin: countryOrigin || tempCerts[existingIndex].countryOrigin,
                    countryHcb: countryHcb || tempCerts[existingIndex].countryHcb,
                  };
                  updatedCount++;
                } else {
                  // Insert new
                  tempCerts.unshift({
                    id: `HL-${Math.floor(26000 + Math.random() * 5000 + index)}`,
                    material,
                    supplier,
                    certNo,
                    countryOrigin,
                    hcb,
                    countryHcb,
                    issueDate,
                    expiryDate,
                    file: 'uploaded_cert.pdf',
                    hcbStatus: [`${hcb} recognise`],
                    emailSent: false,
                  });
                  insertedCount++;
                }
              });

              setCerts(tempCerts);
              updateHalalCerts(tempCerts);
              
              setToastMessage(`Bulk operation complete: Updated ${updatedCount} and added ${insertedCount} certificates!`);
              setIsToastOpen(true);
              setIsCsvModalOpen(false);
            }}
            requiredHeaders={["Material", "Supplier", "Issue Date", "Expiry Date", "Certification Body", "Status"]} 
          />
        </div>
      </DraggableModal>

      <CameraScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScanSuccess={handleScanSuccess} 
      />

      <NotificationPanel isOpen={isNotifyOpen} onClose={() => setIsNotifyOpen(false)} alerts={criticalAlerts} onPreview={() => { setIsNotifyOpen(false); setIsEmailPreviewOpen(true); }} />

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
                    <div className="p-3 bg-[#932c2e] rounded-2xl shadow-lg text-white">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-[16px] uppercase tracking-widest leading-none">Monthly Expiry Dispatch Preview</h3>
                        <p className="text-[#a3acbe] text-[10px] font-bold uppercase mt-1">Recipient: procurement@t-all-intelligence.com</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => window.print()}
                        className="bg-white text-[#212c46] px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-[#eaeaec] transition-all shadow-xl flex items-center gap-2"
                    >
                        <Printer size={18}/> Print / Save PDF
                    </button>
                    <button 
                        onClick={() => { alert("Email Summary dispatched to procurement system."); setIsEmailPreviewOpen(false); }}
                        className="bg-[#212c46] text-white border border-[#212c46] px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-[#1c273e] hover:border-[#a3acbe] transition-all shadow-xl flex items-center gap-2"
                    >
                        <Send size={18}/> Confirm & Send Mail
                    </button>
                    <button onClick={() => setIsEmailPreviewOpen(false)} className="p-3 text-white/40 hover:text-white transition-colors bg-white/5 rounded-full"><X size={24}/></button>
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
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#212c46] border border-[#eaeaec] shadow-sm relative overflow-hidden"><ShieldCheck size={24} strokeWidth={2.5} /></div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-widest text-[24px] leading-none">HALAL <span className="text-[#a3acbe]">DOSS-CHECK</span></h3>
                  <div className="flex items-center gap-2 mt-[6px]"><div className="w-8 h-[2px] bg-[#212c46]"></div><p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.2em] leading-none">Global Compliance Monitoring System</p></div>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsNotifyOpen(true)}
                className="h-11 px-5 rounded-xl bg-white border border-[#eaeaec] shadow-sm flex items-center gap-3 hover:bg-[#cf7d65] hover:text-white transition-all group relative overflow-hidden"
              >
                  <MailWarning size={18} className={criticalAlerts.length > 0 ? "text-[#932c2e] group-hover:text-white animate-bounce" : "text-[#7a8b95] group-hover:text-white"} />
                  <span className="text-[11px] font-black uppercase tracking-widest leading-none">Compliance Alerts</span>
                  {criticalAlerts.length > 0 && <span className="bg-[#932c2e] group-hover:bg-[#5a2f33] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-md">{criticalAlerts.length}</span>}
              </button>

              <div className="flex bg-[#f8f9fa] p-1.5 border border-[#eaeaec] shadow-sm rounded-xl ml-2">
                  <button onClick={() => setActiveMainTab('table')} className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMainTab === 'table' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:bg-white'}`}>
                      <List size={14} /> HC Table
                  </button>
                  <button onClick={() => setActiveMainTab('insight')} className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMainTab === 'insight' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:bg-white'}`}>
                      <PieChart size={14} /> Insight
                  </button>
              </div>
          </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex flex-col">
        <div className="w-full flex flex-col">
            {activeMainTab === 'table' ? (
                <>
                {/* KPI STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
                  {[
                    { label: 'Total Dossiers', val: certs.length, icon: Layers, color: THEME.primary },
                    { label: 'Active / Compliant', val: processedCerts.filter(c=>c.calculatedStatus==='Valid').length, icon: CheckCircle2, color: '#657f4d' },
                    { label: 'MRA Check Required', val: mraCount, icon: MraIcon, color: '#761956' },
                    { label: 'Expired / Due Soon', val: criticalAlerts.length, icon: AlertTriangle, color: '#932c2e' }
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
                                <button onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)} className="h-10 px-4 bg-white border border-[#eaeaec] rounded-xl flex items-center gap-3 min-w-[200px] justify-between text-[11px] font-black uppercase tracking-widest text-[#212c46] shadow-sm hover:bg-[#eaeaec]">
                                    <div className="flex items-center gap-2"><Filter size={14} className="text-[#a3acbe]" /><span>{filterStatus === 'ALL' ? 'ALL STATUS' : filterStatus.toUpperCase()}</span></div>
                                    <ChevronDown size={14} className="text-[#7a8b95]" />
                                </button>
                                {isFilterDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsFilterDropdownOpen(false)}></div>
                                        <div className="absolute top-full left-0 mt-2 w-[240px] bg-white border border-[#eaeaec] rounded-xl shadow-xl z-50 py-2 animate-fadeIn">
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
                            <div className="relative w-[320px] h-10 flex items-center gap-2">
                                <div className="relative flex-1 h-full">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3acbe]" />
                                    <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search material, supplier..." className="w-full h-full pl-11 pr-5 text-[11px] border border-[#eaeaec] bg-white shadow-sm rounded-xl font-bold outline-none focus:border-[#d1a45f] text-[#212c46] placeholder-[#a3acbe]" />
                                </div>
                                <button title="Refresh Data" className="h-10 w-10 flex shrink-0 items-center justify-center rounded-xl border border-[#eaeaec] bg-white text-[#7a8b95] hover:text-[#212c46] hover:bg-[#f8f9fa] hover:border-[#a3acbe] shadow-sm transition-all active:scale-95 group">
                                    <RefreshCw size={16} className="group-active:rotate-180 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setIsScannerOpen(true)} className="h-10 bg-[#d1a45f]/10 border border-[#d1a45f]/30 hover:border-[#d1a45f] hover:bg-[#d1a45f]/20 text-[#212c46] px-5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm transition-all flex items-center gap-2 shrink-0"><Camera size={14} className="text-[#b58c4f]"/> CAMERA SCANNER</button>
                            <button onClick={() => setIsCsvModalOpen(true)} className="h-10 bg-white border border-[#eaeaec] hover:border-[#1c273e] hover:bg-[#f8f9fa] text-[#212c46] px-5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm transition-all flex items-center gap-2 shrink-0"><Upload size={14}/> BULK UPLOAD</button>
                            <button onClick={()=>{setActiveItem(null); setIsModalOpen(true);}} className="h-10 bg-[#212c46] hover:bg-[#1c273e] text-white px-6 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md transition-all flex items-center gap-2 shrink-0"><Plus size={14}/> REGISTER RM HALAL</button>
                        </div>
                    </div>

                    <div className="overflow-auto bg-white custom-scrollbar">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-[#37333a] text-white sticky top-0 z-10 font-black text-[12px] uppercase tracking-widest">
                                <tr>
                                    <th className="py-4 px-4 border-b-2 border-[#b05e76]">Material & Supplier</th>
                                    <th className="py-4 px-4 border-b-2 border-[#b05e76]">Origin & HCB Detail</th>
                                    <th className="py-4 px-4 border-b-2 border-[#b05e76] text-center">Comm Status</th>
                                    <th className="py-4 px-4 border-b-2 border-[#b05e76] text-center">Expiry Status</th>
                                    <th className="py-4 px-4 border-b-2 border-[#b05e76] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eaeaec]">
                                {currentData.map(cert => (
                                    <tr key={cert.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                        <td className="py-2.5 px-4 max-w-[250px]">
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
                                                <span className="text-[11px] font-bold text-[#7a8b95] mt-0.5 uppercase tracking-wide flex items-center gap-1 truncate"><Building2 size={12} className="shrink-0"/><HighlightText text={cert.supplier} query={search} /></span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-black text-[#212c46] uppercase flex items-center gap-1"><MapPin size={10}/> Origin: {cert.countryOrigin}</span>
                                                    {cert.hasMraIssue && <span className="bg-[#761956]/10 text-[#761956] px-1.5 py-0.5 rounded text-[10px] font-black border border-[#761956]/20">MRA</span>}
                                                </div>
                                                <span className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-tighter flex items-center gap-1"><PenTool size={10}/> HCB: {cert.hcb} ({cert.countryHcb})</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            {cert.emailSent ? (
                                                <div className="flex flex-col items-center group/note relative">
                                                    <span className="text-[11px] font-black text-[#657f4d] uppercase flex items-center gap-1"><CheckIcon size={12}/> Sent</span>
                                                    <span className="text-[10px] font-mono font-bold text-[#7a8b95] mt-0.5">{cert.lastEmailDate}</span>
                                                    {cert.emailNotes && (
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#212c46] text-white text-[10px] font-medium leading-relaxed rounded-lg shadow-xl opacity-0 group-hover/note:opacity-100 transition-opacity z-50 pointer-events-none whitespace-normal text-left">
                                                            {cert.emailNotes}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[11px] font-black text-[#eaeaec] uppercase">NO RECORD</span>
                                            )}
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex flex-col items-center">
                                              <span className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest shadow-sm border ${cert.calculatedStatus === 'Valid' ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30' : cert.calculatedStatus === 'Expiring Soon' ? 'bg-[#d1a45f]/10 text-[#d1a45f] border-[#d1a45f]/30' : 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30'}`}>
                                                  {cert.calculatedStatus}
                                              </span>
                                              <span className="text-[11px] font-mono font-bold text-[#7a8b95] mt-1">{cert.expiryDate}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4">
                                            <div className="flex justify-center gap-[4px]">
                                                <button onClick={()=>{setQrCert(cert);}} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#b58c4f] border border-[#eaeaec] hover:border-[#b58c4f] hover:bg-[#b58c4f]/15 bg-white shadow-sm transition-all active:scale-95" title={t("Generate QR Code", "สร้างคิวอาร์โค้ด")}><QrCode size={14}/></button>
                                                <button onClick={()=>{setActiveItem(cert); setIsModalOpen(true);}} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#728298] border border-[#eaeaec] hover:border-[#728298] hover:bg-[#728298]/15 bg-white shadow-sm transition-all active:scale-95" title={t("Manage Dossier", "จัดการใบรับรอง")}><FileSearch size={14}/></button>
                                                <button onClick={() => { setPreviewCert(cert); setIsPreviewModalOpen(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#d1a45f] border border-[#eaeaec] hover:border-[#d1a45f] hover:bg-[#d1a45f]/15 bg-white shadow-sm transition-all active:scale-95" title={t("View Source", "ดูเอกสารต้นฉบับ")}><ExternalLink size={14}/></button>
                                                <button onClick={() => handleTriggerQuickRequest(cert)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#212c46] border border-[#eaeaec] hover:border-[#212c46] hover:bg-[#212c46]/15 bg-white shadow-sm transition-all active:scale-95" title={t("Send Email Reminder", "ส่งอีเมลแจ้งเตือน")}><Mail size={14}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 px-6 text-center">
                                            <div className="flex flex-col items-center justify-center text-[#7a8b95]">
                                                <Box size={40} className="mb-3 opacity-30" />
                                                <p className="font-bold text-[12px] uppercase tracking-widest text-[#212c46]">No Halal Documents Found</p>
                                                <p className="text-[11px] mt-1">Adjust your filters to see more results.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-between items-center rounded-b-3xl shrink-0">
                        <p className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">Global Dossier Registry: <span className="text-[#212c46]">{filteredCerts.length}</span></p>
                        <div className="flex items-center gap-2">
                            <button onClick={()=>setCurrentPage(p=>Math.max(1, p-1))} className="w-8 h-8 border border-[#eaeaec] bg-white rounded-lg flex items-center justify-center hover:bg-[#212c46] hover:text-white transition-all shadow-sm"><ChevronLeft size={16}/></button>
                            <span className="text-[11px] font-black px-3 py-1 bg-white rounded-lg border border-[#eaeaec] font-mono shadow-sm text-[#212c46]">Page {currentPage} / {totalPages}</span>
                            <button onClick={()=>setCurrentPage(p=>Math.min(totalPages, p+1))} className="w-8 h-8 border border-[#eaeaec] bg-white rounded-lg flex items-center justify-center hover:bg-[#212c46] hover:text-white transition-all shadow-sm"><ChevronRight size={16}/></button>
                        </div>
                    </div>
                </div>
                </>
            ) : (
                <div className="bg-white rounded-3xl border border-[#eaeaec] p-8 shadow-lg animate-fadeIn">
                    <div className="flex justify-between items-center mb-8 border-b border-[#eaeaec] pb-5">
                       <div className="flex items-center gap-4">
                           <PieChart size={32} className="text-[#d1a45f]" />
                           <div>
                               <h3 className="text-[20px] font-black text-[#212c46] uppercase tracking-widest leading-none">HALAL COMPLIANCE INSIGHTS</h3>
                               <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1">Dossier Integrity & Risk Analysis</p>
                           </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-7 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-[#f8f9fa] p-8 rounded-3xl border border-[#eaeaec] flex flex-col items-center justify-center text-center h-full">
                                   <h4 className="text-[11px] font-black text-[#212c46] uppercase mb-6 tracking-widest">Global Pass Rate</h4>
                                   <div className="relative h-40 w-40 flex items-center justify-center mb-2">
                                      <svg className="w-full h-full" viewBox="0 0 36 36">
                                         <path className="text-[#eaeaec]" strokeDasharray="100, 100" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor"/>
                                         <path className="text-[#657f4d]" strokeDasharray={`${Math.round((processedCerts.filter(c=>c.calculatedStatus==='Valid').length/processedCerts.length)*100)}, 100`} strokeWidth="2.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor"/>
                                      </svg>
                                      <div className="absolute flex flex-col items-center">
                                         <span className="text-[32px] font-black font-mono text-[#657f4d] leading-none">{Math.round((processedCerts.filter(c=>c.calculatedStatus==='Valid').length/processedCerts.length)*100)}%</span>
                                         <span className="text-[9px] font-bold text-[#7a8b95] uppercase mt-1 tracking-widest drop-shadow-sm">Compliant</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="space-y-4 flex flex-col justify-center">
                                   <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] shadow-sm transform hover:-translate-y-1 transition-transform">
                                      <p className="text-[11px] font-black text-[#7a8b95] uppercase mb-1.5 tracking-widest">MRA Critical Ratio</p>
                                      <div className="flex items-center gap-3">
                                          <div className="w-2 h-2 rounded-full bg-[#761956]"></div>
                                          <p className="text-[14px] font-black text-[#212c46] uppercase font-mono">{Math.round((mraCount/processedCerts.length)*100)}% Cross-Border</p>
                                      </div>
                                   </div>
                                   <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] shadow-sm transform hover:-translate-y-1 transition-transform">
                                      <p className="text-[11px] font-black text-[#7a8b95] uppercase mb-1.5 tracking-widest">Communication Active</p>
                                      <div className="flex items-center gap-3">
                                          <div className="w-2 h-2 rounded-full bg-[#657f4d]"></div>
                                          <p className="text-[14px] font-black text-[#212c46] uppercase font-mono">{processedCerts.filter(c=>c.emailSent).length} Suppliers Notified</p>
                                      </div>
                                   </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-5">
                            <div className="bg-[#212c46] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-center border border-[#d1a45f]/30">
                               <div className="absolute -top-10 -right-10 opacity-[0.05]"><Globe2 size={240} /></div>
                               <h3 className="text-[16px] font-black uppercase tracking-[0.2em] mb-4 text-[#d1a45f]">Smart Integrity</h3>
                               <p className="text-[12px] text-white/70 leading-relaxed mb-8 font-medium italic">"Traceability for Halal certification ensures raw materials are verified against country of origin and accredited HCB bodies, securing global export standards for authentic production."</p>
                               <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                                  <div className="relative w-4 h-4 shrink-0">
                                     <div className="absolute inset-0 rounded-full bg-[#657f4d] animate-ping opacity-75"></div>
                                     <div className="relative w-4 h-4 rounded-full bg-[#657f4d] border-2 border-white/20"></div>
                                  </div>
                                  <div>
                                     <span className="text-[11px] font-black uppercase tracking-widest block">Audit Level: READY</span>
                                     <span className="text-[9px] text-white/50 font-mono">Database Synchronized: Today 08:30 AM</span>
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
