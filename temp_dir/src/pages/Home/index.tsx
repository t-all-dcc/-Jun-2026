import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  TrendingDown, 
  Target, 
  Truck, 
  BarChart2, 
  Settings, 
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertCircle,
  Building2,
  Clock,
  PackageCheck,
  PhoneCall,
  Mail,
  Calendar,
  Library,
  DollarSign,
  PieChart as PieChartIcon,
  Award,
  Globe,
  Bell,
  Sparkles,
  Factory,
  CheckCircle2,
  FileText,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Container,
  Database,
  FileSearch,
  Scale,
  Shield,
  CreditCard,
  Zap,
  Handshake,
  Filter,
  Megaphone,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Percent,
  UserPlus,
  PartyPopper,
  Send,
  CheckSquare,
  GraduationCap,
  Info,
  User,
  AlertTriangle,
  Activity,
  Plus,
  BrainCircuit,
  Heart,
  CalendarDays,
  Banknote,
  Network,
  ShieldAlert,
  X,
  Compass,
  Package,
  FolderOpen,
  BookOpen,
  Image as ImageIcon,
  Link,
  UploadCloud
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';
import { INITIAL_HALAL_CERTS } from '../Certificates/Halal';
import { INITIAL_MS_CERTS } from '../Certificates/Ms';

// --- Theme Configuration (Vibrant Palette) ---
const THEME = {
    bgMain: '#f3f3f1',
    bgGradient: 'linear-gradient(135deg, #f3f3f1 0%, #f3f3f1 100%)',
    sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)',
    glassWhite: 'rgba(255, 255, 255, 0.88)',
    primary: '#212c46',
    primaryLight: '#4d87a8',
    accent: '#a94228',
    gold: '#b58c4f',
    brightGold: '#b7a159',
    success: '#657f4d',
    danger: '#932c2e',
    warning: '#a94228',
    skyBlue: '#3f809e',
    dustyBlue: '#7a8b95',
    indigo: '#414757',
    softPurple: '#ab7d82',
    deepPurple: '#2d2c4a',
    pinkAccent: '#a54f6b',
    mutedSlate: '#606a5f',
    darkSlate: '#2f2926',
    silver: '#d7d7d7',
    deepNavy: '#212c46',
    brownGold: '#b58c4f',
    vibrantPurple: '#2d2c4a',
    burntOrange: '#d96245',
    slateBlue: '#748ea1',
    coolGray: '#f3f3f1',
    c1: '#728298',
    c2: '#a3acbe',
    c3: '#8898ac',
    c4: '#e69e5d',
    c5: '#b9684a',
    c6: '#d1a45f',
    c7: '#7d8575',
    c8: '#5a2f33',
    c9: '#b97c7b',
    c10: '#e9c7c1',
    c11: '#99b4aa',
    c12: '#cf7d65',
    c13: '#2e3f28',
    c14: '#c7c6bf',
    c15: '#b3afa4',
    c16: '#d9dddd',
    c17: '#b9a781',
    c18: '#b48b2f',
    c19: '#dc794f',
    c20: '#c13214',
    c21: '#8c1100',
    c22: '#515055',
    c23: '#93a052',
    c24: '#806172',
    c25: '#372c41',
    c26: '#983d34',
    c27: '#9a4b5a',
    c28: '#651e29',
    c29: '#596a8c',
    c30: '#819a90',
    c31: '#b9cce4',
    c32: '#e6f0ff',
    c33: '#894959',
    c34: '#bd7e87',
    c35: '#586b60',
    c36: '#8f7a94',
    c37: '#f9efe9',
    c38: '#e0ce8d',
    c39: '#a8988b',
};

// --- System Modules Data ---

const MOCK_STATS = [
    { label: 'Total Certificates', value: '1,450', sub: '+12 Added (YTD)', icon: FileSearch, color: THEME.c11 },
    { label: 'Pending Renewals', value: '24', sub: 'Urgent: 5 certs', icon: AlertCircle, color: THEME.c2 },
    { label: 'Compliance Rate', value: '96.2%', sub: 'Target: 95%', icon: ShieldCheck, color: THEME.c16 },
    { label: 'Expired Status', value: '18', sub: 'Requires action', icon: AlertTriangle, color: THEME.c21 },
];

const GlassCard = ({ children, className = '', hoverEffect = true, style = {} }: any) => (
    <div className={`rounded-2xl p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(31,42,68,0.06)] border border-white/60 ${hoverEffect ? 'hover:-translate-y-1 transition-transform duration-300' : ''} ${className}`}
        style={{ backgroundColor: THEME.glassWhite, ...style }}>
        {children}
    </div>
);

