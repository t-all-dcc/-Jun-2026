import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Search, FileText, CheckCircle2,
  Calendar, Download, ArrowRight, ShieldAlert,
  ChevronRight, ChevronLeft, FileBadge, Upload, Clock
} from 'lucide-react';
import clsx from 'clsx';

export default function AuditPreparation() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const audits = [
    {
      id: 'AUD-2026-01',
      title: 'Annual Halal Recertification',
      body: 'CICOT (Thailand)',
      date: '2026-08-15',
      status: 'In Progress',
      progress: 65,
      type: 'External'
    },
    {
      id: 'AUD-2026-02',
      title: 'Internal Standard Audit',
      body: 'Quality Assurance Dept.',
      date: '2026-07-20',
      status: 'Ready',
      progress: 100,
      type: 'Internal'
    },
    {
      id: 'AUD-2026-03',
      title: 'ISO 45001 Surveillance',
      body: 'SGS Certification',
      date: '2026-09-10',
      status: 'Needs Update',
      progress: 40,
      type: 'External'
    },
    {
      id: 'AUD-2026-04',
      title: 'Supplier Verification Audit',
      body: 'Supplier A',
      date: '2026-10-05',
      status: 'Missing',
      progress: 10,
      type: 'Internal'
    },
    {
      id: 'AUD-2026-05',
      title: 'GMP Facility Inspection',
      body: 'FDA',
      date: '2026-11-20',
      status: 'Ready',
      progress: 100,
      type: 'External'
    },
    {
      id: 'AUD-2026-06',
      title: 'Food Safety System Audit',
      body: 'BSI Group',
      date: '2026-12-15',
      status: 'In Progress',
      progress: 55,
      type: 'External'
    },
    {
      id: 'AUD-2026-07',
      title: 'HACCP Review',
      body: 'Quality Assurance Dept.',
      date: '2027-01-10',
      status: 'Ready',
      progress: 100,
      type: 'Internal'
    }
  ];

  const documents = [
    {
      id: 'DOC-1',
      name: 'Process Flow Chart 2026',
      category: 'Production',
      status: 'Valid',
      updatedAt: '2026-05-10',
      assignee: 'Somsri M.'
    },
    {
      id: 'DOC-2',
      name: 'Halal Ingredients Master List',
      category: 'Procurement',
      status: 'Needs Update',
      updatedAt: '2025-11-20',
      assignee: 'Wichai T.'
    },
    {
      id: 'DOC-3',
      name: 'Cleaning Chemical Approval',
      category: 'Sanitation',
      status: 'Missing',
      updatedAt: '-',
      assignee: 'Somsak P.'
    },
    {
      id: 'DOC-4',
      name: 'Pest Control Records',
      category: 'Maintenance',
      status: 'Valid',
      updatedAt: '2026-06-01',
      assignee: 'Somchai K.'
    },
    {
      id: 'DOC-5',
      name: 'Employee Training Logs',
      category: 'HR',
      status: 'Needs Update',
      updatedAt: '2025-12-15',
      assignee: 'Wichai T.'
    },
    {
      id: 'DOC-6',
      name: 'Water Quality Test Results',
      category: 'Quality Assurance',
      status: 'Valid',
      updatedAt: '2026-05-25',
      assignee: 'Somsri M.'
    },
    {
      id: 'DOC-7',
      name: 'Supplier Halal Certs',
      category: 'Procurement',
      status: 'Missing',
      updatedAt: '-',
      assignee: 'Somchai K.'
    }
  ];

  const filteredData = activeTab === 'upcoming' 
    ? audits.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.body.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : documents.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Valid': 
      case 'Ready': return 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/20';
      case 'Needs Update': 
      case 'In Progress': return 'bg-[#d09653]/10 text-[#d09653] border-[#d09653]/20';
      case 'Missing': return 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/20';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* Header */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#212c46] border border-[#eaeaec] shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
             <ClipboardList size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-[#212c46] uppercase tracking-widest leading-none">
              AUDIT <span className="text-[#a3acbe]">PREPARATION</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5"><div className="w-8 h-[2px] bg-[#212c46]"></div><p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest leading-none">Manage Audit Readiness & Documentation</p></div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#212c46] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-[#1d2636] transition-all shadow-md active:scale-95">
            <Calendar size={16} /> SCHEDULE AUDIT
          </button>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex flex-col gap-6">
        
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
           <div className="bg-white rounded-2xl border border-[#eaeaec] p-5 shadow-sm relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-5"><ClipboardList size={100} /></div>
               <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">Upcoming Audits (30 Days)</p>
               <h3 className="text-3xl font-black text-[#212c46]">2</h3>
           </div>
           <div className="bg-white rounded-2xl border border-[#eaeaec] p-5 shadow-sm relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-5"><FileBadge size={100} /></div>
               <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">Documents Ready</p>
               <h3 className="text-3xl font-black text-[#657f4d]">85%</h3>
           </div>
           <div className="bg-white rounded-2xl border border-[#eaeaec] p-5 shadow-sm relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-5 text-[#932c2e]"><ShieldAlert size={100} /></div>
               <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">Action Required</p>
               <h3 className="text-3xl font-black text-[#932c2e]">4</h3>
           </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex px-6 pt-4 border-b border-slate-200 bg-white shrink-0 gap-8">
               <button 
                 onClick={() => setActiveTab('upcoming')}
                 className={clsx(
                   "pb-4 text-[12px] font-black uppercase tracking-widest transition-all border-b-2 relative",
                   activeTab === 'upcoming' ? "border-[#212c46] text-[#212c46]" : "border-transparent text-[#7a8b95] hover:text-[#212c46]"
                 )}
               >
                 Audit Events
               </button>
               <button 
                 onClick={() => setActiveTab('documents')}
                 className={clsx(
                   "pb-4 text-[12px] font-black uppercase tracking-widest transition-all border-b-2 relative",
                   activeTab === 'documents' ? "border-[#212c46] text-[#212c46]" : "border-transparent text-[#7a8b95] hover:text-[#212c46]"
                 )}
               >
                 Master Document List
               </button>
            </div>

            {/* Controls */}
            <div className="py-4 px-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8b95]" size={16} />
                <input 
                  type="text" 
                  placeholder={activeTab === 'upcoming' ? "Search audits..." : "Search documents..."}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] font-bold outline-none focus:border-[#212c46] focus:ring-1 focus:ring-[#212c46] transition-all bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                 {activeTab === 'documents' && (
                    <button className="h-9 px-4 rounded-lg bg-white border border-[#eaeaec] text-[#212c46] text-[11px] font-bold uppercase hover:bg-slate-50 shadow-sm flex items-center gap-2">
                      <Upload size={14}/> Upload Doc
                    </button>
                 )}
                 <button className="h-9 px-4 rounded-lg bg-white border border-[#eaeaec] text-[#212c46] text-[11px] font-bold uppercase hover:bg-slate-50 shadow-sm flex items-center gap-2">
                   <Download size={14} /> Export List
                 </button>
              </div>
            </div>

            {/* Table Area */}
            <div className="overflow-auto custom-scrollbar">
               {activeTab === 'upcoming' && (
                 <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead className="bg-[#212c46] text-white">
                      <tr className="border-b-2 border-[#b7a159] sticky top-0 z-10">
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Audit Name</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Auditing Body</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Scheduled Date</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Status</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Progress</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(paginatedData as typeof audits).map((audit) => (
                        <tr key={audit.id} className="hover:bg-[#f8f9fa] transition-colors">
                          <td className="py-2.5 px-4 text-[12px]">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[#212c46]/5 border-[#212c46]/10 text-[#212c46]">
                                   <Calendar size={14} />
                              </div>
                              <div className="min-w-0 flex flex-col justify-center min-h-[32px]">
                                <h4 className="font-black text-[#212c46] uppercase leading-tight truncate">{audit.title}</h4>
                                <span className="text-[11px] text-[#7a8b95] mt-0.5 block">{audit.id} • {audit.type}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-[12px] font-bold text-[#202c38]">{audit.body}</td>
                          <td className="py-2.5 px-4 text-[12px] text-[#7a8b95]">
                             <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#a94228]" /> {audit.date}</span>
                          </td>
                          <td className="py-2.5 px-4">
                             <span className={clsx("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider border", getStatusColor(audit.status))}>
                               {audit.status === 'Ready' ? <CheckCircle2 size={10}/> : <Clock size={10}/>} {audit.status}
                             </span>
                          </td>
                          <td className="py-2.5 px-4">
                             <div className="flex items-center gap-2">
                               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[100px]">
                                 <div className={clsx("h-full rounded-full", audit.progress === 100 ? "bg-[#657f4d]" : "bg-[#d09653]")} style={{ width: `${audit.progress}%` }}></div>
                               </div>
                               <span className="text-[11px] font-bold text-[#7a8b95] w-8 text-right">{audit.progress}%</span>
                             </div>
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center justify-end">
                                <button className="h-8 px-3 flex items-center justify-center text-[#7a8b95] hover:text-[#212c46] hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 gap-1 text-[11px] font-bold" title="Open Workspace">
                                  Workspace <ChevronRight size={14} />
                                </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               )}

               {activeTab === 'documents' && (
                 <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead className="bg-[#212c46] text-white">
                      <tr className="border-b-2 border-[#b7a159] sticky top-0 z-10">
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Document Name</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Category</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Status</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Last Updated</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap">Assignee</th>
                        <th className="py-4 px-4 text-[12px] font-black uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(paginatedData as typeof documents).map((doc) => (
                        <tr key={doc.id} className="hover:bg-[#f8f9fa] transition-colors">
                          <td className="py-2.5 px-4 text-[12px]">
                            <div className="flex items-start gap-4">
                              <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border", getStatusColor(doc.status))}>
                                   <FileText size={14} />
                              </div>
                              <div className="min-w-0 flex flex-col justify-center min-h-[32px]">
                                <h4 className="font-black text-[#212c46] leading-tight truncate">{doc.name}</h4>
                                <span className="text-[11px] text-[#7a8b95] mt-0.5 block">{doc.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-[12px] font-bold text-[#202c38]">{doc.category}</td>
                          <td className="py-2.5 px-4">
                             <span className={clsx("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider border", getStatusColor(doc.status))}>
                               {doc.status}
                             </span>
                          </td>
                          <td className="py-2.5 px-4 text-[12px] text-[#7a8b95]">{doc.updatedAt}</td>
                          <td className="py-2.5 px-4 text-[12px] font-bold text-[#202c38]">{doc.assignee}</td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center justify-end">
                                <button className="h-8 px-3 flex items-center justify-center text-[#7a8b95] hover:text-[#212c46] hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 gap-1 text-[11px] font-bold">
                                  Review <ChevronRight size={14} />
                                </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="py-3 px-6 border-t border-slate-200 flex justify-between items-center bg-white shrink-0">
                  <span className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
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

