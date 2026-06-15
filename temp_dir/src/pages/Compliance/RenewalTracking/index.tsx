import React, { useState } from 'react';
import { 
  CheckSquare, Search, FileText, CheckCircle2,
  Calendar, Download, ArrowRight, ShieldAlert,
  ChevronRight, ChevronLeft, Upload, Clock, Loader2, ArrowUpRight
} from 'lucide-react';
import clsx from 'clsx';

export default function RenewalTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const renewals = [
    {
      id: 'REN-001',
      certName: 'Export Halal License',
      supplier: 'Internal',
      targetDate: '2026-07-10',
      stage: 'Document Prep', // Stages: Not Started, Document Prep, Submitted, In Review, Approved
      progress: 30,
      assignee: 'Wichai T.'
    },
    {
      id: 'REN-002',
      certName: 'Halal Beef Extract',
      supplier: 'ABC Foods Co., Ltd.',
      targetDate: '2026-08-15',
      stage: 'Submitted',
      progress: 75,
      assignee: 'Somsri M.'
    },
    {
      id: 'REN-003',
      certName: 'Food Safety ISO 22000',
      supplier: 'Internal',
      targetDate: '2026-06-30',
      stage: 'In Review',
      progress: 90,
      assignee: 'Somchai K.'
    },
    {
      id: 'REN-004',
      certName: 'Natural Flavor Type A',
      supplier: 'Flavorings Inc.',
      targetDate: '2026-09-01',
      stage: 'Not Started',
      progress: 0,
      assignee: 'Wichai T.'
    },
    {
      id: 'REN-005',
      certName: 'Organic Certification FDA',
      supplier: 'Internal',
      targetDate: '2026-10-15',
      stage: 'Approved',
      progress: 100,
      assignee: 'Somsri M.'
    },
    {
      id: 'REN-006',
      certName: 'Chicken Poultry Halal',
      supplier: 'Fresh Meat Co.',
      targetDate: '2026-07-25',
      stage: 'Document Prep',
      progress: 45,
      assignee: 'Somchai K.'
    },
    {
      id: 'REN-007',
      certName: 'GMP Annual Renewal',
      supplier: 'Internal',
      targetDate: '2026-08-05',
      stage: 'In Review',
      progress: 80,
      assignee: 'Wichai T.'
    },
    {
      id: 'REN-008',
      certName: 'Kosher Certificate',
      supplier: 'Specialty Ingredients',
      targetDate: '2026-09-20',
      stage: 'Not Started',
      progress: 0,
      assignee: 'Somsri M.'
    }
  ];

  const filteredRenewals = renewals.filter(item => 
    item.certName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRenewals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRenewals = filteredRenewals.slice(startIndex, startIndex + itemsPerPage);

  const getStageDisplay = (stage: string) => {
    switch(stage) {
      case 'Not Started': return { color: 'text-slate-500 bg-slate-100', icon: <Clock size={12}/> };
      case 'Document Prep': return { color: 'text-[#d09653] bg-[#d09653]/10', icon: <FileText size={12}/> };
      case 'Submitted': return { color: 'text-[#3f809e] bg-[#3f809e]/10', icon: <ArrowUpRight size={12}/> };
      case 'In Review': return { color: 'text-[#a94228] bg-[#a94228]/10', icon: <Loader2 size={12} className="animate-spin" /> };
      case 'Approved': return { color: 'text-[#657f4d] bg-[#657f4d]/10', icon: <CheckCircle2 size={12}/> };
      default: return { color: 'text-slate-500 bg-slate-100', icon: <Clock size={12}/> };
    }
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* Header */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#212c46] border border-[#eaeaec] shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
             <CheckSquare size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-[#212c46] uppercase tracking-widest leading-none">
              RENEWAL <span className="text-[#a3acbe]">TRACKING</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5"><div className="w-8 h-[2px] bg-[#212c46]"></div><p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest leading-none">Monitor Certificate Renewal Progress</p></div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#212c46] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-[#1d2636] transition-all shadow-md active:scale-95">
            INITIATE RENEWAL
          </button>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex flex-col gap-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
           <div className="bg-white rounded-2xl border border-[#eaeaec] p-5 shadow-sm">
               <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">Total Active Renewals</p>
               <h3 className="text-3xl font-black text-[#212c46]">12</h3>
           </div>
           <div className="bg-white rounded-2xl border border-[#eaeaec] p-5 shadow-sm">
               <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">In Review</p>
               <h3 className="text-3xl font-black text-[#a94228]">3</h3>
           </div>
           <div className="bg-white rounded-2xl border border-[#eaeaec] p-5 shadow-sm">
               <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">Awaiting Documents</p>
               <h3 className="text-3xl font-black text-[#d09653]">5</h3>
           </div>
           <div className="bg-white rounded-2xl border border-[#eaeaec] p-5 shadow-sm">
               <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">Completed This Month</p>
               <h3 className="text-3xl font-black text-[#657f4d]">8</h3>
           </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            {/* Controls */}
            <div className="py-4 px-6 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8b95]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search renewals..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] font-bold outline-none focus:border-[#212c46] focus:ring-1 focus:ring-[#212c46] transition-all bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                 <button className="h-9 px-4 rounded-lg bg-white border border-[#eaeaec] text-[#212c46] text-[11px] font-bold uppercase hover:bg-slate-50 shadow-sm flex items-center gap-2">
                   <Download size={14} /> Export List
                 </button>
              </div>
            </div>

            {/* Table Area */}
            <div className="overflow-auto custom-scrollbar">
                 <table className="w-full min-w-[900px] text-left border-collapse">
                    <thead className="bg-[#212c46] text-white">
                      <tr className="border-b-2 border-[#b7a159] sticky top-0 z-10">
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">ID / Certificate</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Entity / Supplier</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Target Date</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Stage</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap min-w-[150px]">Progress</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Assignee</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedRenewals.map((item) => {
                        const stageDisplay = getStageDisplay(item.stage);
                        return (
                          <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors">
                            <td className="py-2.5 px-4 text-[12px]">
                              <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[#212c46]/5 border-[#212c46]/10 text-[#212c46]">
                                     <ArrowUpRight size={14} />
                                </div>
                                <div className="min-w-0 flex flex-col justify-center">
                                  <h4 className="font-black text-[#212c46] uppercase leading-tight truncate">{item.certName}</h4>
                                  <span className="text-[11px] text-[#7a8b95] mt-0.5 block">{item.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-[12px] font-bold text-[#202c38]">{item.supplier}</td>
                            <td className="py-2.5 px-4 text-[12px] text-[#7a8b95]">
                               <span className="flex items-center gap-1.5"><Calendar size={12} className={item.progress < 50 ? "text-[#a94228]" : "text-[#7a8b95]"} /> {item.targetDate}</span>
                            </td>
                            <td className="py-2.5 px-4">
                               <span className={clsx("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider border border-transparent", stageDisplay.color)}>
                                 {stageDisplay.icon} {item.stage}
                               </span>
                            </td>
                            <td className="py-2.5 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[100px]">
                                   <div className={clsx("h-full rounded-full transition-all duration-500", item.progress === 100 ? "bg-[#657f4d]" : item.progress > 0 ? "bg-[#212c46]" : "bg-transparent")} style={{ width: `${item.progress > 0 ? item.progress : 100}%`, opacity: item.progress === 0 ? 0 : 1 }}></div>
                                 </div>
                                 <span className="text-[11px] font-bold text-[#7a8b95] w-8 text-right">{item.progress}%</span>
                               </div>
                            </td>
                            <td className="py-2.5 px-4 text-[12px] font-bold text-[#202c38]">{item.assignee}</td>
                            <td className="py-2.5 px-4">
                              <div className="flex items-center justify-end">
                                  <button className="h-8 px-3 flex items-center justify-center text-[#7a8b95] hover:text-[#212c46] hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 gap-1 text-[11px] font-bold" title="Open Workspace">
                                    Manage <ChevronRight size={14} />
                                  </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                 </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="py-3 px-6 border-t border-slate-200 flex justify-between items-center bg-white shrink-0">
                  <span className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRenewals.length)} of {filteredRenewals.length} entries
                  </span>
                  <div className="flex items-center gap-1">
                      <button 
                         disabled={currentPage === 1}
                         onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                         className="h-8 px-3 rounded-lg border border-[#eaeaec] text-[#212c46] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-[11px] font-bold transition-colors"
                      >
                         <ChevronLeft size={14} />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={clsx(
                            "h-8 w-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-colors",
                            currentPage === page 
                              ? "bg-[#212c46] text-white border border-[#212c46]" 
                              : "border border-[#eaeaec] text-[#7a8b95] hover:bg-slate-50 hover:text-[#212c46]"
                          )}
                        >
                          {page}
                        </button>
                      ))}

                      <button 
                         disabled={currentPage === totalPages}
                         onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                         className="h-8 px-3 rounded-lg border border-[#eaeaec] text-[#212c46] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-[11px] font-bold transition-colors"
                      >
                         <ChevronRight size={14} />
                      </button>
                  </div>
              </div>
            )}
        </div>

      </div>
    </div>
  );
}
