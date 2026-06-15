import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { 
  Users, Search, Plus, Pencil, Trash2, Download, Building2, Mail, 
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useLanguage } from '../../../context/LanguageContext';
import { dbSync } from '../../../services/dbSync';

import { THEME, Employee } from './types';
import { INITIAL_EMPLOYEES } from './mockData';
import { LucideIcon } from './LucideIcon';
import { KpiCard } from './KpiCard';
import { UserGuidePanel } from './UserGuidePanel';
import { EmployeeStats } from './EmployeeStats';
import { EmployeeModal } from './EmployeeModal';

const MySwal = withReactContent(Swal);

export default function EmployeeDirectory() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterOffice, setFilterOffice] = useState('');
  const [filterWorkStatus, setFilterWorkStatus] = useState('');
  const [filterJobStatus, setFilterJobStatus] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean; user: Employee | null }>({ isOpen: false, user: null });
  const [loading, setLoading] = useState(true);

  // Load from dbSync
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        console.log("[Directory] Loading employees from dbSync...");
        const response = await dbSync.read<any>('employees');
        if (response && response.status === 'success' && response.data && Array.isArray(response.data.items)) {
          const loaded = response.data.items;
          if (loaded.length === 0) {
            console.log("[Directory] Database empty. Seeding INITIAL_EMPLOYEES...");
            await dbSync.write('employees', INITIAL_EMPLOYEES);
            setUsers(INITIAL_EMPLOYEES);
            localStorage.setItem('local_employee_directory', JSON.stringify(INITIAL_EMPLOYEES));
          } else {
            const items = loaded.map((u: any) => ({
              ...u,
              id: isNaN(u.id) ? u.id : Number(u.id)
            }));
            setUsers(items);
            localStorage.setItem('local_employee_directory', JSON.stringify(items));
          }
        } else {
          setUsers(INITIAL_EMPLOYEES);
        }
      } catch (err) {
        console.error("Failed to load employees from dbSync:", err);
        setUsers(INITIAL_EMPLOYEES);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const saveToStorage = (newRecords: Employee[]) => {
    setUsers(newRecords);
    localStorage.setItem('local_employee_directory', JSON.stringify(newRecords));
  };

  // Unique Filtering Lists
  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(u => { 
      counts[u.dept] = (counts[u.dept] || 0) + 1; 
    });
    return counts;
  }, [users]);

  const departmentCounts = useMemo(() => {
    return Object.entries(deptCounts).map(([name, value]) => ({ name, value }));
  }, [deptCounts]);

  const officeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(u => { 
      counts[u.office] = (counts[u.office] || 0) + 1; 
    });
    return counts;
  }, [users]);

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const searchStr = search.toLowerCase();
      const matchSearch = searchStr === '' || (
        u.nameTh?.toLowerCase().includes(searchStr) || 
        u.nameEn?.toLowerCase().includes(searchStr) || 
        u.staffId?.toLowerCase().includes(searchStr) ||
        u.dept?.toLowerCase().includes(searchStr) ||
        u.jobTitle?.toLowerCase().includes(searchStr) ||
        u.phone?.toLowerCase().includes(searchStr) ||
        u.email?.toLowerCase().includes(searchStr)
      );
      
      const matchDept = filterDept === '' || u.dept === filterDept;
      const matchOffice = filterOffice === '' || u.office === filterOffice;
      const matchWorkStatus = filterWorkStatus === '' || u.workStatus === filterWorkStatus;
      const matchJobStatus = filterJobStatus === '' || u.jobStatus === filterJobStatus;

      return matchSearch && matchDept && matchOffice && matchWorkStatus && matchJobStatus;
    });
  }, [users, search, filterDept, filterOffice, filterWorkStatus, filterJobStatus]);

  const currentData = useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  // KPI Calculations
  const totalHeadcount = users.length;
  const activePersonnel = users.filter(u => u.workStatus === 'Active').length;
  const draftPersonnel = users.filter(u => u.workStatus !== 'Active').length;
  const distinctDeptsCount = Object.keys(deptCounts).length;

  // Handlers
  const handleOpenModal = (user: Employee | null = null) => {
    setModalState({ isOpen: true, user });
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (userData.id) {
        // Edit Mode
        const updatedItem = {
          ...userData,
          id: isNaN(userData.id) ? userData.id : Number(userData.id),
          name: `${userData.nameTh || ''} (${userData.nameEn || ''})`.trim(),
          employeeId: userData.staffId || userData.employeeId,
          status: userData.workStatus || userData.status,
          position: userData.jobTitle || userData.position,
          department: userData.dept || userData.department,
          avatar: userData.image || userData.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
          image: userData.image || userData.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
          isActive: userData.workStatus === 'Active'
        };
        
        const updatedList = users.map(u => u.id === userData.id ? updatedItem : u);
        saveToStorage(updatedList);
        await dbSync.update('employees', [updatedItem]);
        
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'บันทึกแก้ไขข้อมูลประวัติพนักงานเรียบร้อยแล้ว',
          confirmButtonColor: '#212c46'
        });
      } else {
        // Create Mode
        const maxId = users.length > 0 ? Math.max(...users.map(u => isNaN(u.id) ? 0 : Number(u.id))) : 0;
        const newId = maxId + 1;
        const newItem = {
          ...userData,
          id: newId,
          name: `${userData.nameTh || ''} (${userData.nameEn || ''})`.trim(),
          employeeId: userData.staffId || userData.employeeId,
          status: userData.workStatus || userData.status,
          position: userData.jobTitle || userData.position,
          department: userData.dept || userData.department,
          avatar: userData.image || userData.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
          image: userData.image || userData.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
          isActive: userData.workStatus === 'Active'
        };
        
        const updatedList = [...users, newItem];
        saveToStorage(updatedList);
        await dbSync.write('employees', [newItem]);
        
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'บันทึกประวัติพนักงานใหม่เรียบร้อยแล้ว',
          confirmButtonColor: '#212c46'
        });
      }
    } catch (err) {
      console.error("Failed to save employee to dbSync:", err);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดในการบันทึก',
        text: 'ไม่สามารถบันทึกลง Google Sheet และ Firebase ได้ในขณะนี้ ระบบจัดเก็บเฉพาะที่',
        confirmButtonColor: '#212c46'
      });
    }
  };

  const handleDelete = (id: number) => {
    const targetUser = users.find(u => u.id === id);
    if (!targetUser) return;
    MySwal.fire({
      title: 'ลบข้อมูลประวัติพนักงานหรือไม่?',
      text: `คุณต้องการลบข้อมูลประวัติทั้งหมดของคุณ ${targetUser.nameEn} สมบูรณ์จากระบบ SMART LAW ใช่หรือไม่? ข้อมูลนี้ไม่สามารถกู้คืนได้`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบบันทึก',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#932c2e',
      cancelButtonColor: '#7a8b95'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedList = users.filter(u => u.id !== id);
          saveToStorage(updatedList);
          await dbSync.delete('employees', [{ id }]);
          Swal.fire({
            icon: 'success',
            title: 'ลบเรียบร้อยแล้ว',
            text: 'ระบบทำการลบประวัติพนักงานออกเรียบร้อยสมบูรณ์ ทั้งระบบริการและฐานข้อมูลบนคลาวด์',
            confirmButtonColor: '#212c46'
          });
        } catch (err) {
          console.error("Failed to delete employee from dbSync:", err);
          Swal.fire({
            icon: 'error',
            title: 'จำกัดขอบข่ายการลบข้อมูล',
            text: 'ไม่สามารถลบข้อมูลจากคลาวด์ได้ขณะนี้ คอร์เน็ตเวิร์กออฟไลน์',
            confirmButtonColor: '#212c46'
          });
        }
      }
    });
  };

  const handleExportData = () => {
    Swal.fire({
      icon: 'info',
      title: 'ออกรายงานประวัติพนักงาน',
      text: 'ระบบกำลังดึงข้อมูลพนักงานทั้งหมดเพื่อนำส่งเข้ารอบ PDF/Excel คลาวด์ของบริษัท',
      confirmButtonColor: '#212c46'
    });
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* USER GUIDE FLOATING TAB */}
      {typeof document !== 'undefined' && createPortal(
        <button 
          type="button"
          onClick={() => setIsGuideOpen(true)} 
          className="fixed right-0 bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group" 
          style={{ top: '80px' }}
        >
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
        </button>,
        document.body
      )}

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      
      <EmployeeModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ isOpen: false, user: null })} 
        emp={modalState.user} 
        onSave={handleSaveUser} 
      />

      {/* HEADER SECTION --- Permissions Page Layout Match */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <Users size={28} strokeWidth={2.5} className="text-[#3f809e]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
              EMPLOYEE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">DIRECTORY</span> NODE
            </h3>
            <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
              CENTRALIZED DIGITAL PROFILES & WORKFORCE INFORMATION MANAGEMENT HUB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            type="button"
            onClick={handleExportData} 
            className="hidden lg:flex items-center gap-2 bg-white/80 border border-[#eaeaec] text-[#212c46] hover:bg-[#f8f9fa] py-2.5 px-6 rounded-full text-[11px] uppercase font-black tracking-widest shadow-sm transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Download size={14} className="text-[#b58c4f]" /> {t('Export Profiles')}
          </button>
        </div>
      </div>

      {/* CONTENT SECTION --- Exact fit with User Permissions */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 font-bold uppercase text-[11px] tracking-widest gap-2">
            <span className="w-6 h-6 border-2 border-[#b58c4f] border-t-transparent rounded-full animate-spin"></span>
            Loading Workforce Node...
          </div>
        ) : (
          <div className="w-full space-y-4">
            
            {/* KPI STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              <KpiCard label={t('Overall Headcount')} value={totalHeadcount} icon="users" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc={t('Rostered Profiles')} />
              <KpiCard label={t('Active Personnel')} value={activePersonnel} icon="shield-check" colorAccent={THEME.success} colorValue={THEME.success} desc={t('On Duty')} />
              <KpiCard label={t('Offboarding/Draft')} value={draftPersonnel} icon="alert-triangle" colorAccent={THEME.danger} colorValue={THEME.danger} desc={t('Off / Resigned')} />
              <KpiCard label={t('Departments')} value={distinctDeptsCount} icon="workflow" colorAccent={THEME.gold} colorValue={THEME.primary} desc={t('Active Branches')} />
            </div>

            {/* ANALYTICS HUB */}
            <EmployeeStats 
              totalHeadcount={totalHeadcount} 
              departmentCounts={departmentCounts} 
              t={t} 
            />

            {/* MAIN DATA INTERACTIVE PORTAL CARD */}
            <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col animate-fadeIn">
                
              {/* ADVANCED TOOLBAR */}
              <div className="px-8 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shrink-0">
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                    
                  {/* CASCADING FILTER DROPDOWNS */}
                  <select 
                    value={filterDept} 
                    onChange={(e) => { setFilterDept(e.target.value); }} 
                    className="bg-white border border-[#eaeaec] rounded-full px-4 py-2.5 text-[11px] font-black outline-none focus:border-[#4d87a8] text-[#414757] shadow-sm cursor-pointer w-full sm:w-44 appearance-none"
                  >
                    <option value="">{t('All Depts')}</option>
                    {Object.keys(deptCounts).map(d => <option key={d} value={d}>{d} ({deptCounts[d] || 0})</option>)}
                  </select>

                  <select 
                    value={filterOffice} 
                    onChange={(e) => setFilterOffice(e.target.value)} 
                    className="bg-white border border-[#eaeaec] rounded-full px-4 py-2.5 text-[11px] font-black outline-none focus:border-[#4d87a8] text-[#414757] shadow-sm cursor-pointer w-full sm:w-44 appearance-none"
                  >
                    <option value="">{t('All Offices')}</option>
                    {Object.keys(officeCounts).map(o => <option key={o} value={o}>{o} ({officeCounts[o] || 0})</option>)}
                  </select>

                  <select 
                    value={filterJobStatus} 
                    onChange={(e) => setFilterJobStatus(e.target.value)} 
                    className="bg-white border border-[#eaeaec] rounded-full px-4 py-2.5 text-[11px] font-black outline-none focus:border-[#4d87a8] text-[#414757] shadow-sm cursor-pointer w-full sm:w-44 appearance-none"
                  >
                    <option value="">{t('All Contract Types')}</option>
                    <option value="Permanent">{t('Permanent')}</option>
                    <option value="Probation">{t('Probation')}</option>
                    <option value="Contract">{t('Contract')}</option>
                    <option value="Intern">{t('Intern')}</option>
                  </select>

                  <select 
                    value={filterWorkStatus} 
                    onChange={(e) => setFilterWorkStatus(e.target.value)} 
                    className="bg-white border border-[#eaeaec] rounded-full px-4 py-2.5 text-[11px] font-black outline-none focus:border-[#4d87a8] text-[#414757] shadow-sm cursor-pointer w-full sm:w-44 appearance-none"
                  >
                    <option value="">{t('All Status')}</option>
                    <option value="Active">{t('Active')}</option>
                    <option value="Resigned">{t('Resigned')}</option>
                    <option value="Suspended">{t('Suspended')}</option>
                  </select>

                  <div className="h-6 w-[2.5px] bg-[#eaeaec] hidden sm:block mx-1"></div>

                  {/* SEARCH INPUT */}
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                    <input 
                      type="text" 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)} 
                      placeholder={t('Search by name, ID or title...')} 
                      className="w-full pl-11 pr-5 py-2.5 text-[11.5px] border border-[#eaeaec] rounded-full font-bold outline-none focus:border-[#4d87a8] bg-white shadow-sm text-[#212c46] transition-all" 
                    />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
                  <button 
                    type="button"
                    onClick={() => handleOpenModal()} 
                    className="bg-[#212c46] text-white px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center justify-center gap-2 border border-[#212c46] cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={3} /> {t('Add Employee')}
                  </button>
                </div>
              </div>

              {/* EMPLOYEES DATA TABLE */}
              <div className="overflow-auto custom-scrollbar">
                <table className="w-full text-left font-sans border-collapse min-w-[1000px]">
                  <thead className="bg-[#212c46] text-white">
                    <tr className="border-b-2 border-[#b7a159]">
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap w-24 text-center">{t('Portrait')}</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">{t('Staff Node Identity')}</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">{t('Department & Office')}</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">{t('Job Position')}</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">{t('Contact & Mobile')}</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center w-36">{t('Status')}</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center w-32">{t('Action')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#eaeaec]">
                    {currentData.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group">
                        <td className="py-2.5 px-6 whitespace-nowrap text-center">
                          <div className="w-11 h-11 rounded-full border border-[#eaeaec] bg-slate-50 overflow-hidden shadow-sm mx-auto flex items-center justify-center text-[#7a8b95]">
                            {item.image ? (
                              <img src={item.image} alt={item.nameEn} className="w-full h-full object-cover" />
                            ) : (
                              <Icons.User size={18} />
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-6 whitespace-nowrap">
                          <div className="flex flex-col">
                            <p className="font-mono text-[#212c46] font-black text-[13px]">
                              {item.staffId}
                            </p>
                            <p className="text-[12.4px] font-black text-[#b58c4f] uppercase tracking-tight mt-1">
                              {item.nameEn} <span className="text-slate-400 font-sans font-bold text-[10px] ml-1">({item.nickName || t('No Nickname')})</span>
                            </p>
                          </div>
                        </td>
                        <td className="py-2.5 px-6 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-black text-[#212c46] uppercase leading-none">{item.dept}</span>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase mt-1 flex items-center gap-1">
                              <Building2 size={11} className="text-[#b7a159]"/> {item.office}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-6 whitespace-nowrap">
                          <p className="text-[12px] font-bold text-[#414757] uppercase leading-none">{item.jobTitle}</p>
                          <span className={`border font-black text-[9px] uppercase px-2.5 py-0.5 rounded-full inline-block mt-1 font-mono
                            ${item.jobStatus === 'Permanent' ? 'bg-[#212c46]/10 text-[#212c46] border-[#212c46]/20' : 
                              item.jobStatus === 'Probation' ? 'bg-[#b58c4f]/15 text-[#b58c4f] border-[#b58c4f]/35' : 
                              item.jobStatus === 'Contract' ? 'bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/20' :
                              'bg-purple-100 text-purple-700 border-purple-300'}`}>
                            {t(item.jobStatus)}
                          </span>
                        </td>
                        <td className="py-2.5 px-6 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-[11.5px] font-mono font-bold text-[#212c46]">{item.phone}</span>
                            <span className="text-[10.5px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                              <Mail size={11} className="text-[#4d87a8]"/> {item.email || t('No documented email')}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-6 text-center">
                          <span className={`px-3 py-1 text-center inline-block min-w-[105px] rounded-full text-[10px] font-black uppercase tracking-widest border font-mono
                            ${item.workStatus === 'Active' ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30' : 
                              item.workStatus === 'Resigned' ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' :
                              'bg-amber-500/10 text-amber-700 border-amber-500/30'}`}>
                            {t(item.workStatus)}
                          </span>
                        </td>
                        <td className="py-2.5 px-6 text-center">
                          <div className="flex justify-center items-center gap-1">
                            <button 
                              type="button"
                              onClick={() => handleOpenModal(item)} 
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#3f809e] hover:bg-[#3f809e]/10 hover:shadow-sm transition-all active:scale-90 cursor-pointer" 
                              title="Edit Profile"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDelete(item.id)} 
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#932c2e] hover:bg-[#932c2e]/10 hover:shadow-sm transition-all active:scale-90 cursor-pointer" 
                              title="Delete Profile"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {currentData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-[#7a8b95] font-bold text-[12px]">
                          No registered employee profiles found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="px-6 py-3 bg-[#F0EAE1]/80 backdrop-blur-md border-t-[1.5px] border-[#adb2b0]/50 flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-[24px] shrink-0">
                <div className="flex items-center gap-5 text-[11px] font-black text-[#606a5f] uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span>Display Rows:</span>
                    <select 
                      value={itemsPerPage} 
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                      className="bg-white border border-[#939885]/40 rounded-lg px-2.5 py-1.5 outline-none font-black text-[#414757] cursor-pointer shadow-sm focus:border-[#4d87a8] focus:ring-1 focus:ring-[#4d87a8]/20"
                    >
                      {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <p className="bg-white px-3.5 py-1.5 rounded-lg border border-[#939885]/40 shadow-sm font-mono">Total Records: {filteredUsers.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1} 
                    className={`w-9 h-9 border border-[#939885]/40 bg-white rounded-lg flex items-center justify-center transition-all cursor-pointer ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#212c46] shadow-sm active:scale-90'}`}
                  >
                    <ChevronLeft size={16}/>
                  </button>
                  <div className="bg-white text-[#414757] px-4 py-2 rounded-lg font-black text-[11px] min-w-[100px] text-center uppercase tracking-widest border border-[#939885]/40 shadow-sm font-mono">
                    Page {currentPage} / {totalPages}
                  </div>
                  <button 
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages || totalPages === 0} 
                    className={`w-9 h-9 border border-[#939885]/40 bg-white rounded-lg flex items-center justify-center transition-all cursor-pointer ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#212c46] shadow-sm active:scale-90'}`}
                  >
                    <ChevronRight size={16}/>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
