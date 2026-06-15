import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Search, FileText, CheckCircle2, Clock, 
  AlertTriangle, Download, Trash2, Edit, RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import SkeletonLoading from '../../../components/shared/SkeletonLoading';

export default function CompanyHalalCertificates() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Dummy Initial Data
  const [certs, setCerts] = useState([
    {
      id: 'CH-001',
      certName: 'Halal Facility Certification',
      certNo: 'CICOT.HL 10 A000 001 01 64',
      hcb: 'CICOT',
      issueDate: '2024-01-15',
      expiryDate: '2027-01-14',
      status: 'Valid'
    },
    {
       id: 'CH-002',
       certName: 'Export Halal License (Malaysia)',
       certNo: 'JAKIM/(S)/(22.00)/492/2/1',
       hcb: 'JAKIM',
       issueDate: '2023-08-20',
       expiryDate: '2025-08-19',
       status: 'Expiring Soon'
    }
  ]);

  if (isLoading) {
    return <SkeletonLoading layout="dashboard" />;
  }

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* Header */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#212c46] border border-[#eaeaec] shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
             <Building2 size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-[#212c46] uppercase tracking-widest leading-none">
              COMPANY <span className="text-[#a3acbe]">HALAL CERTS</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5"><div className="w-8 h-[2px] bg-[#212c46]"></div><p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest leading-none">Internal Company Certificates Management</p></div>
          </div>
        </div>
        <button className="bg-[#212c46] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-[#1d2636] transition-all shadow-md active:scale-95">
          <Plus size={16} /> ADD CERTIFICATE
        </button>
      </div>

      {/* Main Content Workspace */}
      <div className="w-full px-4 sm:px-8 flex flex-col">
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* Controls */}
          <div className="py-4 px-6 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
            <div className="relative w-80 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8b95]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search certificates..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] font-bold outline-none focus:border-[#212c46] bg-white transition-all focus:ring-1 focus:ring-[#212c46]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button title="Refresh Data" className="h-[34px] w-[34px] flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#7a8b95] hover:text-[#212c46] hover:bg-[#f8f9fa] shadow-sm transition-all active:scale-95 group">
                <RefreshCw size={14} className="group-active:rotate-180 transition-transform duration-500" />
              </button>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-[#657f4d]/10 text-[#657f4d] text-[11px] font-bold rounded-lg border border-[#657f4d]/30 flex items-center gap-1.5">
                 <CheckCircle2 size={14}/> Valid
              </span>
              <span className="px-3 py-1.5 bg-[#d09653]/10 text-[#d09653] text-[11px] font-bold rounded-lg border border-[#d09653]/30 flex items-center gap-1.5">
                 <Clock size={14}/> Expiring
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto custom-scrollbar">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead className="bg-[#212c46] text-white">
                <tr className="border-b-2 border-[#b7a159] sticky top-0 z-10">
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Certificate Name / No.</th>
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Certification Body</th>
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Issue Date</th>
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Expiry Date</th>
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certs.filter(c => c.certName.toLowerCase().includes(searchTerm.toLowerCase()) || c.certNo.toLowerCase().includes(searchTerm.toLowerCase())).map((cert) => (
                  <tr key={cert.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-2.5 px-4 text-[12px]">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${cert.status === 'Valid' ? 'bg-[#657f4d]/10 border-[#657f4d]/20 text-[#657f4d]' : 'bg-[#d09653]/10 border-[#d09653]/20 text-[#d09653]'}`}>
                             <FileText size={14} />
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="font-black text-[#212c46] uppercase leading-tight truncate">{cert.certName}</div>
                          <div className="text-[11px] text-[#7a8b95] mt-0.5">{cert.certNo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-[#202c38] text-[12px]">
                      {cert.hcb}
                    </td>
                    <td className="py-2.5 px-4 text-[#7a8b95] text-[12px]">
                      <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#a94228] opacity-50" /> {cert.issueDate}</span>
                    </td>
                    <td className="py-2.5 px-4 text-[#7a8b95] text-[12px]">
                      <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#a94228]" /> {cert.expiryDate}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      {cert.status === 'Valid' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#657f4d]/10 text-[#657f4d] text-[11px] font-black uppercase tracking-wider border border-[#657f4d]/30">
                           <CheckCircle2 size={10}/> {cert.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#d09653]/10 text-[#d09653] text-[11px] font-black uppercase tracking-wider border border-[#d09653]/30">
                           <Clock size={10}/> {cert.status}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-center gap-[1px]">
                        <button className="w-8 h-8 flex items-center justify-center text-[#7a8b95] hover:text-[#d1a45f] hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200" title="Download">
                          <Download size={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-[#7a8b95] hover:text-[#212c46] hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200" title="Edit">
                          <Edit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {certs.length === 0 && (
                   <tr>
                      <td colSpan={6} className="py-12 text-center text-[#7a8b95]">
                         <FileText size={48} className="mx-auto mb-4 opacity-20" />
                         <p className="text-[13px] font-bold uppercase">No Certificates Found</p>
                      </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="py-3 px-6 bg-[#F0EAE1]/80 border-t-[1.5px] border-slate-200 flex justify-between items-center shrink-0">
             <div className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">
                Showing <span className="text-[#212c46] font-black">1</span> to <span className="text-[#212c46] font-black">{certs.length}</span> of <span className="text-[#212c46] font-black">{certs.length}</span> entries
             </div>
             <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded bg-white border border-slate-200 text-[#7a8b95] text-[11px] font-bold hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1.5 rounded bg-[#212c46] text-white text-[11px] font-bold">1</button>
                <button className="px-3 py-1.5 rounded bg-white border border-slate-200 text-[#7a8b95] text-[11px] font-bold hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
