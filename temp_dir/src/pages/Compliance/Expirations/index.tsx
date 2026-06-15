import React, { useState } from 'react';
import { 
  Clock, AlertTriangle, Search, FileText, CheckCircle2,
  Calendar, Building2, Download, ArrowRight, ShieldAlert,
  ChevronRight, Bell, BellOff
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function UpcomingExpirations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(false);

  // Dummy Initial Data
  const [certs, setCerts] = useState([
    {
      id: 'EXP-001',
      certName: 'Halal Facility Certification',
      certNo: 'CICOT.HL 10 A000 001 01 64',
      entity: 'Internal',
      type: 'Company',
      expiryDate: '2024-01-14',
      daysRemaining: -150,
      riskLevel: 'Critical'
    },
    {
       id: 'EXP-002',
       certName: 'Export Halal License (Malaysia)',
       certNo: 'JAKIM/(S)/(22.00)/492/2/1',
       entity: 'Internal',
       type: 'Company',
       expiryDate: '2026-07-10', // Changed to fall into 1 Month category for demo
       daysRemaining: 25,
       riskLevel: 'High'
    },
    {
       id: 'EXP-003',
       certName: 'Raw Material Halal (Beef Extract)',
       certNo: 'MUI.12345.678',
       entity: 'ABC Foods Co., Ltd.',
       type: 'Supplier',
       expiryDate: '2026-08-15', // Changed to fall into 2 Months category for demo
       daysRemaining: 55,
       riskLevel: 'Medium'
    },
    {
       id: 'EXP-004',
       certName: 'Raw Material Halal (Chicken Powder)',
       certNo: 'MUI.99999.888',
       entity: 'Meat Supplier Co., Ltd.',
       type: 'Supplier',
       expiryDate: '2026-09-05',
       daysRemaining: 80,
       riskLevel: 'Medium'
    }
  ]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/20';
      case 'High': return 'bg-[#a94228]/10 text-[#a94228] border-[#a94228]/20';
      case 'Medium': return 'bg-[#d09653]/10 text-[#d09653] border-[#d09653]/20';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getDaysBadge = (days: number) => {
    if (days < 0) return <span className="text-[#932c2e] font-bold">Expired {Math.abs(days)} days ago</span>;
    if (days <= 30) return <span className="text-[#a94228] font-bold">In {days} days</span>;
    return <span className="text-[#d09653] font-bold">In {days} days</span>;
  };

  const expiryData = [
    { name: '1 Month', count: certs.filter(c => c.daysRemaining > 0 && c.daysRemaining <= 30).length, color: '#a94228' },
    { name: '2 Months', count: certs.filter(c => c.daysRemaining > 30 && c.daysRemaining <= 60).length, color: '#d09653' },
    { name: '3 Months', count: certs.filter(c => c.daysRemaining > 60 && c.daysRemaining <= 90).length, color: '#b58c4f' },
  ];

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* Header */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#212c46] border border-[#eaeaec] shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
             <Clock size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-[#212c46] uppercase tracking-widest leading-none">
              UPCOMING <span className="text-[#a3acbe]">EXPIRATIONS</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5"><div className="w-8 h-[2px] bg-[#212c46]"></div><p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest leading-none">Certificate Expiry & Renewal Tracking</p></div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setEmailAlertsEnabled(!emailAlertsEnabled)}
            className={`px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-sm border ${
              emailAlertsEnabled 
                ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30 hover:bg-[#657f4d]/20' 
                : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {emailAlertsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            {emailAlertsEnabled ? 'ALERTS ON' : 'ALERTS OFF'}
          </button>
          <button className="bg-[#212c46] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-[#1d2636] transition-all shadow-md active:scale-95">
             RENEWAL WORKFLOW <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="w-full px-4 sm:px-8 flex flex-col">
        
        <div className="grid grid-cols-12 gap-6 mb-6 shrink-0">
          {/* KPI Cards */}
          <div className="col-span-8 grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden h-full">
               <div className="w-12 h-12 bg-[#932c2e]/10 rounded-xl flex items-center justify-center text-[#932c2e]">
                 <ShieldAlert size={24} />
               </div>
               <div>
                 <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">Critical (Expired)</p>
                 <h3 className="text-[24px] font-black text-[#212c46] leading-none mt-1">
                   {certs.filter(c => c.daysRemaining <= 0).length}
                 </h3>
               </div>
               <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#932c2e]"></div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden h-full">
               <div className="w-12 h-12 bg-[#a94228]/10 rounded-xl flex items-center justify-center text-[#a94228]">
                 <AlertTriangle size={24} />
               </div>
               <div>
                 <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">High Risk ({"<"} 30 Days)</p>
                 <h3 className="text-[24px] font-black text-[#212c46] leading-none mt-1">
                   {certs.filter(c => c.daysRemaining > 0 && c.daysRemaining <= 30).length}
                 </h3>
               </div>
               <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#a94228]"></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden h-full">
               <div className="w-12 h-12 bg-[#d09653]/10 rounded-xl flex items-center justify-center text-[#d09653]">
                 <Clock size={24} />
               </div>
               <div>
                 <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">Medium (31-90 Days)</p>
                 <h3 className="text-[24px] font-black text-[#212c46] leading-none mt-1">
                   {certs.filter(c => c.daysRemaining > 30 && c.daysRemaining <= 90).length}
                 </h3>
               </div>
               <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#d09653]"></div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-[12px] font-black text-[#212c46] tracking-wider uppercase mb-4">Expirations Timeline</h3>
            <div className="flex-1 min-h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expiryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {expiryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* Controls */}
          <div className="py-4 px-6 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8b95]" size={16} />
              <input 
                type="text" 
                placeholder="Search certificates..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] font-bold outline-none focus:border-[#212c46] focus:ring-1 focus:ring-[#212c46] transition-all bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto custom-scrollbar">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead className="bg-[#212c46] text-white">
                <tr className="border-b-2 border-[#b7a159] sticky top-0 z-10">
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Certificate Name / No.</th>
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Owner Entity</th>
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Expiry Date</th>
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Time Remaining</th>
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Risk Level</th>
                  <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certs.filter(c => c.certName.toLowerCase().includes(searchTerm.toLowerCase()) || c.certNo.toLowerCase().includes(searchTerm.toLowerCase())).map((cert) => (
                  <tr key={cert.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-2.5 px-4 text-[12px]">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${cert.daysRemaining < 0 ? 'bg-[#932c2e]/10 border-[#932c2e]/20 text-[#932c2e]' : 'bg-[#212c46]/5 border-[#212c46]/10 text-[#212c46]'}`}>
                             <FileText size={14} />
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                          <h4 className="font-black text-[#212c46] uppercase leading-tight truncate">{cert.certName}</h4>
                          <span className="text-[11px] text-[#7a8b95] mt-0.5 block">{cert.certNo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-[12px]">
                      <div className="font-bold text-[#202c38]">{cert.entity}</div>
                      <div className="text-[10px] font-black text-[#b58c4f] uppercase tracking-wider mt-0.5">{cert.type}</div>
                    </td>
                    <td className="py-2.5 px-4 text-[#7a8b95] text-[12px]">
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#a94228]" /> {cert.expiryDate}</span>
                    </td>
                    <td className="py-2.5 px-4 text-[12px]">
                      {getDaysBadge(cert.daysRemaining)}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider border ${getRiskColor(cert.riskLevel)}`}>
                        {cert.riskLevel === 'Critical' && <ShieldAlert size={10}/>}
                        {cert.riskLevel === 'High' && <AlertTriangle size={10}/>}
                        {cert.riskLevel === 'Medium' && <Clock size={10}/>}
                        {cert.riskLevel}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-end gap-[1px]">
                          <button className="h-8 px-3 flex items-center justify-center text-[#7a8b95] hover:text-[#212c46] hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 gap-1 text-[11px] font-bold" title="View Details">
                            Review <ChevronRight size={14} />
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
