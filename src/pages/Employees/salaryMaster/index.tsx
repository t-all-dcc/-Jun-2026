"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, Search, Download, ChevronLeft, ChevronRight, HelpCircle, Eye, EyeOff, Lock, Settings, ChevronDown, ListTree
} from 'lucide-react';
import { dbSync } from '../../../services/dbSync';
import { registerHrLog } from '../../../utils/hrLogger';

import { THEME, SalaryRecord } from './types';
import { INITIAL_SALARIES, SYSTEM_COMPENSATION_CONFIGS } from './mockData';
import { UserGuidePanel } from './UserGuidePanel';
import { SalaryMasterModal } from './SalaryMasterModal';
import { KpiCard } from './KpiCard';

const formatCurrency = (amount: number) => {
  if (isNaN(amount)) return '฿0';
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const sumSafe = (...vals: (number | undefined | null)[]) => {
  return vals.reduce((acc: number, cur) => acc + (Number(cur) || 0), 0);
};

const parseArraySafe = (val: any): any[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim() !== '') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.warn('Failed to parse array:', e);
    }
  }
  return [];
};

export default function SalaryMaster() {
  const [activeTab, setActiveTab] = useState<'registry'|'settings'>('registry');
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showValues, setShowValues] = useState(false); // set to false by default as requested to match showValues image status
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean; record: SalaryRecord | null }>({ isOpen: false, record: null });
  const [toast, setToast] = useState<string | null>(null);

  const [confidentialityMap, setConfidentialityMap] = useState<Record<string, boolean>>({
    'cfg_base_salary': true,
    'cfg_deduct_tax': true
  });

  // DB Load
  useEffect(() => {
    const fetchAndLoad = async () => {
      try {
        setIsLoading(true);
        const response = await dbSync.read('salary_master');
        let loadedItems: any[] = [];
        if (Array.isArray(response)) {
          loadedItems = response;
        } else if (response && response.status === 'success' && response.data && Array.isArray(response.data.items)) {
          loadedItems = response.data.items;
        } else if (response && Array.isArray((response as any).items)) {
          loadedItems = (response as any).items;
        }
        
        if (loadedItems && loadedItems.length > 0) {
          const sanitized = loadedItems.map((r: any) => ({
            ...r,
            otherIncomes: parseArraySafe(r.otherIncomes),
            otherDeductions: parseArraySafe(r.otherDeductions),
            history: parseArraySafe(r.history)
          }));
          setRecords(sanitized);
        } else {
          await dbSync.write('salary_master', INITIAL_SALARIES);
          setRecords(INITIAL_SALARIES);
        }
      } catch (err) {
        console.error('[SalaryMaster] Loading failed, fallbacks to internal seeds: ', err);
        setRecords(INITIAL_SALARIES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndLoad();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const nameThStr = r.nameTh ? r.nameTh.toLowerCase() : '';
      const nameEnStr = r.nameEn ? r.nameEn.toLowerCase() : '';
      const empIdStr = r.empId ? r.empId.toLowerCase() : '';
      const deptStr = r.dept ? r.dept.toLowerCase() : '';
      const matchSearch = nameThStr.includes(search.toLowerCase()) || 
                          nameEnStr.includes(search.toLowerCase()) ||
                          empIdStr.includes(search.toLowerCase());
      const matchDept = filterDept === '' || deptStr === filterDept.toLowerCase();
      return matchSearch && matchDept;
    });
  }, [records, search, filterDept]);

  const currentData = useMemo(() => {
    return filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;

  // KPI Calculations
  const totalEmp = records.length;
  const avgSalary = useMemo(() => {
    if (records.length === 0) return 0;
    const total = records.reduce((sum, r) => {
      const baseline = r.payType === 'Daily' ? sumSafe(r.baseSalary) * sumSafe(r.workingDays || 26) : sumSafe(r.baseSalary);
      return sum + baseline;
    }, 0);
    return total / totalEmp;
  }, [records, totalEmp]);
  
  const totalPayroll = useMemo(() => {
    return records.reduce((sum, r) => {
      const baseMonthlyEq = r.payType === 'Daily' ? sumSafe(r.baseSalary) * sumSafe(r.workingDays || 26) : sumSafe(r.baseSalary);
      const otherInc = parseArraySafe(r.otherIncomes).reduce((acc: number, i: any) => acc + sumSafe(i.amount), 0);
      const otherDed = parseArraySafe(r.otherDeductions).reduce((acc: number, d: any) => acc + sumSafe(d.amount), 0);

      const gross = baseMonthlyEq + sumSafe(
        r.allowancePos, 
        r.allowanceIncentive, 
        r.allowanceTravel, 
        r.allowanceMeal, 
        r.allowanceAccommodation, 
        r.allowanceRisk, 
        otherInc
      );
      const deduct = sumSafe(
        r.deductTax, 
        r.deductSSO, 
        r.deductHousing, 
        r.deductLoan, 
        otherDed
      );
      return sum + (gross - deduct);
    }, 0);
  }, [records]);

  const departments = useMemo(() => {
    return [...new Set(records.map(e => e.dept).filter(Boolean))];
  }, [records]);

  const handleOpenModal = (record: SalaryRecord) => setModalState({ isOpen: true, record });
  
  const handleSaveRecord = async (updatedData: SalaryRecord) => {
    try {
      const updatedRecords = records.map(r => r.id === updatedData.id ? updatedData : r);
      setRecords(updatedRecords);
      await dbSync.update('salary_master', [updatedData]);
      
      // System log trace
      registerHrLog(
        'Payroll',
        'SALARY_UPDATE',
        `Updated salary baseline for employee ${updatedData.nameEn || updatedData.nameTh || 'Staff'} (ID: ${updatedData.empId || updatedData.id}) - New Base: THB ${Number(updatedData.baseSalary || 0).toLocaleString()}`
      );

      showNotification('Master Data updated successfully.');
    } catch (err) {
      console.error(err);
      showNotification('Failed to update and sync salary baseline.');
    }
  };

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    showNotification('Exporting Payroll baselines matrix to CSV...');
  };

  const toggleConfidentiality = (id: string) => {
    setConfidentialityMap(prev => ({ ...prev, [id]: !prev[id] }));
    showNotification('Configuration lock state toggled.');
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      
      {/* Floating Action Guide trigger */}
      <button 
        type="button"
        onClick={() => setIsGuideOpen(true)} 
        className="fixed right-0 bg-[#f8fafc] border border-[#e2e8f0] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#851c24] hover:text-white hover:border-[#851c24] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group cursor-pointer" 
        style={{ top: '80px' }}
      >
        <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#64748b] group-hover:text-white" />
        <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[10px] font-mono leading-none">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      
      <SalaryMasterModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({isOpen: false, record: null})} 
        record={modalState.record} 
        onSave={handleSaveRecord} 
      />
      
      {toast && (
        <div className="fixed bottom-6 right-6 z-[1000] animate-fadeIn bg-white border-l-4 border-[#851c24] shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-5 py-4 rounded-xl flex items-center gap-3">
          <Database size={18} className="text-[#851c24]" />
          <span className="text-[11px] font-black text-[#212c46] uppercase tracking-widest font-sans">{toast}</span>
          <button type="button" onClick={() => setToast(null)} className="ml-4 text-[#64748b] hover:text-[#b22026]"><XCircleIcon /></button>
        </div>
      )}

      {/* HEADER SECTION (padding px-8 matching config guidelines) */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#851c24] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#851c24]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Database size={22} className="text-[#851c24]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
                SALARY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#851c24] to-[#b58c4f]">MASTER DATA</span>
              </h3>
              <span className="bg-[#851c24] text-white text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider shadow-sm font-mono leading-none">
                <Lock size={10} strokeWidth={3} /> HR ONLY
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              CONFIDENTIAL FIXED BASELINE CONFIGURATION & COMPENSATION BRACKETS
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setShowValues(!showValues)} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-xs ${
              showValues ? 'bg-white text-[#851c24] border-[#851c24]/35 shadow-sm' : 'bg-white text-[#475569] border-[#cbd5e1] hover:text-[#212c46]'
            }`}
          >
            {showValues ? <Eye size={13} /> : <EyeOff size={13} />} {showValues ? 'Hide Values' : 'Show Values'}
          </button>
          
          <div className="bg-white/65 p-1 rounded-full border border-[#cbd5e1]/40 shadow-inner flex items-center gap-0.5">
            <button 
              type="button" 
              onClick={() => setActiveTab('registry')} 
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#64748b] hover:text-[#851c24]'
              }`}
            >
              <Database size={12} /> Global Registry
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('settings')} 
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                activeTab === 'settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#64748b] hover:text-[#851c24]'
              }`}
            >
              <Settings size={12} /> Config Settings
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION (padding px-4 sm:px-8 matching permissions guidelines) */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        
        {activeTab === 'registry' ? (
          <>
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 shrink-0">
              <KpiCard 
                label="TOTAL STAFF IN REGISTRY" 
                value={totalEmp} 
                icon="users" 
                colorAccent="#851c24" 
                desc="ACTIVE PROFILES" 
              />
              <KpiCard 
                label="AVG. BASE EQV. (MONTHLY)" 
                value={showValues ? formatCurrency(avgSalary) : '***,***'} 
                icon="trending-up" 
                colorAccent="#b58c4f" 
                desc="MONTHLY BASIS" 
              />
              <KpiCard 
                label="TOTAL FIXED NET" 
                value={showValues ? formatCurrency(totalPayroll) : '***,***'} 
                icon="banknote" 
                colorAccent="#508660" 
                desc="BASELINE PAYABLE" 
              />
              <KpiCard 
                label="SYSTEM STATUS" 
                value="LOCKED" 
                icon="shield-check" 
                colorAccent="#851c24" 
                colorValue="#b22026" 
                desc="ENCRYPTED DATA" 
              />
            </div>

            {/* MAIN DATA TABLE REGISTRY */}
            <div className="bg-white rounded-2xl shadow-md border border-[#cbd5e1]/45 overflow-hidden flex flex-col min-h-[420px] animate-fadeIn">
              
              {/* Table Toolbar */}
              <div className="px-6 py-4 border-b border-[#cbd5e1]/40 bg-[#f8fafc] flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#851c24]" />
                    <input 
                      type="text" 
                      value={search} 
                      onChange={(e)=>setSearch(e.target.value)} 
                      placeholder="Search employee..." 
                      className="w-full pl-10 pr-5 py-2 text-[11px] border border-[#cbd5e1] rounded-full font-bold outline-none focus:border-[#851c24] bg-white text-[#212c46] shadow-2xs tracking-tight transition-all placeholder:text-[#64748b]/70" 
                    />
                  </div>
                  <select 
                    value={filterDept} 
                    onChange={(e)=>setFilterDept(e.target.value)} 
                    className="bg-white border border-[#cbd5e1]/80 rounded-full px-4 py-2 text-[11px] font-bold outline-none focus:border-[#851c24] text-[#475569] shadow-2xs cursor-pointer w-44"
                  >
                    <option value="">All Departments</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <button 
                  type="button" 
                  onClick={handleExport} 
                  className="bg-[#212c46] hover:bg-[#851c24] text-white px-6 py-2.5 rounded-full font-black text-[10.5px] uppercase tracking-widest shadow-xs transition-all flex items-center gap-2 shrink-0 border border-transparent cursor-pointer font-sans"
                >
                  <Download size={13} strokeWidth={3} /> Export Matrix
                </button>
              </div>

              {/* Responsive table */}
              <div className="overflow-x-auto custom-scrollbar bg-white flex-1">
                <table className="w-full text-left font-sans border-collapse min-w-[1050px]">
                  <thead className="bg-[#f8fafc] text-[#475569] border-b-2 border-[#851c24]">
                    <tr>
                      <th className="py-4 px-5 text-[11px] font-black uppercase tracking-widest">Employee Profile</th>
                      <th className="py-4 px-5 text-[11px] font-black uppercase tracking-widest">Position & Dept</th>
                      <th className="py-4 px-5 text-[11px] font-black uppercase tracking-widest text-right">Base / Rate</th>
                      <th className="py-4 px-5 text-[11px] font-black uppercase tracking-widest text-right">Fixed Allowances</th>
                      <th className="py-4 px-5 text-[11px] font-black uppercase tracking-widest text-right">Fixed Deductions</th>
                      <th className="py-4 px-5 text-[11px] font-black uppercase tracking-widest text-right whitespace-nowrap">Fixed Net (Baseline)</th>
                      <th className="py-4 px-5 text-[11px] font-black uppercase tracking-widest text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#cbd5e1]/30">
                    {currentData.map((item) => {
                      const otherInc = parseArraySafe(item.otherIncomes).reduce((sum: number, i: any) => sum + sumSafe(i.amount), 0);
                      const otherDed = parseArraySafe(item.otherDeductions).reduce((sum: number, d: any) => sum + sumSafe(d.amount), 0);
                      const baseSalaryCalculated = sumSafe(item.baseSalary);
                      const baseMonthlyEq = item.payType === 'Daily' ? baseSalaryCalculated * sumSafe(item.workingDays || 26) : baseSalaryCalculated;
                      
                      const totalAllowances = sumSafe(
                        item.allowancePos, 
                        item.allowanceIncentive, 
                        item.allowanceTravel, 
                        item.allowanceMeal, 
                        item.allowanceAccommodation, 
                        item.allowanceRisk, 
                        otherInc
                      );
                      const totalDeductionsCalculated = sumSafe(
                        item.deductTax, 
                        item.deductSSO, 
                        item.deductHousing, 
                        item.deductLoan, 
                        otherDed
                      );
                      
                      const gross = baseMonthlyEq + totalAllowances;
                      const net = gross - totalDeductionsCalculated;

                      return (
                        <tr 
                          key={item.id} 
                          className="hover:bg-[#f1f5f9]/25 transition-colors group cursor-pointer" 
                          onClick={() => handleOpenModal(item)}
                        >
                          <td className="py-3 px-5 text-[12px]">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#cbd5e1] shadow-xs shrink-0 bg-[#f1f5f9]">
                                {item.image ? (
                                  <img referrerPolicy="no-referrer" src={item.image} alt={item.nameEn} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">?</div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-[#212c46] text-[12.5px] leading-tight tracking-tight">{item.empId}</span>
                                <span className="font-bold text-[#64748b] text-[11px] leading-none mt-1">{item.nameEn}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-5 text-[12px]">
                            <p className="font-black text-[#212c46] text-[12px] leading-tight">{item.jobTitle}</p>
                            <p className="font-bold text-[#8)51c24] text-[9.5px] uppercase mt-1 leading-none text-[#851c24]">{item.dept}</p>
                          </td>
                          <td className="py-3 px-5 text-right text-[12px]">
                            <p className="font-black font-mono text-[#212c46] text-[12.5px]">{showValues ? formatCurrency(baseSalaryCalculated) : '***,***'}</p>
                            <p className="text-[9px] font-black text-[#3f809e] uppercase tracking-widest mt-1.5 leading-none">/ {item.payType}</p>
                          </td>
                          <td className="py-3 px-5 text-right text-[12px]">
                            <p className="font-black font-mono text-[#508660] text-[12.5px]">+{showValues ? formatCurrency(totalAllowances) : '***,***'}</p>
                            {otherInc > 0 && <p className="text-[8.5px] font-black text-[#508660]/90 uppercase tracking-widest mt-1.5 leading-none inline-block border border-emerald-200 bg-[#f0f9f6] px-1.5 py-0.5 rounded-md font-mono">+OTHER INC.</p>}
                          </td>
                          <td className="py-3 px-5 text-right text-[12px]">
                            <p className="font-black font-mono text-[#b22026] text-[12.5px]">{showValues ? `-${formatCurrency(totalDeductionsCalculated)}` : '***,***'}</p>
                            {otherDed > 0 && <p className="text-[8.5px] font-black text-[#b22026]/90 uppercase tracking-widest mt-1.5 leading-none inline-block border border-rose-200 bg-rose-50 px-1.5 py-0.5 rounded-md font-mono">-OTHER DED.</p>}
                          </td>
                          <td className="py-3 px-5 text-right text-[12px]">
                            <div className="bg-[#f1f5f9] px-3.5 py-1.5 rounded-xl border border-[#cbd5e1]/30 inline-block">
                              <p className="font-black font-mono text-[#212c46] text-[13px]">{showValues ? formatCurrency(net) : '***,***'}</p>
                            </div>
                          </td>
                          <td className="py-3 px-5 text-center text-[12px]" onClick={e => e.stopPropagation()}>
                            <button 
                              type="button" 
                              onClick={() => handleOpenModal(item)} 
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#3f809e] bg-[#3f809e]/5 hover:bg-[#3f809e]/15 hover:shadow-xs transition-all cursor-pointer"
                              title="Edit Parameters"
                            >
                              ⚙️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {currentData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-16 text-[#64748b] font-black text-[12px] uppercase">
                          No configurations matched filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION PANEL */}
              <div className="px-6 py-3.5 bg-[#F0EAE1]/80 border-t-[1.5px] border-[#cbd5e1]/40 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-6 text-[10px] font-black text-[#414757] uppercase tracking-widest flex-wrap">
                  <div className="flex items-center gap-2">
                    <span>Display:</span>
                    <select 
                      value={itemsPerPage} 
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                      className="bg-white border border-[#cbd5e1] rounded-lg px-2 py-1 outline-none font-black text-[#475569] cursor-pointer shadow-2xs font-sans"
                    >
                      {[5, 10, 20, 50].map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <p className="bg-white px-3 py-1 rounded-lg border border-[#cbd5e1] shadow-2xs font-mono">Count: {filteredRecords.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1} 
                    className={`w-8 h-8 border border-[#cbd5e1] bg-white rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white shadow-2xs'
                    }`}
                  >
                    <ChevronLeft size={14}/>
                  </button>
                  <div className="bg-white text-[#475569] px-3 py-1.5 rounded-lg font-black text-[10px] min-w-[90px] text-center uppercase tracking-widest border border-[#cbd5e1] shadow-2xs font-mono">
                    Page {currentPage} / {totalPages}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages || totalPages === 0} 
                    className={`w-8 h-8 border border-[#cbd5e1] bg-white rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white shadow-2xs'
                    }`}
                  >
                    <ChevronRight size={14}/>
                  </button>
                </div>
              </div>

            </div>
          </>
        ) : (
          /* CONFIG SETTINGS TAB */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            
            <div className="lg:col-span-4 bg-white/95 p-6 rounded-[24px] shadow-lg border border-[#cbd5e1]/45 h-fit">
              <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b58c4f] pb-4 mb-6">
                🔐 STABILITY BASELINES
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white border border-[#cbd5e1] rounded-xl shadow-xs hover:border-[#508660] transition-colors">
                  <div className="flex items-center gap-2 text-[#508660] font-black text-[11px] uppercase tracking-widest mb-1.5">
                    🔓 Public Node
                  </div>
                  <p className="text-[11px] text-[#64748b] font-bold leading-relaxed">
                    รายละเอียดรายรับบำเหน็จที่ตกลง: บุคลากรสามารถเข้าวิเคราห์หรือพิมพ์สลิปและข้อตกลงส่วนบุคคลได้สะดวก
                  </p>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl shadow-xs hover:border-[#932c2e] transition-colors">
                  <div className="flex items-center gap-2 text-[#932c2e] font-black text-[11px] uppercase tracking-widest mb-1.5">
                    🔒 Restricted Gate
                  </div>
                  <p className="text-[11px] text-rose-700/80 font-bold leading-relaxed">
                    ข้อมูลส่วนเฉพาะ: การจัดทำค่าจ้าง-ยอดเงินเดือน จะทำงานซ่อนไว้ปลอดภัย และอนุรักษ์จำกัดสิทธิ์เฉพาะผู้ใช้ HR เท่านั้น
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white rounded-[24px] shadow-lg border border-[#cbd5e1]/45 overflow-hidden">
              <div className="p-6 bg-[#f8fafc] border-b border-[#cbd5e1]/40">
                <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3">
                  <ListTree size={18} className="text-[#b58c4f]"/> COMPENSATION ACCESS BASES
                </h4>
              </div>
              <div className="p-6 space-y-4">
                {SYSTEM_COMPENSATION_CONFIGS.map(cfg => (
                  <div 
                    key={cfg.id} 
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
                      confidentialityMap[cfg.id] ? 'bg-rose-50/40 border-rose-200/60 shadow-2xs' : 'bg-white border-[#cbd5e1]/50 hover:border-[#851c24]/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner ${
                        confidentialityMap[cfg.id] ? 'bg-rose-500/10 text-[#851c24] border-rose-200/60' : 'bg-[#f1f5f9] text-[#212c46] border-[#cbd5e1]/50'
                      }`}>
                        ⚙️
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#212c46] text-[12px] uppercase tracking-widest">{cfg.label}</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${confidentialityMap[cfg.id] ? 'text-[#851c24]' : 'text-[#64748b]'}`}>
                          {cfg.desc}
                        </span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={()=>toggleConfidentiality(cfg.id)} 
                      className={`p-2.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 border ${
                        confidentialityMap[cfg.id] ? 'bg-[#851c24] text-white border-[#932c2e]' : 'bg-white text-[#64748b] border-[#cbd5e1] hover:bg-[#f8fafc]'
                      }`}
                    >
                      {confidentialityMap[cfg.id] ? '🔒' : '🔓'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        <div className="mt-8 h-8 w-full" />
      </div>
    </div>
  );
}

function XCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
  );
}
