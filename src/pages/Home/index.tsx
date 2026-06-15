import React, { useState } from 'react';
import { 
  Users, 
  AlertCircle, 
  CalendarDays,
  UserCheck, 
  Briefcase, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Import Modular Components ---
import { THEME } from './components/theme';
import { MetricCard } from './components/MetricCard';
import { HeroBanner } from './components/HeroBanner';
import { CorporateAnnouncementsCarousel } from './components/CorporateAnnouncementsCarousel';
import { ExploreBySector } from './components/ExploreBySector';
import { NewFamilyMembers } from './components/NewFamilyMembers';
import { UpcomingExpirations } from './components/UpcomingExpirations';
import { LeaveOverview } from './components/LeaveOverview';
import { LeaveDistribution } from './components/LeaveDistribution';
import { CorporateNews } from './components/CorporateNews';
import { CorporateAlert } from './components/CorporateAlert';

// --- System Modules Data ---
const MOCK_STATS = [
    { label: 'Total Employees', value: '1,450', sub: '+12 Active Joiners (MTD)', icon: Users, color: THEME.c11 },
    { label: 'Pending Leave Requests', value: '24', sub: 'Urgent Action Required', icon: AlertCircle, color: THEME.c2 },
    { label: 'Today\'s Attendance', value: '96.2%', sub: 'Target: 95%', icon: UserCheck, color: THEME.c16 },
    { label: 'Open Job Vacancies', value: '18', sub: 'Active Sourcing', icon: Briefcase, color: THEME.c21 },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHrActionModalOpen, setIsHrActionModalOpen] = useState(false);
  const [hrActionType, setHrActionType] = useState<'employees' | 'leave'>('employees');

  const currentUser = {
      name: user?.name || 'HR Super Admin',
      position: user?.role || 'LEAD EXECUTIVE',
      avatar: user?.avatar || 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
  };

  const handleOpenHrAction = (action: 'employees' | 'leave') => {
      setHrActionType(action);
      setIsHrActionModalOpen(true);
  };

  return (
    <div className="pt-4 flex flex-col gap-5 animate-fadeIn w-full px-4 sm:px-8">
      <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl text-[#212c46] tracking-tight uppercase font-exception-greeting leading-none">
                  Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141] font-medium">{currentUser.name}!</span>
              </h1>
              <p className="text-[#748ea1] text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1.5 leading-none">
                  <TrendingUp size={14} className="text-[#d96245]" /> Attendance Rate: <span className="text-[#3f809e]">High (98.2%)</span>
              </p>
          </div>
          <div className="flex flex-row gap-3">
              <button 
                onClick={() => navigate('/hr/employees/directory')}
                className="bg-white text-[#212c46] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md border border-[#cdd0db]/50 transition-all flex items-center gap-2 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
              >
                  <Users size={16} className="text-[#3f809e]" /> <span className="hidden sm:inline">Employee Directory</span>
              </button>
              <button 
                onClick={() => navigate('/hr/leave/requests')}
                className="bg-gradient-to-r from-[#3f809e] via-[#4d87a8] to-[#748ea1] text-white px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                  <CalendarDays size={16} /> <span className="hidden sm:inline">Leave Requests</span>
              </button>
          </div>
      </div>

      <HeroBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_STATS.map((stat, idx) => (
              <MetricCard key={idx} {...stat} val={stat.value} desc={stat.sub} />
          ))}
      </div>

      <CorporateAnnouncementsCarousel />

      <ExploreBySector />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <NewFamilyMembers />
          <UpcomingExpirations />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LeaveOverview />
          <LeaveDistribution />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <CorporateNews />
          <CorporateAlert />
      </div>
    </div>
  );
}
