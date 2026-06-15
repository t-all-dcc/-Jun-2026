import { 
  LayoutDashboard,
  BrainCircuit,
  Calendar,
  Users,
  Briefcase,
  Heart,
  AlertTriangle,
  Clock,
  CalendarDays,
  Banknote,
  Award,
  UserPlus,
  CheckSquare,
  Target,
  Network,
  GraduationCap,
  PieChart,
  Settings,
  Scale,
  Shield,
  FileSearch,
  FolderOpen,
  MessageSquare,
  ClipboardList,
  BookOpen
} from 'lucide-react';

export interface MenuItem {
  id: string;
  path?: string;
  name: string;
  nameTh?: string;
  icon?: any;
  isConfidential?: boolean;
  category?: string;
  subItems?: { id: string; name: string; nameTh?: string; path: string; isConfidential?: boolean }[];
}

export const MENU_ITEMS: MenuItem[] = [
  // TOP LEVEL
  { id: 'dashboard', path: '/', name: 'CERT HOME', nameTh: 'หน้าหลัก', icon: LayoutDashboard, category: 'TOP' },
  { id: 'copilot', path: '/copilot', name: 'AI COPILOT', nameTh: 'ผู้ช่วย AI', icon: BrainCircuit, category: 'TOP' },
  { id: 'calendar', path: '/calendar', name: 'CALENDAR', nameTh: 'ปฏิทิน', icon: Calendar, category: 'TOP' },
  
  // HALAL CERTIFICATES
  { id: 'cert_halal_supplier', name: 'SUPPLIER HALAL CERTS', nameTh: 'ใบรับรองฮาลาลผู้ขาย (วัตถุดิบ)', path: '/certificates/supplier-halal', icon: FolderOpen, category: 'HALAL CERTIFICATES' },
  { id: 'cert_halal_company', name: 'COMPANY HALAL CERTS', nameTh: 'ใบรับรองฮาลาลองค์กร', path: '/certificates/company-halal', icon: BookOpen, category: 'HALAL CERTIFICATES' },

  // COMPLIANCE & RENEWALS
  { id: 'comp_expirations', name: 'UPCOMING EXPIRATIONS', nameTh: 'ใบรับรองใกล้หมดอายุ', path: '/compliance/expirations', icon: Clock, category: 'COMPLIANCE & RENEWALS' },
  { id: 'comp_tracking', name: 'RENEWAL TRACKING', nameTh: 'ติดตามการต่ออายุ', path: '/compliance/tracking', icon: CheckSquare, category: 'COMPLIANCE & RENEWALS' },
  { id: 'comp_audit', name: 'AUDIT PREPARATION', nameTh: 'เตรียมความพร้อมตรวจประเมิน', path: '/compliance/audit', icon: ClipboardList, category: 'COMPLIANCE & RENEWALS' },

  // DATA & ANALYTICS
  { id: 'rep_dashboard', name: 'COMPLIANCE DASHBOARD', nameTh: 'แดชบอร์ดสรุป', path: '/reports/compliance', icon: PieChart, category: 'DATA & ANALYTICS' },
  { id: 'rep_matrix', name: 'CERTIFICATE MATRIX', nameTh: 'สถานะใบรับรอง', path: '/reports/matrix', icon: Network, category: 'DATA & ANALYTICS' },

  // ADMINISTRATION
  { 
    id: 'system_settings', 
    name: 'SETTINGS', 
    nameTh: 'การตั้งค่าระบบ',
    icon: Settings, 
    category: 'ADMINISTRATION',
    subItems: [
      { id: 'user_permission', name: 'USER PERMISSION', nameTh: 'สิทธิ์ผู้ใช้งาน', path: '/permissions' },
      { id: 'system_config', name: 'SYSTEM CONFIG', nameTh: 'ค่าคอนฟิกระบบ', path: '/settings' },
      { id: 'dev_permit', name: 'DEV PERMIT BETA', nameTh: 'สิทธิ์ผู้พัฒนา', path: '/dev-permit' },
      { id: 'dev_logs', name: 'SYSTEM LOGS', nameTh: 'บันทึกระบบ', path: '/dev-logs' },
      { id: 'google_sheets_sync', name: 'GOOGLE SHEETS SYNC', nameTh: 'ซิงค์ Google Sheets', path: '/settings/sheets-sync' },
      { id: 'background_auto_sync', name: 'AUTO SYNC', nameTh: 'ซิงค์อัตโนมัติ', path: '/settings/auto-sync' },
      { id: 'system_backups', name: 'SYSTEM BACKUPS', nameTh: 'การสำรองข้อมูลระบบ', path: '/settings/backups' },
      { id: 'report_format', name: 'REPORT FORMAT', nameTh: 'รูปแบบรายงาน', path: '/settings/report-format' },
      { id: 'gmail_settings', name: 'GMAIL INTEGRATION', nameTh: 'ตั้งค่าระบบ Gmail', path: '/settings/gmail' }
    ]
  }
];
