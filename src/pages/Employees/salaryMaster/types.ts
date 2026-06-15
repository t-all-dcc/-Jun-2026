export interface SalaryHistory {
  date: string;
  baseSalary: number;
  payType: "Monthly" | "Daily" | string;
  reason: string;
}

export interface OtherItem {
  label: string;
  amount: number;
}

export interface SalaryRecord {
  id: string;
  empId: string;
  nameTh: string;
  nameEn: string;
  image?: string;
  dept: string;
  jobTitle: string;
  payType: "Monthly" | "Daily" | string;
  baseSalary: number;
  workingDays?: number;
  allowancePos: number;
  allowanceIncentive: number;
  allowanceTravel: number;
  allowanceMeal: number;
  allowanceAccommodation: number;
  allowanceRisk: number;
  otherIncomes: OtherItem[];
  deductTax: number;
  deductSSO: number;
  deductHousing: number;
  deductLoan: number;
  otherDeductions: OtherItem[];
  bank: string;
  bankAcc: string;
  status: string;
  lastUpdate: string;
  history: SalaryHistory[];
}

export const THEME = {
  primary: '#851c24', 
  primaryDark: '#932c2e', 
  accent: '#b58c4f', 
  textMain: '#2f2926', 
  textMuted: '#414757', 
  textSubtle: '#606a5f', 
  palette: { 
    gold: '#b58c4f', 
    rust: '#932c2e', 
    copper: '#c5724e', 
    maroon: '#851c24', 
    brick: '#b22026', 
    charcoal: '#414757', 
    rose: '#ab7d82', 
    cream: '#f3f3f1', 
    forestDark: '#1b2826', 
    ochre: '#a1691e', 
    slateDark: '#606a5f', 
    olive: '#508660', 
    cerulean: '#3f809e', 
    navyBlue: '#212c46'
  }
};