const HeroBanner = () => {
    const bgImage = "https://png.pngtree.com/background/20250125/original/pngtree-stack-of-books-in-a-library-with-sunlight-streaming-through-the-picture-image_15776652.jpg";
    return (
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl group bg-[#212c46] border border-[#414757] font-exception-hero">
        <div className="absolute inset-0 transform transition-transform duration-[2000ms] group-hover:scale-105">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center 35%' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#212c46]/95 via-[#212c46]/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between p-4 md:p-6 w-full gap-6">
          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Library size={12} className="text-[#b7a159]" />
              <span className="text-[9px] text-[#b7a159] font-black uppercase tracking-[0.2em] drop-shadow-sm">Library Management</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-md">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#f3e5ab]">Compliance Control</span>
            </h2>
            <div className="mb-6">
              <p className="text-white/90 text-xs font-medium leading-relaxed max-w-2xl">
                "Centralize and manage external certificates systematically to align with global standards and regulatory audits seamlessly." <br/><span className="text-[#b7a159] font-bold">SMART CERTIFICATION LIBRARY</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="bg-[#b58c4f] hover:bg-[#8e9141] border border-[#b7a159]/30 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(181,140,79,0.5)]">
                <FileText size={12} /> Certificate Registry
              </button>
              <div className="bg-white/5 border border-white/10 px-4 py-2 text-center rounded-xl flex items-center gap-2 shadow-inner backdrop-blur-md">
                <ShieldCheck size={14} className="text-[#657f4d]" />
                <span className="text-white font-black tracking-tighter text-sm">ISO Certified</span>
                <span className="text-[8px] text-white/50 font-bold uppercase tracking-widest leading-none mt-0.5">Verified</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <a 
              href="/copilot"
              className="bg-gradient-to-br from-[#1d2636] to-[#2d2c4a] border border-[#b7a159]/40 p-1 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(181,140,79,0.3)] hover:-translate-y-1 transition-all group/ai"
            >
              <div className="bg-[#1d2636] border border-white/10 rounded-xl px-8 py-5 flex flex-col items-center gap-2">
                <div className="relative">
                   <div className="absolute inset-0 bg-[#b7a159]/20 blur-xl rounded-full scale-150 animate-pulse" />
                   <BrainCircuit size={40} className="text-[#b7a159] relative z-10 group-hover/ai:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[#b7a159] text-[13px] font-black uppercase tracking-[0.2em] mt-1">AI COPILOT</span>
                <span className="text-[8px] text-white/40 font-bold tracking-[0.4em]">SMART ASSISTANT</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
};

const CorporateAnnouncementsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const announcements = [
        { id: 1, type: "COMPLIANCE UPDATE", issue: "Q1 Standards Review", subject: "Review the key takeaways and standards required for the upcoming audit.", date: "12 May 2026", isNew: true, image: "https://images.unsplash.com/photo-1542382156909-923bea7b0a72?q=80&w=500" },
        { id: 2, type: "CERTIFICATION NEWS", issue: "New GDPR Guidelines", subject: "Review the updated guidelines for data handling privacy compliance.", date: "14 May 2026", isNew: true, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=500" },
        { id: 3, type: "EVENT", issue: "Annual Compliance Training", subject: "Join us for our annual compliance training. Details and registration inside.", date: "20 May 2026", isNew: false, image: "https://images.unsplash.com/photo-1511632765486-a01c80cf59af?q=80&w=500" },
        { id: 4, type: "TRAINING", issue: "ISO 27001 Workshop", subject: "Mandatory training for all mid-level IT managers next month.", date: "02 Jun 2026", isNew: false, image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=500" },
        { id: 5, type: "WELLNESS", issue: "Ergonomics Checks", subject: "Annual free workplace ergonomics checks for all employees.", date: "15 Jun 2026", isNew: false, image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=500" },
        { id: 6, type: "IT UPDATE", issue: "New CERT System Portal", subject: "We are migrating to a new certificate tracking system. Read more.", date: "01 Jul 2026", isNew: false, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=500" },
    ];

    const nextSlide = () => setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));

    // Show up to 4 items on large screens
    const visibleAnnouncements = [];
    for (let i = 0; i < 4; i++) {
        visibleAnnouncements.push(announcements[(currentIndex + i) % announcements.length]);
    }

    return (
        <div className="w-full bg-[#f6f5f3] py-5 rounded-2xl relative overflow-hidden shadow-inner border border-[#e5e5e5]">
            <div className="flex items-center absolute top-1/2 -translate-y-1/2 left-2 z-20">
                <button onClick={prevSlide} className="bg-gray-600/80 hover:bg-gray-800 text-white p-2 rounded shadow-lg backdrop-blur transition-colors">
                    <ChevronLeft size={24} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 px-14">
                {visibleAnnouncements.map((ann, idx) => (
                    <div key={`${ann.id}-${idx}`} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col relative h-[145px] border border-gray-100 group transition-all hover:shadow-md justify-between">
                        {ann.isNew && (
                            <div className="absolute -left-10 top-5 bg-[#a73527] text-white font-black px-11 py-1 -rotate-45 z-20 shadow-md text-[11px] tracking-wider">
                                NEW
                            </div>
                        )}
                        
                        <div className="p-2 pt-3 text-center z-10 relative">
                            <h3 className="font-extrabold text-[#3a4454] leading-tight text-[12px] drop-shadow-sm">{ann.type}</h3>
                            <h4 className="font-bold text-[#56657a] text-[10px] mt-0.5">{ann.issue}</h4>
                            <h2 className="font-black text-[#1e4e6d] text-[13px] mt-2 drop-shadow-sm leading-tight line-clamp-2">{ann.subject}</h2>
                        </div>
                        
                        <div className="bg-[#364b5e] text-white py-1.5 px-2 mx-2 mb-2 rounded-lg text-center flex items-center justify-center gap-1 z-10 shadow-sm relative shrink-0">
                            <span className="text-[9px] font-medium tracking-wide">Date</span>
                            <span className="flex items-center gap-0.5 mx-1 text-white/50"><span className="w-0.5 h-0.5 bg-white/50 rounded-full"></span><span className="w-1 h-1 bg-white/80 rounded-full"></span></span>
                            <span className="text-[10px] font-black tracking-wide">{ann.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center absolute top-1/2 -translate-y-1/2 right-2 z-20">
                <button onClick={nextSlide} className="bg-gray-600/80 hover:bg-gray-800 text-white p-2 rounded shadow-lg backdrop-blur transition-colors">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
                {announcements.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-[#1e4e6d] ring-2 ring-[#1e4e6d]/30 ring-offset-2' : 'bg-gray-400 hover:bg-gray-500'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const ExploreBySector = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sectors = [
        { label: 'CERT HOME', th: 'หน้าหลัก', icon: LayoutDashboard, path: '/' },
        { label: 'AI COPILOT', th: 'ผู้ช่วย AI', icon: BrainCircuit, path: '/copilot' },
        { label: 'CALENDAR', th: 'ปฏิทิน', icon: Calendar, path: '/calendar' },
        { label: 'SUPPLIER CERTS', th: 'ฮาลาลวัตถุดิบ', icon: FolderOpen, path: '/certificates/supplier-halal' },
        { label: 'COMPANY CERTS', th: 'ฮาลาลองค์กร', icon: BookOpen, path: '/certificates/company-halal' },
        { label: 'UPCOMING EXP', th: 'ใกล้หมดอายุ', icon: Clock, path: '/compliance/expirations' },
        { label: 'RENEWAL MGT', th: 'ติดตามต่ออายุ', icon: CheckSquare, path: '/compliance/tracking' },
        { label: 'AUDIT PREP', th: 'เตรียมตรวจประเมิน', icon: ClipboardList, path: '/compliance/audit' },
        { label: 'COMPLIANCE', th: 'แดชบอร์ดสรุป', icon: PieChartIcon, path: '/reports/compliance' },
        { label: 'CERT MATRIX', th: 'สถานะใบรับรอง', icon: Network, path: '/reports/matrix' },
        { label: 'PERMISSIONS', th: 'สิทธิ์ใช้งาน', icon: Shield, path: '/permissions' },
        { label: 'SETTINGS', th: 'ตั้งค่าระบบ', icon: Settings, path: '/settings' },
    ];

    return (
        <GlassCard className="bg-white border-[#f3f3f1] relative overflow-hidden mt-2 p-6 md:p-8 shadow-sm">
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
                        className="flex flex-col items-center justify-center p-4 aspect-[4/3] rounded-2xl border transition-all duration-300 group bg-white border-[#eaeaec] text-[#212c46] hover:bg-gradient-to-br hover:from-[#4b3264] hover:to-[#7685b9] hover:border-transparent hover:text-white hover:shadow-lg hover:-translate-y-1"
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

const MetricCard = ({ label, val, unit, icon: Icon, color, desc }: any) => (
  <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-[#f3f3f1] relative overflow-hidden group h-full transition-all hover:shadow-md">
    <div className="absolute -right-6 -bottom-6 opacity-[0.1] transform rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none z-0">
        <Icon size={100} style={{color: color}} />
    </div>
    <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider opacity-90 truncate">{label}</p>
            <h4 className="text-2xl font-black tracking-tight mt-0.5" style={{color: THEME.primary}}>{val}</h4>
            {desc && (
                <p className="text-[10px] text-[#7a8b95] font-bold mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: color}}></span>
                    {desc}
                </p>
            )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white backdrop-blur-md shadow-sm" 
            style={{backgroundColor: color + '15'}}>
            <Icon size={18} style={{color: color}} />
        </div>
    </div>
  </div>
);

const SalesChartArea = () => {
  const data = [
    { name: "Quality Manuals", target: 60, actual: 64, color: THEME.c2 },
    { name: "Procedures", target: 25, actual: 20, color: THEME.c11 },
    { name: "Work Instructions", target: 15, actual: 16, color: THEME.c16 },
  ];
  return (
    <GlassCard className="lg:col-span-2 bg-gradient-to-br from-white to-[#f3f3f1] border-[#f3f3f1]">
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h2 className="text-base font-black text-[#212c46] flex items-center gap-2 uppercase tracking-tight">
            <BarChart2 size={16} className="text-[#932c2e]" /> Document Distribution
        </h2>
        <span className="text-[8px] text-white font-black bg-[#3f809e] px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Real-time</span>
      </div>
      <div className="space-y-4 relative z-10">
        {data.map((item, i) => (
            <div key={i} className="flex items-center gap-4 group/bar">
              <div className="w-28 text-[9px] font-black text-[#435665] uppercase truncate tracking-tight">{item.name}</div>
              <div className="flex-1 h-4 rounded-lg relative flex items-center bg-[#f3f3f1]/40 shadow-inner overflow-hidden">
                <div className="h-full transition-all duration-1000 relative z-10 rounded-lg"
                  style={{ width: `${item.actual}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)` }} />
              </div>
              <div className="w-10 text-right">
                <span className="text-[10px] font-black text-[#212c46]">{item.actual}%</span>
              </div>
            </div>
        ))}
      </div>
    </GlassCard>
  );
};

const UrgentTasks = () => (
  <GlassCard className="bg-gradient-to-b from-white to-[#f3f3f1]/20 border-[#7a8b95]/30">
    <div className="flex justify-between items-center mb-4 relative z-10">
      <h2 className="text-base font-black text-[#212c46] flex items-center gap-2 uppercase tracking-tight">
          <AlertCircle size={16} className="text-[#932c2e]" /> Critical Action
      </h2>
      <span className="text-[8px] font-black bg-[#932c2e]/10 text-[#932c2e] px-3 py-1 rounded-full uppercase tracking-widest">3 Tasks</span>
    </div>
    <div className="space-y-2.5 relative z-10">
        {[
          { title: "Approve Quality Manual - ISO9001", type: "Document Approval", icon: ShoppingCart, urgent: true, color: 'text-[#932c2e]', bg: 'bg-[#932c2e]/10' },
          { title: "Review Audit Report - Q1", type: "Audit Review", icon: Target, urgent: true, color: 'text-[#d96245]', bg: 'bg-[#d96245]/10' },
          { title: "Review Q3 Management Cycle", type: "Management Review", icon: Megaphone, urgent: false, color: 'text-[#3f809e]', bg: 'bg-[#3f809e]/10' },
        ].map((task, i) => (
          <div key={i} className="p-3 bg-white/70 rounded-xl border border-[#f3f3f1]/30 flex gap-3 items-start hover:bg-white transition-all shadow-sm">
            <div className={`p-2 rounded-lg ${task.bg} ${task.color} shrink-0`}>
                <task.icon size={12}/>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-[#1f2a44] tracking-tight truncate">{task.title}</p>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[8px] text-[#7a8b95] font-bold uppercase">{task.type}</p>
                    {task.urgent && <span className="text-[7px] font-black text-[#a94228] uppercase animate-pulse">Critical</span>}
                </div>
            </div>
          </div>
        ))}
    </div>
    <button className="w-full mt-4 py-3 bg-[#1f2a44] text-white text-[9px] font-bold uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-widest hover:bg-[#254268]">
        <Calendar size={12} /> Schedule
    </button>
  </GlassCard>
);

const NewFamilyMembers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    const members = [
      { name: 'ISO 27001:2022', role: 'SECURITY', dept: 'Digital Tech', joinDate: '01 Jan 2026', img: 'https://images.unsplash.com/photo-1579541591972-358b5e68b3aa?w=150&h=150&fit=crop' },
      { name: 'ISO 9001:2015', role: 'QUALITY', dept: 'Operations', joinDate: '02 Feb 2026', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop' },
      { name: 'GDPR Compliance', role: 'PRIVACY', dept: 'Legal', joinDate: '05 Mar 2026', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&h=150&fit=crop' },
    ];

    const openWelcome = (m: any) => {
      setSelectedMember(m);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 relative overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] opacity-[0.03] pointer-events-none transform rotate-12 z-0">
          <Library size={240} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
           <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
             <Library size={16} className="text-[#3f809e]" /> NEW CERTIFICATES ADDED
           </h2>
           <span className="text-[9px] font-black text-[#3f809e] bg-[#3f809e]/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#3f809e]/20 hover:bg-[#3f809e] hover:text-white transition-colors cursor-pointer">VIEW ALL REGISTRY</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {members.map((m, i) => (
            <div key={i} onClick={() => openWelcome(m)} className="bg-white rounded-2xl border border-[#f3f3f1]/30 hover:border-[#3f809e]/60 p-5 flex flex-col items-center relative shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className="relative mb-4">
                <img src={m.img} alt={m.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                <div className="absolute -bottom-2 -right-2 bg-[#4d87a8] p-1.5 rounded-lg text-white shadow-sm border-2 border-white group-hover:scale-110 transition-transform">
                  <ShieldCheck size={12} />
                </div>
              </div>
              <h3 className="text-[#212c46] font-bold text-sm mb-1">{m.name}</h3>
              <p className="text-[#4d87a8] text-[9px] font-black uppercase tracking-widest">{m.role}</p>
              <p className="text-[#7a8b95] text-[10px] font-medium mt-0.5">{m.dept}</p>
              <div className="w-full h-px bg-[#f3f3f1] my-4" />
              <div className="w-full flex justify-between items-center text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">
                <span>VALID FROM</span>
                <span className="text-[#212c46]">{m.joinDate}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><Sparkles size={16} className="text-[#b58c4f]"/> Certificate Details</span>}
        width="max-w-md"
      >
        <div className="p-6">
          {selectedMember && (
             <div className="text-center mb-6">
               <img src={selectedMember.img} alt={selectedMember.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-[#3f809e]/20 shadow-md mx-auto mb-4" />
               <h3 className="text-xl font-black text-[#212c46] mb-1">{selectedMember.name}</h3>
               <p className="text-[#4d87a8] text-xs font-black uppercase tracking-widest mb-1">{selectedMember.role}</p>
               <p className="text-[#7a8b95] text-xs font-medium">{selectedMember.dept} • {selectedMember.joinDate}</p>
             </div>
          )}
          
          <div className="mb-6 shrink-0">
            <label className="block text-[10px] font-black text-[#212c46] uppercase tracking-widest mb-2 text-center">Add Review Note</label>
            <div className="relative">
              <textarea 
                className="w-full h-24 p-3 pr-12 border border-[#cdd0db] rounded-xl text-sm focus:border-[#4d87a8] focus:ring-1 focus:ring-[#4d87a8] outline-none transition-all resize-none bg-[#f3f3f1]/50 font-medium shadow-inner"
                placeholder="Type your notes about this certificate..."
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#4d87a8] hover:bg-[#3f809e] text-white rounded-lg flex items-center justify-center transition-colors shadow-md">
                <FileText size={14} />
              </button>
            </div>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};

const UpcomingExpirations = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<any>(null);

    const expirations = [
      { name: 'ISO 45001', dept: 'Safety', date: '10 Jan', img: 'https://images.unsplash.com/photo-1541888083818-2041262d64a2?w=150&h=150&fit=crop' },
      { name: 'FSSC 22000', dept: 'Quality', date: '12 Jan', img: 'https://images.unsplash.com/photo-1628169117622-63b719ba1dc4?w=150&h=150&fit=crop' },
    ];

    const openGreeting = (person?: any) => {
      setSelectedPerson(person || expirations[0]);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#eaeaec] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] pointer-events-none transform -rotate-12 z-0">
          <AlertTriangle size={200} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <AlertTriangle size={20} className="text-[#d96245]" />
          <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
            UPCOMING<br/>EXPIRATIONS
          </h2>
        </div>
        <div className="space-y-3 flex-1 relative z-10">
          {expirations.map((b, i) => (
            <div key={i} onClick={() => openGreeting(b)} className="flex items-center gap-4 bg-white border border-[#f3f3f1]/30 hover:border-[#d96245]/60 rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <img src={b.img} alt={b.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shadow-black/10 group-hover:scale-105 transition-transform" />
              <div className="flex-1 min-w-0">
                <h3 className="text-[#212c46] font-bold text-xs truncate">{b.name}</h3>
                <p className="text-[#7a8b95] text-[10px] font-medium truncate">{b.dept}</p>
              </div>
              <div className="text-[10px] font-black text-[#d96245] tracking-widest shrink-0">
                {b.date}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => openGreeting()} className="mt-4 w-full bg-[#b7a159] hover:bg-[#a94228] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex justify-center items-center gap-2 shadow-md relative z-10">
          <Send size={14} /> SEND RENEWAL REMINDER
        </button>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><AlertTriangle size={16} className="text-[#d96245]"/> Certificate Expiration</span>}
        width="max-w-md"
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col bg-[#fdfbf7] relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#f9ecd3] to-transparent z-0 opacity-50"></div>
          {selectedPerson && (
             <div className="flex flex-col items-center gap-3 mb-6 relative z-10 pt-4">
               <img src={selectedPerson.img} alt={selectedPerson.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
               <div className="text-center">
                  <p className="text-[10px] text-[#b7a159] font-bold uppercase tracking-[0.2em] mb-1">Needs Renewal</p>
                  <h3 className="text-xl font-sans font-black text-[#212c46]">{selectedPerson.name}</h3>
                  <p className="text-[11px] font-medium text-[#7a8b95] mt-1">{selectedPerson.dept} • Expires: {selectedPerson.date}</p>
               </div>
             </div>
          )}
          
          <div className="mb-6 shrink-0 relative z-10">
            <label className="block text-[10px] font-black text-[#b7a159] uppercase tracking-widest mb-2 text-center">Post a Reminder</label>
            <div className="relative shadow-sm rounded-xl overflow-hidden border border-[#e8dcc4]">
              <textarea 
                className="w-full h-24 p-3 pr-12 text-sm focus:outline-none resize-none bg-white font-medium placeholder:text-[#d3ccc0] font-sans"
                placeholder="Alert the responsible department..."
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#d96245] hover:bg-[#b7a159] text-white rounded-lg flex items-center justify-center transition-colors shadow-md">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};

const CorporateNews = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAllNewsModalOpen, setIsAllNewsModalOpen] = useState(false);
    
    const initialNews = [
      { category: 'COMPLIANCE UPDATE', title: 'ประกาศผลการประเมิน ISO 9001:2015 ล่าสุด', date: '08 May 2026', preview: 'ผลการตรวจติดตามมาตรฐานคุณภาพในไตรมาสแรก ผ่านเกณฑ์ ขอบคุณทุกฝ่ายที่ช่วย...', fullText: 'ผลการตรวจติดตามมาตรฐานคุณภาพในไตรมาสแรก ผ่านเกณฑ์ ขอบคุณทุกฝ่ายที่ให้ความร่วมมือในการทำงานอย่างเต็มที่ ระบบมีประสิทธิภาพและเป็นไปตามข้อกำหนด', author: 'QM OFFICE', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800' },
      { category: 'CERT ANNOUNCEMENT', title: 'อัปเดตเกณฑ์มาตรฐาน FSSC 22000 ใหม่', date: '05 May 2026', preview: 'เกณฑ์ความปลอดภัยอาหารฉบับใหม่ เริ่มบังคับใช้ปลายปีนี้ โปรดศึกษารายละเอียด...', fullText: 'เกณฑ์ความปลอดภัยอาหารฉบับใหม่ เริ่มบังคับใช้ปลายปีนี้ โปรดศึกษารายละเอียดและเตรียมความพร้อมสำหรับการเปลี่ยนแปลงที่จะเกิดขึ้น', author: 'QA TEAM', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800' },
      { category: 'TRAINING', title: 'เชิญร่วมอบรม Document Control', date: '01 May 2026', preview: 'เรียนรู้ระบบจัดการเอกสารใหม่ พร้อมขั้นตอนการตั้งค่า Version Control...', fullText: 'เรียนรู้ระบบจัดการเอกสารใหม่ พร้อมขั้นตอนการตั้งค่า Version Control สำหรับพนักงานทุกคนที่เกี่ยวข้องในการจัดการเอกสาร', author: 'COMPLIANCE TEAM', image: 'https://images.unsplash.com/photo-1511632765486-a01c80cf59af?q=80&w=800' },
    ];
    
    const [newsList, setNewsList] = useState(initialNews);
    
    const [newUpdate, setNewUpdate] = useState({ category: '', title: '', preview: '', fullText: '', author: 'CURRENT USER', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800' });
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');

    const openNews = (n: any) => {
      setSelectedNews(n);
      setIsModalOpen(true);
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setNewUpdate(prev => ({ ...prev, image: url }));
        }
    };
    
    const handleAddUpdate = () => {
        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        setNewsList([{
            ...newUpdate,
            date: dateStr,
        }, ...newsList]);
        
        setIsAddModalOpen(false);
        setNewUpdate({ category: '', title: '', preview: '', fullText: '', author: 'CURRENT USER', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800' });
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 flex flex-col relative overflow-hidden">
        <div className="absolute left-[35%] top-[-30%] opacity-[0.02] pointer-events-none transform rotate-12 z-0">
          <Globe size={380} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
            <Globe size={16} className="text-[#3f809e]" /> CERTIFICATION NEWS BOARD
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setIsAddModalOpen(true)} className="text-[10px] font-black text-white bg-gradient-to-r from-[#d96245] to-[#b7a159] hover:from-[#c25035] hover:to-[#a38e4a] px-4 py-2 rounded-lg uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 outline-none hover:scale-105 active:scale-95 border border-[#d96245]/20">
              <Plus size={14} /> ADD UPDATE
            </button>
            <button onClick={() => setIsAllNewsModalOpen(true)} className="text-[10px] font-black text-[#212c46] bg-white px-4 py-2 rounded-lg uppercase tracking-widest border border-[#f3f3f1] hover:bg-[#f3f3f1] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3f809e]">ALL</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {newsList.slice(0, 3).map((n, i) => (
            <div key={i} onClick={() => openNews(n)} className="flex flex-col bg-white border border-[#f3f3f1] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className="relative h-36 w-full overflow-hidden">
                <img src={n.image} alt={n.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                   <span className="text-[9px] font-black text-white uppercase tracking-widest bg-[#3f809e] px-2.5 py-1 rounded-md shadow-sm">{n.category}</span>
                   <span className="text-white/90 text-[10px] font-bold tracking-wider drop-shadow-md">{n.date}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[#212c46] font-bold text-sm mb-2 line-clamp-2 leading-snug group-hover:text-[#3f809e] transition-colors">{n.title}</h3>
                <p className="text-[#7a8b95] text-[11px] font-medium line-clamp-2 leading-relaxed flex-1">{n.preview}</p>
                <div className="mt-4 pt-3 border-t border-[#f3f3f1] flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#a0abb2] uppercase tracking-widest flex items-center gap-1.5"><User size={10}/> {n.author}</span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#d96245] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
                    READ <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2"><Globe size={16} className="text-[#3f809e]"/> Certification News</span>}
        width="max-w-2xl"
      >
        <div className="p-0 overflow-hidden flex flex-col max-h-[85vh]">
          {selectedNews && (
             <>
                <div className="relative h-48 w-full shrink-0">
                   <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-[#3f809e] px-3 py-1 rounded-md shadow-sm">{selectedNews.category}</span>
                        <span className="text-white/80 text-xs font-bold">{selectedNews.date}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">{selectedNews.title}</h2>
                   </div>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="whitespace-pre-wrap text-[#4a5568] text-sm leading-relaxed mb-8">
                    {selectedNews.fullText}
                  </div>
                  <div className="bg-[#f3f3f1] rounded-xl p-4 border border-[#f3f3f1] flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#f3f3f1] rounded-full flex items-center justify-center border border-[#f3f3f1] shrink-0">
                        <User size={18} className="text-[#7a8b95]" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Published By</p>
                       <p className="text-sm font-bold text-[#212c46]">{selectedNews.author}</p>
                     </div>
                  </div>
                </div>
             </>
          )}
        </div>
      </DraggableModal>

      <DraggableModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Post New Update"
      >
        <div className="p-6 space-y-4">
            <div>
                <label className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase mb-1 block">Category</label>
                <input 
                    type="text" 
                    value={newUpdate.category} 
                    onChange={e => setNewUpdate({...newUpdate, category: e.target.value})} 
                    className="w-full p-2 border border-[#eaeaec] rounded-lg text-sm bg-white" 
                    placeholder="e.g. COMPLIANCE UPDATE"
                />
            </div>
            <div>
                <label className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase mb-1 block">Title</label>
                <input 
                    type="text" 
                    value={newUpdate.title} 
                    onChange={e => setNewUpdate({...newUpdate, title: e.target.value})} 
                    className="w-full p-2 border border-[#eaeaec] rounded-lg text-sm bg-white" 
                    placeholder="Headline"
                />
            </div>
            <div>
                <label className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase mb-1 block">Short Preview</label>
                <input 
                    type="text" 
                    value={newUpdate.preview} 
                    onChange={e => setNewUpdate({...newUpdate, preview: e.target.value})} 
                    className="w-full p-2 border border-[#eaeaec] rounded-lg text-sm bg-white" 
                    placeholder="Short description for the card"
                />
            </div>
            <div>
                <label className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase mb-1 block">Full Details</label>
                <textarea 
                    value={newUpdate.fullText} 
                    onChange={e => setNewUpdate({...newUpdate, fullText: e.target.value})} 
                    className="w-full p-2 border border-[#eaeaec] rounded-lg text-sm bg-white h-24" 
                    placeholder="Detailed content of the announcement..."
                />
            </div>
            <div>
                <label className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase mb-2 block flex items-center gap-1.5"><ImageIcon size={14} className="text-[#3f809e]"/> Cover Image</label>
                <div className="flex bg-[#f8f9fa] border border-[#eaeaec] p-1 rounded-lg mb-3">
                    <button 
                        onClick={() => setImageMode('url')} 
                        className={`flex-1 text-xs font-bold py-1.5 rounded-md flex justify-center items-center gap-1.5 ${imageMode === 'url' ? 'bg-white shadow-sm text-[#212c46]' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                    >
                        <Link size={12}/> Link URL
                    </button>
                    <button 
                        onClick={() => setImageMode('upload')} 
                        className={`flex-1 text-xs font-bold py-1.5 rounded-md flex justify-center items-center gap-1.5 ${imageMode === 'upload' ? 'bg-white shadow-sm text-[#212c46]' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                    >
                        <UploadCloud size={12}/> Upload File
                    </button>
                </div>
                
                {imageMode === 'url' ? (
                    <input 
                        type="text" 
                        value={newUpdate.image} 
                        onChange={e => setNewUpdate({...newUpdate, image: e.target.value})} 
                        className="w-full p-2 border border-[#eaeaec] rounded-lg text-sm bg-white" 
                        placeholder="https://example.com/image.jpg"
                    />
                ) : (
                    <div className="border border-dashed border-[#a3acbe] rounded-lg p-4 flex flex-col items-center justify-center bg-[#f8f9fa]">
                        <UploadCloud size={24} className="text-[#a3acbe] mb-2"/>
                        <p className="text-xs font-bold text-[#7a8b95] mb-2">Click below to browse files (Computer or Drive)</p>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="text-xs text-[#212c46] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#212c46] file:text-white hover:file:bg-[#1c273e]"
                        />
                    </div>
                )}
                
                {newUpdate.image && (
                    <div className="mt-3 relative h-24 w-full rounded-lg border border-[#eaeaec] overflow-hidden">
                        <img src={newUpdate.image} alt="Cover Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded font-bold">Preview</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#f3f3f1]">
                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-[#eaeaec] bg-white rounded-lg text-xs font-bold text-[#212c46]">Cancel</button>
                <button onClick={handleAddUpdate} className="px-4 py-2 bg-[#212c46] text-white rounded-lg text-xs font-bold">Post Update</button>
            </div>
        </div>
      </DraggableModal>

      <DraggableModal 
        isOpen={isAllNewsModalOpen} 
        onClose={() => setIsAllNewsModalOpen(false)}
        title="All News & Announcements"
        width="max-w-3xl"
      >
        <div className="p-6">
            <div className="grid grid-cols-1 gap-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                {newsList.map((n, i) => (
                    <div key={i} onClick={() => { setIsAllNewsModalOpen(false); openNews(n); }} className="flex items-start gap-4 p-4 border border-[#eaeaec] bg-white hover:border-[#a3acbe] hover:shadow-md cursor-pointer transition-all rounded-xl group group-hover:-translate-y-1">
                        <img src={n.image} alt={n.title} className="w-20 h-20 rounded-lg object-cover" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-black text-[#d96245] uppercase tracking-widest">{n.category}</span>
                                <span className="text-[10px] font-medium text-[#7a8b95]">{n.date}</span>
                            </div>
                            <h3 className="text-sm font-bold text-[#212c46] mb-1 group-hover:text-[#3f809e] transition-colors">{n.title}</h3>
                            <p className="text-xs text-[#7a8b95] line-clamp-2">{n.preview}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </DraggableModal>
      </>
    );
};

const CorporateAlert = () => {
    const alerts = [
      { title: 'ISO 9001 เอกสารค้างอนุมัติ', desc: '5 Process Flow documents are waiting for your approval.', icon: ClipboardList, color: '#932c2e', bg: '#932c2e26' },
      { title: 'หมดอายุ ISO 14001', desc: 'Environmental cert will expire in 30 days. Renewal process needed.', icon: AlertTriangle, color: '#3f809e', bg: '#3f809e26' },
    ];

    return (
      <GlassCard className="bg-white border-[#f3f3f1] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.02] pointer-events-none transform -rotate-12 z-0">
          <ShieldAlert size={220} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <AlertCircle size={20} className="text-[#932c2e]" />
          <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
            COMPLIANCE<br/>ALERTS
          </h2>
        </div>
        <div className="space-y-4 flex-1 relative z-10">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 border border-transparent rounded-xl p-4 transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: alert.bg }}>
              <alert.icon size={16} className={`shrink-0 mt-0.5`} style={{ color: alert.color }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[13px] mb-1 leading-tight" style={{ color: alert.color }}>{alert.title}</h3>
                <p className="text-[10px] font-medium leading-relaxed font-sans" style={{ color: alert.color, opacity: 0.85 }}>{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    );
};

const CertificateOverview = () => {
    const { t } = useLanguage();
    const { referenceDate, halalCerts, msCerts } = useNotifications();
    
    // Calculate stats across both certificate types
    const today = new Date(referenceDate);
    const currentHalal = halalCerts.length > 0 ? halalCerts : INITIAL_HALAL_CERTS;
    const currentMs = msCerts.length > 0 ? msCerts : INITIAL_MS_CERTS;
    const allCerts = [...currentHalal, ...currentMs];
    
    let active = 0;
    let expiring = 0;
    let expired = 0;
    
    allCerts.forEach(cert => {
        if (!cert.expiryDate) {
            active++;
            return;
        }
        const exp = new Date(cert.expiryDate);
        const diffTime = exp.getTime() - today.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (days <= 0) {
            expired++;
        } else if (days <= 30) {
            expiring++;
        } else {
            active++;
        }
    });

    const data = [
        { name: t('Active', 'ปกติ'), value: active, color: '#657f4d' },
        { name: t('Expiring Soon', 'ใกล้หมดอายุ'), value: expiring, color: '#b58c4f' },
        { name: t('Expired', 'หมดอายุ'), value: expired, color: '#932c2e' }
    ].filter(d => d.value > 0);

    return (
        <GlassCard className="bg-white border-[#f3f3f1] relative overflow-hidden flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-6 relative z-10 w-full pl-6 pt-6 pr-6">
               <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
                 <PieChartIcon size={16} className="text-[#3f809e]" /> {t('CERTIFICATE OVERVIEW', 'ภาพรวมใบรับรอง')}
               </h2>
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center p-4">
               {allCerts.length === 0 ? (
                 <div className="flex items-center justify-center h-full w-full opacity-50">
                    <span className="text-sm font-bold text-[#7a8b95] uppercase tracking-widest">{t('No Certificate Data', 'ไม่มีข้อมูลใบรับรอง')}</span>
                 </div>
               ) : (
                 <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                           <Pie
                               data={data}
                               innerRadius={60}
                               outerRadius={90}
                               paddingAngle={5}
                               dataKey="value"
                           >
                               {data.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                           </Pie>
                           <RechartsTooltip 
                               contentStyle={{ borderRadius: '12px', border: '1px solid #eaeaec', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                               itemStyle={{ fontWeight: 800, fontSize: '12px' }} 
                           />
                           <Legend 
                               verticalAlign="bottom" 
                               height={36} 
                               wrapperStyle={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                           />
                       </PieChart>
                   </ResponsiveContainer>
                 </div>
               )}
            </div>
        </GlassCard>
    );
};

const CertificateDistribution = () => {
    const { t } = useLanguage();
    
    const data = [
        { name: 'Supplier Halal', value: 340, color: '#657f4d' },
        { name: 'Company Halal', value: 45, color: '#b58c4f' },
        { name: 'ISO Standards', value: 12, color: '#3f809e' },
        { name: 'FSSC/GMP', value: 5, color: '#932c2e' },
    ];

    return (
        <GlassCard className="bg-white border-[#f3f3f1] lg:col-span-2 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-6 relative z-10 w-full pl-6 pt-6 pr-6">
               <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
                 <BarChart2 size={16} className="text-[#3f809e]" /> {t('CERT DISTRIBUTION', 'สัดส่วนประเภทใบรับรอง')}
               </h2>
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center p-4">
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 800, fill: '#7a8b95'}} axisLine={false} tickLine={false} />
                            <RechartsTooltip 
                                cursor={{ fill: 'transparent' }} 
                                contentStyle={{ borderRadius: '12px', border: '1px solid #eaeaec', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                                itemStyle={{ fontWeight: 800, fontSize: '12px', color: '#212c46' }} 
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </GlassCard>
    );
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCertActionModalOpen, setIsCertActionModalOpen] = useState(false);
  const [certActionType, setCertActionType] = useState<'lookup' | 'add'>('lookup');

  const currentUser = {
      name: user?.name || 'CERT LIBRARY Developer',
      position: user?.role || 'LEAD COMPLIANCE',
      avatar: user?.avatar || 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
  };

  const handleOpenCertAction = (action: 'lookup' | 'add') => {
      setCertActionType(action);
      setIsCertActionModalOpen(true);
  };

  return (
    <div className="pt-4 flex flex-col gap-5 animate-fadeIn w-full px-4 sm:px-8">
      <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl text-[#212c46] tracking-tight uppercase font-exception-greeting leading-none">
                  Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141] font-medium">{currentUser.name}!</span>
              </h1>
              <p className="text-[#748ea1] text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1.5 leading-none">
                  <TrendingUp size={14} className="text-[#d96245]" /> Compliance Rate: <span className="text-[#3f809e]">High (98.2%)</span>
              </p>
          </div>
          <div className="flex flex-row gap-3">
              <button 
                onClick={() => handleOpenCertAction('lookup')}
                className="bg-white text-[#212c46] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md border border-[#cdd0db]/50 transition-all flex items-center gap-2 hover:-translate-y-0.5 whitespace-nowrap"
              >
                  <FileSearch size={16} className="text-[#3f809e]" /> <span className="hidden sm:inline">Certificate Lookup</span>
              </button>
              <button 
                onClick={() => handleOpenCertAction('add')}
                className="bg-gradient-to-r from-[#3f809e] via-[#4d87a8] to-[#748ea1] text-white px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                  <Library size={16} /> <span className="hidden sm:inline">Add Certificate</span>
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
          <CertificateOverview />
          <CertificateDistribution />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <CorporateNews />
          <CorporateAlert />
      </div>

      {/* Cert Action Route Selector Modal */}
      <DraggableModal 
        isOpen={isCertActionModalOpen} 
        onClose={() => setIsCertActionModalOpen(false)}
        title={certActionType === 'lookup' ? 'Select Certificate System' : 'Add New Certificate'}
      >
        <div className="p-6">
            <p className="text-[#7a8b95] text-[11px] font-medium mb-6">
                {certActionType === 'lookup' 
                    ? 'Please select the certificate system you want to lookup or manage:' 
                    : 'Please select the system you want to add a new certificate for:'
                }
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                    onClick={() => {
                        navigate('/certificates/halal' + (certActionType === 'add' ? '?action=add' : ''));
                        setIsCertActionModalOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-6 bg-[#f3f9f3] border-2 border-[#657f4d]/20 hover:border-[#657f4d] rounded-[16px] text-center transition-all hover:shadow-md hover:-translate-y-1"
                >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 text-[#657f4d] shadow-sm">
                        <Award size={24} />
                    </div>
                    <span className="font-black text-[#212c46] uppercase text-[12px] tracking-widest">HALAL System</span>
                    <span className="text-[10px] text-[#7a8b95] mt-1 font-medium">Islamic Council Records</span>
                </button>
                <button 
                    onClick={() => {
                        navigate('/certificates/ms' + (certActionType === 'add' ? '?action=add' : ''));
                        setIsCertActionModalOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-6 bg-[#f0f4fa] border-2 border-[#3f809e]/20 hover:border-[#3f809e] rounded-[16px] text-center transition-all hover:shadow-md hover:-translate-y-1"
                >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 text-[#3f809e] shadow-sm">
                        <Briefcase size={24} />
                    </div>
                    <span className="font-black text-[#212c46] uppercase text-[12px] tracking-widest">MS Standards</span>
                    <span className="text-[10px] text-[#7a8b95] mt-1 font-medium">ISO / GMP / HACCP</span>
                </button>
            </div>
            <div className="mt-8 flex justify-end">
                <button onClick={() => setIsCertActionModalOpen(false)} className="px-5 py-2.5 bg-gray-100 text-[#7a8b95] font-black uppercase tracking-widest rounded-xl text-[10px] hover:bg-gray-200">Cancel</button>
            </div>
        </div>
      </DraggableModal>
    </div>
  );
}
