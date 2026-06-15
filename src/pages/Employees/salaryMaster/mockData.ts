import { SalaryRecord } from './types';
import { 
  DollarSign, Briefcase, Award, Coffee, Receipt, HeartPulse
} from 'lucide-react';

export const INITIAL_SALARIES: SalaryRecord[] = [
  { 
    id: 'sal-1', empId: 'EMP-24001', nameTh: 'สมชาย มุ่งมั่น', nameEn: 'Somchai Mungmun', 
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
    dept: 'IT', jobTitle: 'Senior Developer', 
    payType: 'Monthly',
    baseSalary: 65000, workingDays: 30,
    allowancePos: 5000, allowanceIncentive: 2000, allowanceTravel: 2000, allowanceMeal: 1500, allowanceAccommodation: 0, allowanceRisk: 0,
    otherIncomes: [{ label: 'Internet Allowance', amount: 500 }],
    deductTax: 3500, deductSSO: 750, deductHousing: 0, deductLoan: 0,
    otherDeductions: [],
    bank: 'KBank', bankAcc: '012-3-45678-9',
    status: 'Active', lastUpdate: '2024-01-15',
    history: [
        { date: '2023-01-15', baseSalary: 60000, payType: 'Monthly', reason: 'Annual Increment 2023' },
        { date: '2024-01-15', baseSalary: 65000, payType: 'Monthly', reason: 'Promotion to Senior' }
    ]
  },
  { 
    id: 'sal-2', empId: 'EMP-22045', nameTh: 'วิภาดา แสงงาม', nameEn: 'Wipada Saengngam', 
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    dept: 'QA', jobTitle: 'QA Manager', 
    payType: 'Monthly',
    baseSalary: 85000, workingDays: 30,
    allowancePos: 10000, allowanceIncentive: 0, allowanceTravel: 3500, allowanceMeal: 1500, allowanceAccommodation: 2000, allowanceRisk: 0,
    otherIncomes: [],
    deductTax: 5800, deductSSO: 750, deductHousing: 0, deductLoan: 0,
    otherDeductions: [],
    bank: 'SCB', bankAcc: '987-6-54321-0',
    status: 'Active', lastUpdate: '2023-12-01',
    history: [
        { date: '2022-12-01', baseSalary: 80000, payType: 'Monthly', reason: 'New Hire' },
        { date: '2023-12-01', baseSalary: 85000, payType: 'Monthly', reason: 'Annual Increment 2024' }
    ]
  },
  { 
    id: 'sal-3', empId: 'EMP-24050', nameTh: 'สมหมาย ใจดี', nameEn: 'Sommai Jaidee', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    dept: 'PRODUCTION', jobTitle: 'Production Sup', 
    payType: 'Daily',
    baseSalary: 550, workingDays: 26,
    allowancePos: 0, allowanceIncentive: 1500, allowanceTravel: 1000, allowanceMeal: 1500, allowanceAccommodation: 0, allowanceRisk: 500,
    otherIncomes: [{ label: 'Shift Allowance', amount: 1000 }],
    deductTax: 0, deductSSO: 750, deductHousing: 1500, deductLoan: 500,
    otherDeductions: [],
    bank: 'BBL', bankAcc: '111-2-33344-5',
    status: 'Active', lastUpdate: '2024-05-15',
    history: [
        { date: '2024-05-15', baseSalary: 550, payType: 'Daily', reason: 'New Hire (Daily Worker)' }
    ]
  }
];

export const SYSTEM_COMPENSATION_CONFIGS = [
  { id: 'cfg_base_salary', label: 'Base Salaries Baseline', icon: DollarSign, desc: 'ฐานเงินเดือนหลักประจำและอัตราจ้างพนักงานรายวัน (Base & Daily Baselines)' },
  { id: 'cfg_allowance_pos', label: 'Position Allowance Gate', icon: Briefcase, desc: 'ค่าตำแหน่งผู้จัดการ หัวหน้างาน และระดับชำนาญการครึ่งปีหลัง' },
  { id: 'cfg_allowance_inc', label: 'Performance Incentives Lock', icon: Award, desc: 'เงินรางวัลตามยอดส่งและสิทธิทำงานคงที่ของฝ่ายผลิตและขาย' },
  { id: 'cfg_allowance_std', label: 'Standard Welfare Outlays', icon: Coffee, desc: 'ประเภทรวมค่าเดินทาง ค่าอาหาร ค่าพาหนะเดินทาง และค่าสวัสดิการที่ทำงาน' },
  { id: 'cfg_deduct_tax', label: 'Withholding Tax Matrix', icon: Receipt, desc: 'สูตรหักบัญชีภาษี พ.ง.ด. 1 ของบุคลากรถาวร ณ ที่จ่ายรายเดี่ยว' },
  { id: 'cfg_sso_auto', label: 'Social Security Limit Gate', icon: HeartPulse, desc: 'ตัวสมทบกองทุนประกันสังคม 5% อัตโนมัติ สูงสุดไม่เกิน 750 บาท' }
];
