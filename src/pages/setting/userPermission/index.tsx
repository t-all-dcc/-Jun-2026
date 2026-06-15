import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import SkeletonLoading from '../../../components/shared/SkeletonLoading';
import UserGuidePanel from './components/UserGuidePanel';
import EditUserModal from './components/EditUserModal';
import GlobalRegistryTab from './components/GlobalRegistryTab';
import StaffAccessTab from './components/StaffAccessTab';
import KpiCard from '../../../components/shared/KpiCard';
import { User, THEME } from './types';
import { SYSTEM_MODULES } from '../../../config/modules';

export default function UserPermission() {
  const [activeTab, setActiveTab] = useState('registry'); 
  const [viewMode, setViewMode] = useState('list'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [editModal, setEditModal] = useState<any>({ isOpen: false, user: null });
  const [expandedModules, setExpandedModules] = useState<any>({ sr_so: true, vendors: true, analytics: true, inventory: true });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({'settings': true, 'risk_management': true});

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'SOMCHAI WORKER', position: 'SALES MANAGER', email: 'somchai.w@salepro.com', avatar: 'https://i.pravatar.cc/150?img=11', isDev: false, permissions: { dashboard: [1, 2, 3, 4], analytics: [1, 2] } },
    { id: 2, name: 'SUDA QUALITY', position: 'QC SUPERVISOR', email: 'suda.q@salepro.com', avatar: 'https://i.pravatar.cc/150?img=5', isDev: false, permissions: { dashboard: [1] } },
    { id: 3, name: 'PHICHAMON ADMIN', position: 'Lead Developer', email: 'tallintelligence.dcc@gmail.com', avatar: 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400', isDev: true, permissions: { '*': [1, 2, 3, 4] } },
    { id: 4, name: 'SARAH ACCOUNTING', position: 'FINANCE', email: 'sarah@salepro.com', avatar: 'https://i.pravatar.cc/150?img=9', isDev: false, permissions: { dashboard: [1] } }
  ]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.position.toLowerCase().includes(search.toLowerCase()));
  }, [users, search]);

  const currentData = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedModules((prev: any) => ({ ...prev, [id]: !prev[id] }));

  const saveUserPermissions = (savedUser: User, newPermissions: any) => {
    setUsers(prevUsers => {
      const exists = prevUsers.find(u => u.id === savedUser.id);
      if (exists) {
        return prevUsers.map(u => u.id === savedUser.id ? { ...u, ...savedUser, permissions: newPermissions } : u);
      } else {
        return [{ ...savedUser, permissions: newPermissions }, ...prevUsers];
      }
    });
  };

  if (isLoading) {
    return <SkeletonLoading layout="dashboard" />;
  }

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <EditUserModal isOpen={editModal.isOpen} onClose={() => setEditModal({isOpen: false, user: null})} user={editModal.user} onSave={saveUserPermissions} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.ShieldCheck size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header" style={{ fontSize: '24px' }}>
                      USER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">PERMISSIONS</span> NODE
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      SECURITY CONTROL & ACCESS AUTHORIZATION HUB
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Database size={16} /> Global Registry
                  </button>
                  <button onClick={() => setActiveTab('staff')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Users size={16} /> Staff Access
                  </button>
              </div>
          </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
                <KpiCard label="Active Personnel" value={users.length} icon={Icons.Users} colorAccent={THEME.primaryLight} colorValue={THEME.primary} description="Managed Users" />
                <KpiCard label="Functional Modules" value={SYSTEM_MODULES.length} icon={Icons.LayoutGrid} colorAccent={THEME.accent} colorValue={THEME.primary} description="Tracked Zones" />
                <KpiCard label="Restricted Keys" value={Object.values(confidentialityMap).filter(v=>v).length} icon={Icons.Lock} colorAccent={THEME.danger} colorValue={THEME.primary} description="Security Lock" />
                <KpiCard label="Security Status" value="AUDITED" icon={Icons.ShieldCheck} colorAccent={THEME.success} colorValue={THEME.success} description="System Verified" />
            </div>

            {activeTab === 'registry' ? (
                <GlobalRegistryTab
                   confidentialityMap={confidentialityMap}
                   toggleConfidentiality={toggleConfidentiality}
                   expandedModules={expandedModules}
                   toggleExpand={toggleExpand}
                />
            ) : (
                <StaffAccessTab
                   viewMode={viewMode}
                   setViewMode={setViewMode}
                   search={search}
                   setSearch={setSearch}
                   setEditModal={setEditModal}
                   currentData={currentData}
                   currentPage={currentPage}
                   totalPages={totalPages}
                   setCurrentPage={setCurrentPage}
                />
            )}
        </div>
      </div>
    </div>
  );
}
