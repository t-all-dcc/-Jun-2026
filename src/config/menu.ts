import { 
  LayoutDashboard,
  BrainCircuit,
  Calendar,
  Bell,
  Users,
  FileText,
  HeartHandshake,
  Clock,
  CalendarDays,
  Banknote,
  Gift,
  AlertTriangle,
  UserPlus,
  MessageSquare,
  ShieldCheck,
  Target,
  Network,
  GraduationCap,
  PieChart,
  Settings,
  Briefcase,
  Heart,
  Award,
  CheckSquare,
  ClipboardList
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
  { id: 'dashboard', path: '/', name: 'HR HOME', nameTh: 'หน้าหลัก', icon: LayoutDashboard, category: 'TOP' },
  { id: 'copilot', path: '/copilot', name: 'AI COPILOT', nameTh: 'ผู้ช่วย AI', icon: BrainCircuit, category: 'TOP' },
  { id: 'calendar', path: '/calendar', name: 'CALENDAR', nameTh: 'ปฏิทิน', icon: Calendar, category: 'TOP' },
  { id: 'notifications', path: '/notifications', name: 'NOTIFICATIONS', nameTh: 'การแจ้งเตือน', icon: Bell, category: 'TOP' },
  
  // CORE HR & OPERATIONS
  { 
    id: 'employees', 
    name: 'EMPLOYEES', 
    nameTh: 'พนักงาน',
    icon: Users, 
    category: 'CORE HR & OPERATIONS',
    subItems: [
      { id: 'emp_directory', name: 'EMPLOYEE DIRECTORY', nameTh: 'ทำเนียบพนักงาน', path: '/hr/employees/directory' },
      { id: 'emp_org_hierarchy', name: 'ORGANIZATIONAL HIERARCHY', nameTh: 'โครงสร้างองค์กร', path: '/hr/employees/hierarchy' },
      { id: 'emp_salary_master', name: 'SALARY MASTER DATA', nameTh: 'ข้อมูลฐานเงินเดือน', path: '/hr/employees/salary-master', isConfidential: true },
      { id: 'emp_onboarding', name: 'ONBOARDING', nameTh: 'การรับพนักงานใหม่', path: '/hr/employees/onboarding' },
      { id: 'emp_offboarding', name: 'OFFBOARDING', nameTh: 'พ้นสภาพการเป็นพนักงาน', path: '/hr/employees/offboarding' }
    ]
  },
  { 
    id: 'job_description', 
    name: 'JOB DESCRIPTION', 
    nameTh: 'ลักษณะงาน',
    icon: FileText, 
    category: 'CORE HR & OPERATIONS',
    subItems: [
      { id: 'jd_repository', name: 'JD REPOSITORY', nameTh: 'คลังเอกสารลักษณะงาน', path: '/hr/jd' }
    ]
  },
  { 
    id: 'labor_relations', 
    name: 'LABOR RELATIONS', 
    nameTh: 'แรงงานสัมพันธ์',
    icon: Heart, 
    category: 'CORE HR & OPERATIONS',
    subItems: [
      { id: 'lr_union', name: 'UNION & GRIEVANCES', nameTh: 'สหภาพและร้องทุกข์', path: '/hr/labor/union' },
      { id: 'lr_engagement', name: 'ENGAGEMENT & RELATIONSHIP', nameTh: 'ความผูกพันและสายสัมพันธ์', path: '/hr/labor/engagement' },
      { id: 'lr_sports', name: 'SPORTS & SOCIAL EVENTS', nameTh: 'กีฬาสีและกิจกรรมกลุ่ม', path: '/hr/labor/sports' },
      { id: 'lr_news', name: 'INTERNAL PR & NEWS', nameTh: 'ประชาสัมพันธ์ภายในและข่าวสาร', path: '/hr/labor/news' },
      { id: 'lr_activities', name: 'EXTERNAL ACTIVITIES', nameTh: 'กิจกรรมภายนอกองค์กร', path: '/hr/labor/activities' }
    ]
  },
  { 
    id: 'time_attendance', 
    name: 'TIME & ATTENDANCE', 
    nameTh: 'เวลาปฏิบัติงาน',
    icon: Clock, 
    category: 'CORE HR & OPERATIONS',
    subItems: [
      { id: 'ta_time', name: 'TIME & ATTENDANCE', nameTh: 'เวลาปฏิบัติงาน', path: '/hr/time' },
      { id: 'ta_shift', name: 'SHIFT SCHEDULES', nameTh: 'ตารางกะการทำงาน', path: '/hr/time/shifts' },
      { id: 'ta_overtime', name: 'OVERTIME', nameTh: 'การล่วงเวลา', path: '/hr/time/overtime' }
    ]
  },
  { 
    id: 'leave_management', 
    name: 'LEAVE MANAGEMENT', 
    nameTh: 'การลาหยุด',
    icon: CalendarDays, 
    category: 'CORE HR & OPERATIONS',
    subItems: [
      { id: 'leave_requests', name: 'LEAVE REQUESTS (HR)', nameTh: 'คำร้องการลา', path: '/hr/leave/requests' },
      { id: 'leave_balances', name: 'LEAVE BALANCES (STAFF)', nameTh: 'ยอดคงเหลือการลา', path: '/hr/leave/balances' },
      { id: 'leave_holidays', name: 'HOLIDAYS', nameTh: 'วันหยุดบริษัท', path: '/hr/leave/holidays' }
    ]
  },
  { 
    id: 'payroll', 
    name: 'PAYROLL', 
    nameTh: 'เงินเดือน',
    icon: Banknote, 
    category: 'CORE HR & OPERATIONS',
    subItems: [
      { id: 'payroll_calc', name: 'PAYROLL CALCULATION', nameTh: 'คำนวณเงินเดือน', path: '/hr/payroll/calculation', isConfidential: true },
      { id: 'payroll_slips', name: 'PAYSLIPS (HR)', nameTh: 'สลิปเงินเดือน (HR)', path: '/hr/payroll/payslips', isConfidential: true },
      { id: 'payroll_my_slips', name: 'MY PAYSLIPS (STAFF)', nameTh: 'สลิปเงินเดือนของฉัน', path: '/hr/payroll/my-payslips' },
      { id: 'payroll_expenses', name: 'EXPENSES', nameTh: 'ค่าใช้จ่ายเบิกจ่าย', path: '/hr/payroll/expenses' }
    ]
  },
  { 
    id: 'benefits', 
    name: 'BENEFITS', 
    nameTh: 'สวัสดิการ',
    icon: Gift, 
    category: 'CORE HR & OPERATIONS',
    subItems: [
      { id: 'benefit_welfare', name: 'BENEFITS & WELFARE', nameTh: 'ผลประโยชน์และสวัสดิการ', path: '/hr/benefits' }
    ]
  },
  { 
    id: 'disciplinary', 
    name: 'DISCIPLINARY', 
    nameTh: 'วินัยพนักงาน',
    icon: AlertTriangle, 
    category: 'CORE HR & OPERATIONS',
    subItems: [
      { id: 'disc_regulations', name: 'COMPANY REGULATIONS', nameTh: 'ระเบียบข้อบังคับ', path: '/hr/disciplinary/regulations' },
      { id: 'disc_law', name: 'DISCIPLINARY & LABOR LAW', nameTh: 'พ.ร.บ. คุ้มครองแรงงาน', path: '/hr/disciplinary/law' },
      { id: 'disc_warning', name: 'WARNING LETTER BUILDER', nameTh: 'สร้างหนังสือเตือน', path: '/hr/disciplinary/warning-builder' },
      { id: 'disc_investigation', name: 'INVESTIGATION', nameTh: 'การสอบสวน', path: '/hr/disciplinary/investigation' },
      { id: 'disc_punishment', name: 'PUNISHMENT ACTIONS', nameTh: 'บทลงโทษ', path: '/hr/disciplinary/punishment' }
    ]
  },

  // RECRUITMENT
  { 
    id: 'recruitment', 
    name: 'RECRUITMENT', 
    nameTh: 'สรรหาพนักงาน',
    icon: UserPlus, 
    category: 'RECRUITMENT',
    subItems: [
      { id: 'rect_request', name: 'MANPOWER REQUEST', nameTh: 'ขออัตรากำลัง', path: '/recruitment/request' },
      { id: 'rect_planning', name: 'MANPOWER PLANNING', nameTh: 'วางแผนอัตรากำลัง', path: '/recruitment/planning' },
      { id: 'rect_vacancies', name: 'JOB VACANCIES', nameTh: 'ตำแหน่งว่าง', path: '/recruitment/vacancies' },
      { id: 'rect_openings', name: 'JOB OPENINGS', nameTh: 'ประกาศรับสมัคร', path: '/recruitment/openings' },
      { id: 'rect_tracking', name: 'CANDIDATES TRACKING', nameTh: 'ติดตามผู้สมัคร', path: '/recruitment/tracking' }
    ]
  },
  { 
    id: 'interview', 
    name: 'INTERVIEW', 
    nameTh: 'สัมภาษณ์งาน',
    icon: MessageSquare, 
    category: 'RECRUITMENT',
    subItems: [
      { id: 'intv_schedule', name: 'INTERVIEW SCHEDULE', nameTh: 'ตารางสัมภาษณ์', path: '/recruitment/interview/schedule' },
      { id: 'intv_interviews', name: 'INTERVIEWS', nameTh: 'สัมภาษณ์', path: '/recruitment/interview/session' }
    ]
  },
  { 
    id: 'probation', 
    name: 'PROBATION', 
    nameTh: 'ทดลองงาน',
    icon: ShieldCheck, 
    category: 'RECRUITMENT',
    subItems: [
      { id: 'prob_eval', name: 'PROBATION EVALUATION', nameTh: 'ประเมินผ่านทดลองงาน', path: '/recruitment/probation' }
    ]
  },

  // PERFORMANCE & DEVELOPMENT
  { 
    id: 'performance_mgt', 
    name: 'PERFORMANCE MGT.', 
    nameTh: 'ประเมินผลงาน',
    icon: Target, 
    category: 'PERFORMANCE & DEVELOPMENT',
    subItems: [
      { id: 'perf_kpi', name: 'KPI', nameTh: 'ตัวชี้วัด', path: '/performance/kpi' },
      { id: 'perf_eval', name: 'EVALUATION & APPRAISALS', nameTh: 'ประเมินปฏิบัติงาน', path: '/performance/evaluation' },
      { id: 'perf_historic', name: 'HISTORIC TRACKING', nameTh: 'ประวัติการประเมิน', path: '/performance/history' }
    ]
  },
  { 
    id: 'talent_planning', 
    name: 'TALENT PLANNING', 
    nameTh: 'วางแผนบุคลากร',
    icon: Network, 
    category: 'PERFORMANCE & DEVELOPMENT',
    subItems: [
      { id: 'talent_skill', name: 'SKILL MATRIX', nameTh: 'ทักษะพนักงาน', path: '/performance/talent/skills' },
      { id: 'talent_career', name: 'CAREER PATH', nameTh: 'เส้นทางความก้าวหน้า', path: '/performance/talent/career' },
      { id: 'talent_succession', name: 'SUCCESSION PLAN', nameTh: 'บุคคลสืบทอดตำแหน่ง', path: '/performance/talent/succession' }
    ]
  },
  { 
    id: 'talent_development', 
    name: 'TALENT DEVELOPMENT', 
    nameTh: 'พัฒนาบุคลากร',
    icon: GraduationCap, 
    category: 'PERFORMANCE & DEVELOPMENT',
    subItems: [
      { id: 'dev_orientation', name: 'ORIENTATION TRAINING', nameTh: 'อบรมปฐมนิเทศ', path: '/performance/dev/orientation' },
      { id: 'dev_ojt', name: 'OJT TRAINING', nameTh: 'ฝึกสอนหน้างาน', path: '/performance/dev/ojt' },
      { id: 'dev_inhouse', name: 'IN-HOUSE TRAINING', nameTh: 'อบรมภายในองค์กร', path: '/performance/dev/inhouse' },
      { id: 'dev_public', name: 'PUBLIC & SEMINAR', nameTh: 'อบรมสัมมนาภายนอก', path: '/performance/dev/public' }
    ]
  },

  // DATA & ANALYTICS
  { 
    id: 'hr_reports', 
    name: 'HR REPORTS & INSIGHTS', 
    nameTh: 'รายงานผลทรัพยากรบุคคล',
    icon: PieChart, 
    category: 'DATA & ANALYTICS',
    subItems: [
      { id: 'rep_summary', name: 'SUMMARY REPORT', nameTh: 'รายงานสรุป', path: '/reports/summary' },
      { id: 'rep_workforce', name: 'WORKFORCE REPORT', nameTh: 'รายงานกำลังคน', path: '/reports/workforce' },
      { id: 'rep_turnover', name: 'TURNOVER ANALYSIS', nameTh: 'วิเคราะห์การเข้าออกพนักงาน', path: '/reports/turnover' }
    ]
  },

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
