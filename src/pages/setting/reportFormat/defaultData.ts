import { PageConfig, StandardConfig, SignatureConfig, CompanyConfig } from './types';

export const DEFAULT_LOGO_BASE64 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" stroke="%233f809e" stroke-width="6"/><path d="M50 20 L75 65 L25 65 Z" fill="%23b58c4f"/><rect x="42" y="45" width="16" height="16" rx="3" fill="%23212c46"/></svg>`;

export const DEFAULT_PAGES: PageConfig[] = [
  {
    id: 'page-1',
    moduleMenu: 'Time Attendance',
    reportTitleTh: 'รายงานเวลาการทำงานประจำวัน',
    reportTitleEn: 'Daily Timecard Record',
    documentCode: 'FM-HR-TM-001',
    revisionNo: '02',
    issueDate: '2026-01-15',
    orientation: 'portrait',
    showSignatures: true,
  },
  {
    id: 'page-2',
    moduleMenu: 'Payroll',
    reportTitleTh: 'รายงานสรุปบัญชีเงินเดือน',
    reportTitleEn: 'Payroll Summary Report',
    documentCode: 'FM-HR-PR-002',
    revisionNo: '01',
    issueDate: '2026-03-10',
    orientation: 'landscape',
    showSignatures: true,
  },
  {
    id: 'page-3',
    moduleMenu: 'Leave Management',
    reportTitleTh: 'ทะเบียนคุมวันหยุดพักผ่อนประจำปี',
    reportTitleEn: 'Annual Leave Register',
    documentCode: 'FM-HR-LV-003',
    revisionNo: '00',
    issueDate: '2026-05-01',
    orientation: 'portrait',
    showSignatures: false,
  }
];

export const DEFAULT_PORTRAIT_STANDARD: StandardConfig = {
  paperSize: 'A4',
  marginTop: 15,
  marginBottom: 15,
  marginLeft: 15,
  marginRight: 15,
  fontCompany: 15,
  fontMetaGrid: 10,
  fontReportTitle: 16,
  fontContent: 11,
  fontSignature: 10,
  fontFooter: 9,
};

export const DEFAULT_LANDSCAPE_STANDARD: StandardConfig = {
  paperSize: 'A4',
  marginTop: 12,
  marginBottom: 12,
  marginLeft: 18,
  marginRight: 18,
  fontCompany: 14,
  fontMetaGrid: 9,
  fontReportTitle: 15,
  fontContent: 10,
  fontSignature: 9,
  fontFooter: 8,
};

export const DEFAULT_COMPANY_CONFIG: CompanyConfig = {
  companyNameTh: 'บริษัท ที ออลล์ อินเทลลิเจนซ์ จำกัด',
  companyNameEn: 'T All Intelligence Co., Ltd.',
  taxId: '0-1055-57149-33-2',
  companyAddressTh: 'สำนักงานใหญ่ : 46 หมู่ที่ 5 ตำบลคลองสี่ อำเภอคลองหลวง จังหวัดปทุมธานี 12120',
  companyAddressEn: 'Head Office : 46 Moo 5, Klong 4, Klong Luang, Pathumthani Thailand 12120',
  companyPhone: '082-569-5654, 091-516-5999',
  companyEmail: 'tallintelligence.ho@gmail.com',
  companyLogo: DEFAULT_LOGO_BASE64,
};

export const DEFAULT_SIGNATURE_CONFIG: SignatureConfig = {
  preparedByName: 'Phichamon S.',
  preparedByTitle: 'HR Officer',
  reviewedByName: 'Anan K.',
  reviewedByTitle: 'HR Manager',
  approvedByName: 'Somchai T.',
  approvedByTitle: 'Managing Director',
};
