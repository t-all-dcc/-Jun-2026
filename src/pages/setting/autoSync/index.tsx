import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import UserGuideButton from '../../../components/shared/UserGuideButton';
import KpiCard from '../../../components/shared/KpiCard';
import { Database, RefreshCw, Clock, Activity } from 'lucide-react';
import { SyncState } from '../../../components/shared/SyncStatusBadge';
import UserGuidePanel from './components/UserGuidePanel';
import SyncModuleCards from './components/SyncModuleCards';
import SyncActivityLog from './components/SyncActivityLog';
import DataConflictsCard from './components/DataConflictsCard';

export default function BackgroundAutoSync() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [syncConfig, setSyncConfig] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('cfg_sync_toggles');
    return saved ? JSON.parse(saved) : {
      'Employees': true,
      'CalendarEvents': true,
      'Leaves': true,
      'SystemConfig': true,
      'ProductionRecords': false,
      'QualityMetrics': false
    };
  });

  const [sheetStatuses, setSheetStatuses] = useState<Record<string, SyncState>>({});
  const [activityLogs, setActivityLogs] = useState<{ id: string; sheet: string; status: 'success' | 'failure'; timestamp: Date }[]>([
    { id: 'mock-1', sheet: 'Employees', status: 'success', timestamp: new Date(Date.now() - 1000 * 60 * 5) }
  ]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date());
  const [pendingItemsCount, setPendingItemsCount] = useState(3);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [syncInterval, setSyncInterval] = useState('1h');
  const [dataConflicts, setDataConflicts] = useState<any[]>([
    { id: 'c1', sheet: 'Employees', recordName: 'EMP-001 (John Doe)', localValue: 'Software Engineer', remoteValue: 'Senior Software Engineer' },
    { id: 'c2', sheet: 'SystemConfig', recordName: 'Default Tax Rate', localValue: '7%', remoteValue: '7.5%' }
  ]);

  const handleResolveConflict = (id: string, action: 'keep_local' | 'overwrite') => {
    setDataConflicts(prev => prev.filter(c => c.id !== id));
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Conflict resolved (${action === 'keep_local' ? 'Kept Local' : 'Overwritten from Remote'})`,
      showConfirmButton: false,
      timer: 2000,
      background: '#f8f9fa'
    });
  };

  const handleRefreshAll = () => {
    setIsRefreshingAll(true);
    let delays = 0;
    
    Object.keys(syncConfig).forEach((sheetName) => {
      setTimeout(() => {
        handleTestConnection(sheetName);
      }, delays);
      delays += 800; // stagger the checks
    });

    setTimeout(() => {
       setIsRefreshingAll(false);
    }, delays + 1500);
  };

  const handleToggleSync = (sheetName: string, value: boolean) => {
    const newConfig = { ...syncConfig, [sheetName]: value };
    setSyncConfig(newConfig);
    localStorage.setItem('cfg_sync_toggles', JSON.stringify(newConfig));
    
    if (!value) {
        setSheetStatuses(prev => ({ ...prev, [sheetName]: 'disconnected' }));
    }

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: value ? 'success' : 'info',
      title: `${value ? 'Enabled' : 'Disabled'} auto-sync for ${sheetName}`,
      showConfirmButton: false,
      timer: 2000,
      background: '#f8f9fa'
    });
  };

  const handleTestConnection = (sheetName: string) => {
    setSheetStatuses(prev => ({ ...prev, [sheetName]: 'testing' }));
    
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% chance of success for demo
      setSheetStatuses(prev => ({ ...prev, [sheetName]: isSuccess ? 'connected' : 'error' }));
      
      setActivityLogs(prev => [{
        id: Math.random().toString(36).substring(2, 9),
        sheet: sheetName,
        status: isSuccess ? 'success' as const : 'failure' as const,
        timestamp: new Date()
      }, ...prev].slice(0, 10)); // keep last 10
      
      if (isSuccess) {
         setLastSyncTime(new Date());
         setPendingItemsCount(prev => Math.max(0, prev - 1));
      }
    }, 1500);
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* USER GUIDE FLOATING TAB */}
      <UserGuideButton onClick={() => setIsGuideOpen(true)} />

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#059669] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 p-1.5 border border-[#059669]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <RefreshCw size={28} strokeWidth={2.5} className="text-[#059669]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
              BACKGROUND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#3f809e]">AUTO-SYNC</span> NODE
            </h3>
            <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
              MANAGE BACKGROUND AUTOMATION AND DATA SYNCHRONIZATION SCHEDULES
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
            <button 
              onClick={handleRefreshAll}
              disabled={isRefreshingAll}
              className="px-6 py-2.5 bg-[#212c46] text-white rounded-lg text-[11px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2 "
            >
              <RefreshCw size={14} className={isRefreshingAll ? "animate-spin" : ""} />
              {isRefreshingAll ? "SYNCING..." : "REFRESH ALL"}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
          <KpiCard 
            label="Configured Modules" 
            value={Object.keys(syncConfig).length} 
            icon="database" 
            colorAccent="#059669" 
            desc="Total Sheets Configured" 
          />
          <KpiCard 
            label="Last Sync Time" 
            value={lastSyncTime ? format(lastSyncTime, 'HH:mm:ss') : '--:--:--'} 
            icon="clock" 
            colorAccent="#b58c4f" 
            desc="System Time UTC+7" 
          />
          <KpiCard 
            label="Pending Items" 
            value={`${pendingItemsCount} queues`} 
            icon="activity" 
            colorAccent="#3f809e" 
            desc="Awaiting Next Cycle" 
          />
        </div>

        <div className="w-full space-y-4">
          <SyncModuleCards 
            syncConfig={syncConfig}
            sheetStatuses={sheetStatuses}
            syncInterval={syncInterval}
            setSyncInterval={setSyncInterval}
            handleToggleSync={handleToggleSync}
            handleTestConnection={handleTestConnection}
          />
          
          <SyncActivityLog activityLogs={activityLogs} />

          <DataConflictsCard 
            dataConflicts={dataConflicts} 
            handleResolveConflict={handleResolveConflict} 
          />
        </div>
      </div>
    </div>
  );
}
