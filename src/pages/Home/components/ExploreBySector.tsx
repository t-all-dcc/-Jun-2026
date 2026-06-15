import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Users, 
  FileText, 
  Clock, 
  CalendarDays, 
  ClipboardList, 
  Banknote, 
  UserPlus, 
  Briefcase, 
  ShieldCheck, 
  Target, 
  Network, 
  GraduationCap 
} from 'lucide-react';
import { GlassCard } from './GlassCard';

export const ExploreBySector = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sectors = [
        { label: 'DIRECTORY', th: 'ทำเนียบพนักงาน', icon: Users, path: '/hr/employees/directory' },
        { label: 'JD REPOSITORY', th: 'คลังเอกสารลักษณะงาน', icon: FileText, path: '/hr/jd' },
        { label: 'OVERTIME REQ', th: 'คำร้องขอทำงานล่วงเวลา', icon: Clock, path: '/hr/time/overtime' },
        { label: 'LEAVE REQ', th: 'คำร้องการลาหยุด', icon: CalendarDays, path: '/hr/leave/requests' },
        { label: 'LEAVE BALANCES', th: 'ยอดคงเหลือการลาพนักงาน', icon: ClipboardList, path: '/hr/leave/balances' },
        { label: 'MY PAYSLIPS', th: 'สลิปเงินเดือนของฉัน', icon: Banknote, path: '/hr/payroll/my-payslips' },
        { label: 'MANPOWER REQ', th: 'ขออัตรากำลังพล', icon: UserPlus, path: '/recruitment/request' },
        { label: 'CANDIDATES TRACKING', th: 'ติดตามผู้สมัคร', icon: Briefcase, path: '/recruitment/tracking' },
        { label: 'PROBATION EVA', th: 'ประเมินผลทดลองงาน', icon: ShieldCheck, path: '/recruitment/probation' },
        { label: 'PERFORMANCE', th: 'ประเมินผลสัมฤทธิ์งาน', icon: Target, path: '/performance/evaluation' },
        { label: 'TALENT PLANNING', th: 'แผนพัฒนาทักษะกลุ่มพนักงาน', icon: Network, path: '/performance/talent/skills' },
        { label: 'TRAINING', th: 'อบรมปฐมนิเทศและสัมมนา', icon: GraduationCap, path: '/performance/dev/orientation' },
    ];

    return (
        <GlassCard id="explore-by-sector" className="bg-white border-[#f3f3f1] relative overflow-hidden mt-2 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col mb-6 relative z-10 w-full animate-fadeIn">
                <h2 className="text-base md:text-lg font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
                    <Compass size={20} className="text-[#3f809e]" /> EXPLORE BY SECTOR
                </h2>
                <p className="text-[#7a8b95] text-[10px] md:text-[11px] font-black uppercase tracking-widest mt-1">
                    QUICK SHORTCUT HUBS TO CENTRAL DATABASE SECTORS AND PROCESSES
                </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-6 md:grid-cols-4 gap-4 relative z-10">
                {sectors.map((sector, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => navigate(sector.path)}
                        className="flex flex-col items-center justify-center p-4 aspect-[4/3] rounded-2xl border transition-all duration-300 group bg-white border-[#eaeaec] text-[#212c46] hover:bg-gradient-to-br hover:from-[#1e3347] hover:to-[#899fbc] hover:border-transparent hover:text-white hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                    >
                        <div className="mb-3 transition-all duration-300 text-[#7a8b95] group-hover:text-white group-hover:scale-110">
                            <sector.icon size={28} strokeWidth={1.5} />
                        </div>
                        <span className="font-black text-[12px] text-center leading-tight tracking-wider uppercase mb-1">{sector.label}</span>
                        <span className="text-[10px] text-center font-sans text-[#7a8b95] group-hover:text-white/80">{sector.th}</span>
                    </button>
                ))}
            </div>
        </GlassCard>
    );
};
